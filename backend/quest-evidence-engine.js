"use strict";
/** Server-authoritative quest objective and completion ledger.
 * This module intentionally awards NO artifacts: incoming v46 loot is unapproved.
 */
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const valid=x=>typeof x==="string"&&ID.test(x);
function createQuestEvidenceEngine(db){
 if(!db||typeof db.transaction!=="function")throw new TypeError("SQLite database required");
 db.exec(`CREATE TABLE IF NOT EXISTS vtt_quest_catalog (
  campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
  quest_id TEXT NOT NULL,
  required_objectives_json TEXT NOT NULL,
  created_by_actor_id TEXT NOT NULL,
  PRIMARY KEY(campaign_id,quest_id),
  FOREIGN KEY(campaign_id,created_by_actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
 )`);
 const catalog=db.prepare("SELECT required_objectives_json FROM vtt_quest_catalog WHERE campaign_id=? AND quest_id=?");
 const register=db.transaction(({campaignId,questId,actorId,requiredObjectiveIds})=>{
  if(!valid(campaignId)||!valid(questId)||!valid(actorId)||!Array.isArray(requiredObjectiveIds)||
     requiredObjectiveIds.length<1||requiredObjectiveIds.length>50||
     requiredObjectiveIds.some(x=>!valid(x))||new Set(requiredObjectiveIds).size!==requiredObjectiveIds.length)
   throw new TypeError("INVALID_QUEST_DEFINITION");
  if(member.get(campaignId,actorId)?.role!=="DM")throw new Error("DM_REQUIRED");
  const existing=catalog.get(campaignId,questId);
  const encoded=JSON.stringify([...requiredObjectiveIds].sort());
  if(existing){
   if(existing.required_objectives_json!==encoded)throw new Error("QUEST_DEFINITION_IMMUTABLE");
   return {duplicate:true};
  }
  db.prepare("INSERT INTO vtt_quest_catalog VALUES(?,?,?,?)").run(campaignId,questId,encoded,actorId);
  return {duplicate:false};
 });
 const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const character=db.prepare("SELECT owner_actor_id FROM vtt_characters WHERE campaign_id=? AND character_id=?");
 const event=db.prepare("SELECT actor_id,event_type,payload_json FROM vtt_campaign_events WHERE campaign_id=? AND event_id=?");
 const objective=db.prepare("SELECT verified_event_id FROM vtt_quest_objectives WHERE campaign_id=? AND character_id=? AND quest_id=? AND objective_id=?");
 const completed=db.prepare("SELECT completed_event_id FROM vtt_quest_completions WHERE campaign_id=? AND character_id=? AND quest_id=?");
 const check=(campaignId,characterId,actorId)=>{
  if(![campaignId,characterId,actorId].every(valid))throw new TypeError("INVALID_ID");
  const role=member.get(campaignId,actorId)?.role;
  const owner=character.get(campaignId,characterId)?.owner_actor_id;
  if(!role||!owner||(role!=="DM"&&owner!==actorId))throw new Error("NOT_AUTHORIZED");
 };
 const verify=db.transaction(({campaignId,characterId,actorId,questId,objectiveId,eventId})=>{
  check(campaignId,characterId,actorId);
  if(![questId,objectiveId,eventId].every(valid))throw new TypeError("INVALID_ID");
  const definition=catalog.get(campaignId,questId);
  if(!definition)throw new Error("UNKNOWN_QUEST");
  if(!JSON.parse(definition.required_objectives_json).includes(objectiveId))throw new Error("UNKNOWN_OBJECTIVE");
  const prior=objective.get(campaignId,characterId,questId,objectiveId);
  if(prior){
   if(prior.verified_event_id!==eventId)throw new Error("OBJECTIVE_CONFLICT");
   return {duplicate:true};
  }
  if(completed.get(campaignId,characterId,questId))throw new Error("QUEST_ALREADY_COMPLETE");
  const proof=event.get(campaignId,eventId);
  if(!proof||proof.event_type!=="QUEST_OBJECTIVE_VERIFIED")throw new Error("EVIDENCE_REQUIRED");
  let payload;
  try{payload=JSON.parse(proof.payload_json);}catch{throw new Error("INVALID_EVIDENCE");}
  if(payload.characterId!==characterId||payload.questId!==questId||payload.objectiveId!==objectiveId||
     (proof.actor_id!==actorId&&member.get(campaignId,proof.actor_id)?.role!=="DM"))
   throw new Error("EVIDENCE_MISMATCH");
  db.prepare("INSERT INTO vtt_quest_objectives VALUES(?,?,?,?,?)").run(campaignId,characterId,questId,objectiveId,eventId);
  return {duplicate:false};
 });
 const complete=db.transaction(({campaignId,characterId,actorId,questId,completionEventId,requiredObjectiveIds})=>{
  check(campaignId,characterId,actorId);
  if(!valid(questId)||!valid(completionEventId)||!Array.isArray(requiredObjectiveIds)||
    requiredObjectiveIds.length===0||requiredObjectiveIds.length>50||
    requiredObjectiveIds.some(x=>!valid(x))||new Set(requiredObjectiveIds).size!==requiredObjectiveIds.length)
   throw new TypeError("INVALID_COMPLETION");
  const definition=catalog.get(campaignId,questId);
  if(!definition)throw new Error("UNKNOWN_QUEST");
  const authoritative=JSON.parse(definition.required_objectives_json);
  if(authoritative.length!==requiredObjectiveIds.length||!authoritative.every(x=>requiredObjectiveIds.includes(x)))throw new Error("OBJECTIVE_SET_MISMATCH");
  const prior=completed.get(campaignId,characterId,questId);
  if(prior){
   if(prior.completed_event_id!==completionEventId)throw new Error("COMPLETION_CONFLICT");
   return {duplicate:true,awardedArtifacts:[]};
  }
  const proof=event.get(campaignId,completionEventId);
  if(!proof||proof.event_type!=="QUEST_COMPLETION_APPROVED"||member.get(campaignId,proof.actor_id)?.role!=="DM")
   throw new Error("DM_APPROVAL_REQUIRED");
  let payload;
  try{payload=JSON.parse(proof.payload_json);}catch{throw new Error("INVALID_EVIDENCE");}
  if(payload.characterId!==characterId||payload.questId!==questId||
     !Array.isArray(payload.requiredObjectiveIds)||
     payload.requiredObjectiveIds.length!==requiredObjectiveIds.length||
     !requiredObjectiveIds.every(x=>payload.requiredObjectiveIds.includes(x)))
   throw new Error("APPROVAL_MISMATCH");
  for(const objectiveId of requiredObjectiveIds)
   if(!objective.get(campaignId,characterId,questId,objectiveId))throw new Error("OBJECTIVES_UNVERIFIED");
  db.prepare("INSERT INTO vtt_quest_completions VALUES(?,?,?,?,?)").run(campaignId,characterId,questId,completionEventId,new Date().toISOString());
  return {duplicate:false,awardedArtifacts:[]};
 });
 return {registerQuest:x=>register(x),verifyObjective:x=>verify(x),completeQuest:x=>complete(x)};
}
module.exports={createQuestEvidenceEngine};
