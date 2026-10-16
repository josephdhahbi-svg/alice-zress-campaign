"use strict";
/** Campaign-scoped combat state. Only a DM may create or resolve encounters.
 * No automatic loot, levels, spells or relics are awarded.
 */
const ID=/^[a-zA-Z0-9:_-]{1,100}$/;
const validId=x=>typeof x==="string"&&ID.test(x);
const integer=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const SCHEMA=`
CREATE TABLE IF NOT EXISTS vtt_combat_encounters (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 encounter_id TEXT NOT NULL, round INTEGER NOT NULL DEFAULT 1 CHECK(round>=1),
 turn_index INTEGER NOT NULL DEFAULT 0 CHECK(turn_index>=0),
 status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE','ENDED')),
 PRIMARY KEY(campaign_id,encounter_id)
);
CREATE TABLE IF NOT EXISTS vtt_combat_combatants (
 campaign_id TEXT NOT NULL, encounter_id TEXT NOT NULL, combatant_id TEXT NOT NULL,
 owner_actor_id TEXT, initiative INTEGER NOT NULL CHECK(initiative BETWEEN -100 AND 100),
 hp INTEGER NOT NULL CHECK(hp BETWEEN 0 AND 100000), max_hp INTEGER NOT NULL CHECK(max_hp BETWEEN 1 AND 100000),
 conditions_json TEXT NOT NULL DEFAULT '[]',
 PRIMARY KEY(campaign_id,encounter_id,combatant_id),
 FOREIGN KEY(campaign_id,encounter_id) REFERENCES vtt_combat_encounters(campaign_id,encounter_id) ON DELETE CASCADE,
 FOREIGN KEY(campaign_id,owner_actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
CREATE TABLE IF NOT EXISTS vtt_combat_actions (
 campaign_id TEXT NOT NULL, encounter_id TEXT NOT NULL, action_id TEXT NOT NULL,
 actor_id TEXT NOT NULL, action_json TEXT NOT NULL, result_json TEXT NOT NULL,
 created_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,encounter_id,action_id),
 FOREIGN KEY(campaign_id,encounter_id) REFERENCES vtt_combat_encounters(campaign_id,encounter_id) ON DELETE CASCADE
);
`;
function createCombatEngine(db){
 if(!db||typeof db.transaction!=="function")throw new TypeError("SQLite database required");
 db.exec(SCHEMA);
 const membership=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const authorize=(campaignId,actorId)=>{
  if(!validId(campaignId)||!validId(actorId))throw new TypeError("INVALID_ID");
  if(membership.get(campaignId,actorId)?.role!=="DM")throw new Error("DM_REQUIRED");
 };
 const order=(campaignId,encounterId)=>db.prepare("SELECT combatant_id,initiative,hp,max_hp,conditions_json,owner_actor_id FROM vtt_combat_combatants WHERE campaign_id=? AND encounter_id=? ORDER BY initiative DESC,combatant_id ASC").all(campaignId,encounterId);
 const get=(campaignId,encounterId)=>{
  if(!validId(campaignId)||!validId(encounterId))throw new TypeError("INVALID_ID");
  const encounter=db.prepare("SELECT * FROM vtt_combat_encounters WHERE campaign_id=? AND encounter_id=?").get(campaignId,encounterId);
  if(!encounter)return null;
  return {...encounter,combatants:order(campaignId,encounterId).map(x=>({...x,conditions:JSON.parse(x.conditions_json),conditions_json:undefined}))};
 };
 const create=db.transaction(({campaignId,encounterId,actorId,combatants})=>{
  authorize(campaignId,actorId);
  if(!validId(encounterId)||!Array.isArray(combatants)||combatants.length<1||combatants.length>40)throw new TypeError("INVALID_ENCOUNTER");
  if(db.prepare("SELECT 1 FROM vtt_combat_encounters WHERE campaign_id=? AND encounter_id=?").get(campaignId,encounterId))throw new Error("ENCOUNTER_EXISTS");
  const ids=new Set();
  for(const c of combatants){
   if(!c||!validId(c.combatantId)||ids.has(c.combatantId)||!integer(c.initiative,-100,100)||!integer(c.maxHp,1,100000)||!integer(c.hp,0,c.maxHp)||c.ownerActorId!==undefined&&(!validId(c.ownerActorId)||!membership.get(campaignId,c.ownerActorId)))throw new TypeError("INVALID_COMBATANT");
   ids.add(c.combatantId);
  }
  db.prepare("INSERT INTO vtt_combat_encounters(campaign_id,encounter_id) VALUES(?,?)").run(campaignId,encounterId);
  const insert=db.prepare("INSERT INTO vtt_combat_combatants(campaign_id,encounter_id,combatant_id,owner_actor_id,initiative,hp,max_hp) VALUES(?,?,?,?,?,?,?)");
  for(const c of combatants)insert.run(campaignId,encounterId,c.combatantId,c.ownerActorId??null,c.initiative,c.hp,c.maxHp);
  return get(campaignId,encounterId);
 });
 const act=db.transaction(({campaignId,encounterId,actorId,actionId,kind,targetId,amount,condition})=>{
  authorize(campaignId,actorId);
  if(!validId(encounterId)||!validId(actionId)||!["DAMAGE","HEAL","ADD_CONDITION","REMOVE_CONDITION","END_TURN","END_ENCOUNTER"].includes(kind))throw new TypeError("INVALID_ACTION");
  const prior=db.prepare("SELECT action_json,result_json FROM vtt_combat_actions WHERE campaign_id=? AND encounter_id=? AND action_id=?").get(campaignId,encounterId,actionId);
  const request=JSON.stringify({kind,targetId:targetId??null,amount:amount??null,condition:condition??null});
  if(prior){if(prior.action_json!==request)throw new Error("IDEMPOTENCY_CONFLICT");return {...JSON.parse(prior.result_json),duplicate:true};}
  const encounter=db.prepare("SELECT * FROM vtt_combat_encounters WHERE campaign_id=? AND encounter_id=?").get(campaignId,encounterId);
  if(!encounter||encounter.status!=="ACTIVE")throw new Error("ENCOUNTER_NOT_ACTIVE");
  const members=order(campaignId,encounterId);
  if(kind==="DAMAGE"||kind==="HEAL"||kind==="ADD_CONDITION"||kind==="REMOVE_CONDITION"){
   if(!validId(targetId))throw new TypeError("INVALID_TARGET");
   const target=members.find(c=>c.combatant_id===targetId);
   if(!target)throw new Error("UNKNOWN_TARGET");
   if(kind==="DAMAGE"||kind==="HEAL"){
    if(!integer(amount,1,100000))throw new TypeError("INVALID_AMOUNT");
    const hp=kind==="DAMAGE"?Math.max(0,target.hp-amount):Math.min(target.max_hp,target.hp+amount);
    db.prepare("UPDATE vtt_combat_combatants SET hp=? WHERE campaign_id=? AND encounter_id=? AND combatant_id=?").run(hp,campaignId,encounterId,targetId);
   }else{
    if(!validId(condition))throw new TypeError("INVALID_CONDITION");
    const conditions=JSON.parse(target.conditions_json);
    const next=kind==="ADD_CONDITION"?[...new Set([...conditions,condition])]:conditions.filter(x=>x!==condition);
    db.prepare("UPDATE vtt_combat_combatants SET conditions_json=? WHERE campaign_id=? AND encounter_id=? AND combatant_id=?").run(JSON.stringify(next),campaignId,encounterId,targetId);
   }
  }else if(kind==="END_TURN"){
   const next=encounter.turn_index+1;
   db.prepare("UPDATE vtt_combat_encounters SET turn_index=?,round=? WHERE campaign_id=? AND encounter_id=?").run(next%members.length,encounter.round+Math.floor(next/members.length),campaignId,encounterId);
  }else{
   db.prepare("UPDATE vtt_combat_encounters SET status='ENDED' WHERE campaign_id=? AND encounter_id=?").run(campaignId,encounterId);
  }
  const result=get(campaignId,encounterId);
  db.prepare("INSERT INTO vtt_combat_actions(campaign_id,encounter_id,action_id,actor_id,action_json,result_json,created_at) VALUES(?,?,?,?,?,?,?)").run(campaignId,encounterId,actionId,actorId,request,JSON.stringify(result),new Date().toISOString());
  return {...result,duplicate:false};
 });
 return {createEncounter:x=>create(x),applyAction:x=>act(x),getEncounter:get};
}
module.exports={SCHEMA,createCombatEngine};
