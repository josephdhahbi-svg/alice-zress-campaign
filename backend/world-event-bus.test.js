"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {createWorldEventBus}=require("./world-event-bus");
test("world event outbox is DM-only, idempotent, and isolated",()=>{
 const db=new Database(":memory:");
 try{
  db.exec("CREATE TABLE vtt_campaign_members(campaign_id TEXT,actor_id TEXT,role TEXT)");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c1","dm","DM");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c1","alice","PLAYER");
  const bus=createWorldEventBus(db);
  const data={campaignId:"c1",eventId:"event_1",eventType:"QUEST_COMPLETED",subjectId:"alice",actorId:"dm",evidenceId:"quest_verified_1",payload:{questId:"first_quest"}};
  assert.equal(bus.record(data).duplicate,false);
  assert.equal(bus.record(data).duplicate,true);
  assert.equal(bus.list("c1").length,1);
  assert.equal(bus.list("c2").length,0);
  assert.equal(bus.list("c1")[0].eventType,"QUEST_COMPLETED");
  assert.equal(bus.list("c1")[0].payload,undefined);
  assert.throws(()=>bus.record({...data,eventId:"event_2",actorId:"alice"}),/DM_REQUIRED/);
  assert.throws(()=>bus.record({...data,payload:{questId:"changed"}}),/EVENT_CONFLICT/);
  assert.throws(()=>bus.record({...data,eventId:"event_3",eventType:"FREE_GOLD"}),TypeError);
 }finally{db.close()}
});
