"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),Database=require("better-sqlite3");
const {migrate}=require("./migrations"),{createChronalTravelEngine}=require("./chronal-travel-engine");
test("chronal travel persists authorized time-space jumps with replay and rollback",()=>{
 const db=new Database(":memory:");db.pragma("foreign_keys=ON");migrate(db);
 try{
  db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("c","Campaign","now");
  for(const [actor,role] of [["dm","DM"],["alice","PLAYER"]])
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c",actor,role);
  db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run("c","alice_zress","alice");
  const engine=createChronalTravelEngine(db);
  assert.throws(()=>engine.initializeLocation({campaignId:"c",characterId:"alice_zress",actorId:"alice"}),/DM_REQUIRED/);
  assert.equal(engine.initializeLocation({campaignId:"c",characterId:"alice_zress",actorId:"dm"}).location.node_id,"pit_ghaunadaur");
  assert.equal(engine.initializeLocation({campaignId:"c",characterId:"alice_zress",actorId:"dm"}).duplicate,true);
  const trip={campaignId:"c",characterId:"alice_zress",actorId:"dm",travelId:"jump1",to:"sigil",arrivalDr:1492,method:"CHRONAL_GATE",evidence:"DM reviewed source-era chronology and verified portal key",expectedRevision:0};
  assert.throws(()=>engine.executeTravel({...trip,actorId:"alice"}),/DM_REQUIRED/);
  assert.equal(engine.executeTravel(trip).location.node_id,"sigil");
  assert.equal(engine.executeTravel(trip).duplicate,true);
  assert.throws(()=>engine.executeTravel({...trip,to:"abyss"}),/IDEMPOTENCY_CONFLICT/);
  assert.throws(()=>engine.executeTravel({...trip,travelId:"jump2"}),/REVISION_CONFLICT/);
  assert.throws(()=>engine.executeTravel({...trip,travelId:"bad",expectedRevision:1,arrivalDr:Infinity}),/INVALID_DR_DATE/);
  assert.equal(engine.getLocation("c","alice_zress").revision,1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_character_travel_events").get().n,1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_character_artifacts").get().n,0);
 }finally{db.close();}
});
