"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createCombatEngine}=require("./combat-engine");
function setup(){
 const db=new Database(":memory:");db.pragma("foreign_keys=ON");migrate(db);
 for(const campaign of ["alpha","beta"]){
  db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run(campaign,campaign,"now");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'DM')").run(campaign,"dm");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run(campaign,"player");
 }
 return {db,engine:createCombatEngine(db)};
}
const combatants=[{combatantId:"alice",initiative:15,hp:5,maxHp:9,ownerActorId:"player"},{combatantId:"foe",initiative:10,hp:8,maxHp:8}];
test("combat initiative, bounded damage/healing, conditions, turn and idempotency",()=>{
 const {db,engine}=setup();try{
  assert.throws(()=>engine.createEncounter({campaignId:"alpha",encounterId:"fight",actorId:"player",combatants}),/DM_REQUIRED/);
  const start=engine.createEncounter({campaignId:"alpha",encounterId:"fight",actorId:"dm",combatants});
  assert.deepEqual(start.combatants.map(x=>x.combatant_id),["alice","foe"]);
  assert.equal(start.combatants[0].hp,5);
  const a={campaignId:"alpha",encounterId:"fight",actorId:"dm",actionId:"a1",kind:"DAMAGE",targetId:"alice",amount:100};
  assert.equal(engine.applyAction(a).combatants[0].hp,0);
  assert.equal(engine.applyAction(a).duplicate,true);
  assert.throws(()=>engine.applyAction({...a,amount:1}),/IDEMPOTENCY_CONFLICT/);
  assert.equal(engine.applyAction({...a,actionId:"a2",kind:"HEAL",amount:100}).combatants[0].hp,9);
  assert.equal(engine.applyAction({...a,actionId:"a3",kind:"ADD_CONDITION",condition:"PRONE"}).combatants[0].conditions[0],"PRONE");
  assert.equal(engine.applyAction({...a,actionId:"a4",kind:"REMOVE_CONDITION",condition:"PRONE"}).combatants[0].conditions.length,0);
  assert.equal(engine.applyAction({...a,actionId:"a5",kind:"END_TURN"}).turn_index,1);
  const next=engine.applyAction({...a,actionId:"a6",kind:"END_TURN"});
  assert.equal(next.round,2);assert.equal(next.turn_index,0);
  assert.equal(engine.applyAction({...a,actionId:"a7",kind:"END_ENCOUNTER"}).status,"ENDED");
  assert.throws(()=>engine.applyAction({...a,actionId:"a8"}),/ENCOUNTER_NOT_ACTIVE/);
  assert.equal(engine.getEncounter("beta","fight"),null);
 }finally{db.close();}
});
test("invalid actions and participants roll back cleanly",()=>{
 const {db,engine}=setup();try{
  assert.throws(()=>engine.createEncounter({campaignId:"alpha",encounterId:"fight",actorId:"dm",combatants:[...combatants,combatants[0]]}),/INVALID_COMBATANT/);
  assert.equal(engine.getEncounter("alpha","fight"),null);
  engine.createEncounter({campaignId:"alpha",encounterId:"fight",actorId:"dm",combatants});
  assert.throws(()=>engine.applyAction({campaignId:"alpha",encounterId:"fight",actorId:"dm",actionId:"bad",kind:"DAMAGE",targetId:"alice",amount:-1}),/INVALID_AMOUNT/);
  assert.equal(engine.getEncounter("alpha","fight").combatants[0].hp,5);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_combat_actions").get().n,0);
 }finally{db.close();}
});
