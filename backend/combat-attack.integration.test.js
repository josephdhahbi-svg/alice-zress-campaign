"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createCombatEngine}=require("./combat-engine");
test("server rolls attack, doubles critical dice, limits actions, and replays without reroll",()=>{
 const db=new Database(":memory:");
 try{
  db.pragma("foreign_keys=ON");migrate(db);
  db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("c","C","now");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'DM')").run("c","dm");
  let calls=0;
  const engine=createCombatEngine(db,{rollDie:sides=>{calls++;return sides===20?20:4;}});
  engine.createEncounter({campaignId:"c",encounterId:"e",actorId:"dm",combatants:[
   {combatantId:"alice",initiative:20,hp:5,maxHp:9},
   {combatantId:"foe",initiative:10,hp:20,maxHp:20}
  ]});
  const action={campaignId:"c",encounterId:"e",actorId:"dm",actionId:"a",kind:"ATTACK",targetId:"foe",attackBonus:3,armorClass:19,damageCount:2,damageSides:6,damageBonus:1};
  const first=engine.applyAction(action);
  assert.equal(first.attack.critical,true);
  assert.equal(first.attack.damage,17);
  assert.equal(first.combatants[1].hp,3);
  assert.equal(calls,5);
  assert.equal(engine.applyAction(action).duplicate,true);
  assert.equal(calls,5);
  assert.throws(()=>engine.applyAction({...action,actionId:"b"}),/ACTION_ALREADY_USED/);
  assert.equal(calls,5);
  engine.applyAction({campaignId:"c",encounterId:"e",actorId:"dm",actionId:"turn1",kind:"END_TURN"});
  const second=engine.applyAction({...action,actionId:"c"});
  assert.equal(second.attack.critical,true);
  assert.equal(second.combatants[1].hp,0);
  assert.equal(calls,10);
 }finally{db.close();}
});
test("invalid attack and server RNG failure roll back action and HP",()=>{
 const db=new Database(":memory:");
 try{
  db.pragma("foreign_keys=ON");migrate(db);
  db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("c","C","now");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'DM')").run("c","dm");
  const engine=createCombatEngine(db,{rollDie:()=>0});
  engine.createEncounter({campaignId:"c",encounterId:"e",actorId:"dm",combatants:[{combatantId:"foe",initiative:1,hp:9,maxHp:9}]});
  const attack={campaignId:"c",encounterId:"e",actorId:"dm",actionId:"bad",kind:"ATTACK",targetId:"foe",attackBonus:0,armorClass:10,damageCount:1,damageSides:6,damageBonus:0};
  assert.throws(()=>engine.applyAction(attack),/INVALID_SERVER_ROLL/);
  assert.equal(engine.getEncounter("c","e").combatants[0].hp,9);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_combat_actions").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_combat_turn_usage").get().n,0);
  assert.throws(()=>engine.applyAction({...attack,damageCount:11}),/INVALID_ATTACK/);
 }finally{db.close();}
});
