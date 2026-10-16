"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {initializeFactionPulseEngine}=require("./faction-pulse");
const {createFactionDisputeEngine}=require("./faction-dispute-engine");
function setup(){
 const db=new Database(":memory:");
 db.pragma("foreign_keys=ON");
 initializeFactionPulseEngine(db);
 db.prepare("INSERT INTO factions(faction_id,faction_name,alignment) VALUES(?,?,?)").run("blue","Heroes","BLUE");
 db.prepare("INSERT INTO factions(faction_id,faction_name,alignment) VALUES(?,?,?)").run("red","Villains","RED");
 db.prepare("INSERT INTO factions(faction_id,faction_name,alignment) VALUES(?,?,?)").run("green","Neutral","GREEN");
 db.prepare("INSERT INTO territory_control(territory_id,territory_name,cosmological_sector,controlling_faction_id) VALUES(?,?,?,?)").run("pit","Pit","Underdark","red");
 return {db,engine:createFactionDisputeEngine(db)};
}
test("escalation is bounded and only one dispute remains active",()=>{
 const {db,engine}=setup();
 const first=engine.triggerDispute("pit","blue");
 assert.equal(first.escalationScore,10);
 assert.throws(()=>engine.triggerDispute("pit","green"),/Different aggressor/);
 let last;
 for(let i=0;i<8;i++)last=engine.triggerDispute("pit","blue");
 assert.equal(last.status,"ESCALATED");assert.equal(last.escalationScore,100);
 assert.equal(last.disputeId,first.disputeId);
 assert.equal(db.prepare("SELECT count(*) n FROM faction_disputes").get().n,1);
 db.close();
});
test("resolution updates ownership atomically and never resets garrison",()=>{
 const {db,engine}=setup();
 const first=engine.triggerDispute("pit","blue");
 assert.throws(()=>engine.resolveDispute(first.disputeId,"green"),/participant/);
 const result=engine.resolveDispute(first.disputeId,"blue");
 assert.equal(result.winnerFactionId,"blue");
 assert.equal(db.prepare("SELECT controlling_faction_id FROM territory_control WHERE territory_id='pit'").get().controlling_faction_id,"blue");
 assert.throws(()=>engine.resolveDispute(first.disputeId,"blue"),/resolved/);
 assert.equal(engine.getDispute(first.disputeId).status,"RESOLVED");
 db.close();
});
test("invalid requests and changed territory ownership cannot silently settle",()=>{
 const {db,engine}=setup();
 assert.throws(()=>engine.triggerDispute("missing","blue"),/Unknown/);
 assert.throws(()=>engine.triggerDispute("pit","red"),/already controls/);
 const first=engine.triggerDispute("pit","blue");
 db.prepare("UPDATE territory_control SET controlling_faction_id='green' WHERE territory_id='pit'").run();
 assert.throws(()=>engine.resolveDispute(first.disputeId,"blue"),/ownership changed/);
 assert.equal(engine.getDispute(first.disputeId).status,"PENDING");
 db.close();
});
