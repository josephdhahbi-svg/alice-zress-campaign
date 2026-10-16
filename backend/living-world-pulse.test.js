"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createLivingWorldEngine}=require("./living-world-pulse");
test("world pulse is durable, idempotent, campaign scoped and DM authorized",()=>{
 const db=new Database(":memory:");try{
 db.pragma("foreign_keys=ON");migrate(db);
 const world=createLivingWorldEngine(db);
 for(const c of ["one","two"]){
  db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run(c,c,new Date().toISOString());
  for(const [actor,role] of [["dm","DM"],["player","PLAYER"]])db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run(c,actor,role);
  for(const faction of ["hero","villain"])db.prepare("INSERT INTO vtt_world_factions(campaign_id,faction_id,name,alignment,ideology_axis) VALUES(?,?,?,?,?)").run(c,faction,faction,faction==="hero"?"HERO":"VILLAIN","NEUTRAL");
  db.prepare("INSERT INTO vtt_world_territories(campaign_id,territory_id,name,zone_coords,controlling_faction_id,contested_status) VALUES(?,?,?,?,?,1)").run(c,"zone","Zone","[0,0,0]","hero");
 }
 const input={campaignId:"one",pulseId:"pulse-1",actorId:"dm",drDate:"DR 1492",shifts:[{territoryId:"zone",newFactionId:"villain"}]};
 assert.throws(()=>world.executePulse({...input,actorId:"player"}),/DM_REQUIRED/);
 assert.throws(()=>world.executePulse({...input,pulseId:"invalid",shifts:[{territoryId:"zone",newFactionId:"missing"}]}),/UNKNOWN_FACTION/);
 assert.equal(world.getLedger("one").length,0);
 assert.deepEqual(world.executePulse(input),{duplicate:false,mutations:1,drDate:"DR 1492"});
 assert.equal(world.executePulse(input).duplicate,true);
 assert.equal(world.getLedger("one").length,1);
 assert.equal(world.getLedger("two").length,0);
 assert.equal(db.prepare("SELECT controlling_faction_id FROM vtt_world_territories WHERE campaign_id='one'").get().controlling_faction_id,"villain");
 assert.equal(db.prepare("SELECT controlling_faction_id FROM vtt_world_territories WHERE campaign_id='two'").get().controlling_faction_id,"hero");
 }finally{db.close();}
});
test("failed multi-territory pulse rolls back all mutations",()=>{
 const db=new Database(":memory:");try{
 db.pragma("foreign_keys=ON");migrate(db);const w=createLivingWorldEngine(db);
 db.prepare("INSERT INTO vtt_campaigns VALUES('one','one','now')").run();
 db.prepare("INSERT INTO vtt_campaign_members VALUES('one','dm','DM')").run();
 db.prepare("INSERT INTO vtt_world_factions(campaign_id,faction_id,name,alignment,ideology_axis) VALUES('one','hero','hero','HERO','NEUTRAL')").run();
 db.prepare("INSERT INTO vtt_world_territories(campaign_id,territory_id,name,zone_coords,controlling_faction_id,contested_status) VALUES('one','zone','zone','[0,0,0]','hero',1)").run();
 assert.throws(()=>w.executePulse({campaignId:"one",pulseId:"p1",actorId:"dm",drDate:"DR 1492",shifts:[{territoryId:"zone",newFactionId:"hero"},{territoryId:"missing",newFactionId:"hero"}]}));
 assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_world_pulses").get().n,0);
 assert.equal(db.prepare("SELECT contested_status FROM vtt_world_territories WHERE campaign_id='one'").get().contested_status,1);
 }finally{db.close();}
});
