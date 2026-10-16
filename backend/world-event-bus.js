"use strict";
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const TYPES=new Set(["QUEST_COMPLETED","ITEM_DISCOVERED","ENVIRONMENT_INTERACTED","COMBO_TRIGGERED","NPC_PRESENCE_CHANGED","RUMOR_POSTED"]);
function createWorldEventBus(db){
 db.exec(`CREATE TABLE IF NOT EXISTS vtt_world_event_outbox(
 campaign_id TEXT NOT NULL,event_id TEXT NOT NULL,event_type TEXT NOT NULL,
 subject_id TEXT NOT NULL,actor_id TEXT NOT NULL,payload_json TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(campaign_id,event_id));
 CREATE INDEX IF NOT EXISTS idx_world_outbox_campaign_time ON vtt_world_event_outbox(campaign_id,created_at,event_id)`);
 const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const insert=db.prepare("INSERT INTO vtt_world_event_outbox(campaign_id,event_id,event_type,subject_id,actor_id,payload_json) VALUES(?,?,?,?,?,?)");
 const get=db.prepare("SELECT * FROM vtt_world_event_outbox WHERE campaign_id=? AND event_id=?");
 const list=db.prepare("SELECT * FROM vtt_world_event_outbox WHERE campaign_id=? ORDER BY created_at DESC,event_id DESC LIMIT ?");
 const valid=x=>typeof x==="string"&&ID.test(x);
 const record=db.transaction(({campaignId,eventId,eventType,subjectId,actorId,payload={},evidenceId})=>{
  if(![campaignId,eventId,subjectId,actorId,evidenceId].every(valid)||!TYPES.has(eventType)||!payload||typeof payload!=="object"||Array.isArray(payload))throw new TypeError("INVALID_WORLD_EVENT");
  if(member.get(campaignId,actorId)?.role!=="DM")throw new Error("DM_REQUIRED");
  const serialized=JSON.stringify({evidenceId,payload});
  if(serialized.length>4000)throw new TypeError("EVENT_TOO_LARGE");
  // This ledger only records a DM's explicit attestation, never grants rewards.
  const prior=get.get(campaignId,eventId);
  if(prior){
   if(prior.event_type!==eventType||prior.subject_id!==subjectId||prior.actor_id!==actorId||prior.payload_json!==serialized)throw new Error("EVENT_CONFLICT");
   return {duplicate:true,event:prior};
  }
  insert.run(campaignId,eventId,eventType,subjectId,actorId,serialized);
  return {duplicate:false,event:get.get(campaignId,eventId)};
 });
 return {record,list:(campaignId,limit=30)=>{
  if(!valid(campaignId)||!Number.isSafeInteger(limit)||limit<1||limit>100)throw new TypeError("INVALID_WORLD_EVENT_QUERY");
  return list.all(campaignId,limit).map(x=>({campaignId:x.campaign_id,eventId:x.event_id,eventType:x.event_type,subjectId:x.subject_id,createdAt:x.created_at}));
 }};
}
module.exports={createWorldEventBus};
