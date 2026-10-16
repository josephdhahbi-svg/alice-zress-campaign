"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {createChronosReviewEngine}=require("./chronos-review-engine");
test("DM Chronos reviews are campaign scoped, idempotent, and cannot rewrite travel history",()=>{
 const db=new Database(":memory:");
 try{
  db.exec("CREATE TABLE vtt_campaign_members(campaign_id TEXT,actor_id TEXT,role TEXT);CREATE TABLE vtt_characters(campaign_id TEXT,character_id TEXT,owner_actor_id TEXT);CREATE TABLE vtt_character_locations(campaign_id TEXT,character_id TEXT,node_id TEXT,revision INTEGER);");
  db.exec("INSERT INTO vtt_campaign_members VALUES('c1','dm','DM'),('c1','player','PLAYER'),('c2','dm','DM');INSERT INTO vtt_characters VALUES('c1','alice','player');INSERT INTO vtt_character_locations VALUES('c1','alice','pit_ghaunadaur',0);");
  const e=createChronosReviewEngine(db);
  const request={campaignId:"c1",reviewId:"rev1",characterId:"alice",actorId:"dm",anomalyId:"anomaly_spellplague_fracture",d20Roll:18,chronoBonus:3,verdict:"OBSERVED",evidence:"DM examined the temporal evidence."};
  assert.throws(()=>e.review({...request,actorId:"player"}),/DM_REQUIRED/);
  assert.throws(()=>e.review({...request,characterId:"missing"}),/CHARACTER_NOT_FOUND/);
  const first=e.review(request);
  assert.equal(first.duplicate,false);assert.equal(first.applied,false);
  assert.equal(first.record.expected_dc,19);
  assert.equal(first.record.check_succeeded,1);
  assert.equal(e.review(request).duplicate,true);
  assert.throws(()=>e.review({...request,evidence:"Different evidence supplied."}),/IDEMPOTENCY_CONFLICT/);
  assert.equal(e.list("c1","dm").length,1);
  assert.throws(()=>e.list("c1","player"),/DM_REQUIRED/);
  assert.equal(e.list("c2","dm").length,0);
  assert.deepEqual(db.prepare("SELECT node_id,revision FROM vtt_character_locations WHERE campaign_id='c1'").get(),{node_id:"pit_ghaunadaur",revision:0});
 }finally{db.close();}
});
