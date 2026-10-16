"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const secret="test-local-admin-token-which-is-long-enough";
test("quest API prevents player-forged proof and unauthorized rewards",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token:secret,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(r=>server.once("listening",r));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+secret,"Content-Type":"application/json"};
  const send=async(path,headers,body)=>{
   const r=await fetch(base+path,{method:"POST",headers,body:JSON.stringify(body)});
   return {status:r.status,body:await r.json()};
  };
  assert.equal((await send("/api/campaigns",admin,{campaignId:"a",name:"A",actorId:"dm"})).status,201);
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("a","alice");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("a","intruder");
  db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run("a","alice","alice");
  const session=async actorId=>{
   const x=await send("/api/admin/sessions",admin,{actorId});
   assert.equal(x.status,201);
   return {Authorization:"Bearer "+x.body.accessToken,"Content-Type":"application/json"};
  };
  const dm=await session("dm"),alice=await session("alice"),intruder=await session("intruder");
  assert.equal((await send("/api/campaigns/a/quests/catalog",alice,{questId:"Q1",requiredObjectiveIds:["rescue"]})).status,403);
  assert.equal((await send("/api/campaigns/a/quests/catalog",dm,{questId:"Q1",requiredObjectiveIds:["rescue"]})).status,201);
  assert.equal((await send("/api/campaigns/a/quests/catalog/Q1/approve",alice,{})).status,403);
  assert.equal((await send("/api/campaigns/a/quests/catalog/Q1/approve",dm,{})).status,201);
  assert.equal((await send("/api/campaigns/a/quests/catalog/Q1/approve",dm,{})).status,200);
  assert.equal((await send("/api/campaigns/a/quests/Q1/state",alice,{characterId:"alice",toStatus:"ACTIVE",reason:"Quest started",expectedRevision:0})).status,403);
  assert.equal((await send("/api/campaigns/a/quests/Q1/state",dm,{characterId:"alice",toStatus:"ACTIVE",reason:"Quest started",expectedRevision:0})).status,201);
  assert.equal((await send("/api/campaigns/a/quests/Q1/state",dm,{characterId:"alice",toStatus:"FAILED",reason:"Stale request",expectedRevision:0})).status,409);
  const proof={eventId:"proof",expectedRevision:0,eventType:"QUEST_OBJECTIVE_VERIFIED",payload:{characterId:"alice",questId:"Q1",objectiveId:"rescue"}};
  assert.equal((await send("/api/campaigns/a/events",alice,proof)).status,403);
  assert.equal((await send("/api/campaigns/a/events",dm,proof)).status,201);
  const verify={characterId:"alice",questId:"Q1",objectiveId:"rescue",eventId:"proof"};
  const url="/api/campaigns/a/quests/objectives/verify";
  assert.equal((await send(url,intruder,verify)).status,403);
  assert.equal((await send(url,alice,verify)).status,201);
  assert.equal((await send(url,alice,verify)).status,200);
  const completion={characterId:"alice",questId:"Q1",completionEventId:"approved",requiredObjectiveIds:["rescue"]};
  assert.equal((await send("/api/campaigns/a/quests/complete",alice,completion)).status,409);
  assert.equal((await send("/api/campaigns/a/events",dm,{eventId:"approved",expectedRevision:1,eventType:"QUEST_COMPLETION_APPROVED",payload:{characterId:"alice",questId:"Q1",requiredObjectiveIds:["rescue"]}})).status,201);
  assert.equal((await send("/api/campaigns/a/quests/complete",alice,completion)).status,201);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_character_artifacts").get().n,0);
 }finally{await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve()})})}
});
