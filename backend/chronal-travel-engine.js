"use strict";
const {getWorldNode}=require("./multiverse-adventure-index");
const {planTimeSpaceJourney}=require("./rabbit-hole-time-space");
const validId=x=>typeof x==="string"&&/^[A-Za-z0-9:_-]{1,100}$/.test(x);
function createChronalTravelEngine(db){
 const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const character=db.prepare("SELECT owner_actor_id FROM vtt_characters WHERE campaign_id=? AND character_id=?");
 const current=db.prepare("SELECT * FROM vtt_character_locations WHERE campaign_id=? AND character_id=?");
 const existing=db.prepare("SELECT * FROM vtt_character_travel_events WHERE campaign_id=? AND travel_id=?");
 const create=db.prepare("INSERT INTO vtt_character_locations(campaign_id,character_id,node_id,dr_year,revision) VALUES(?,?,?,?,0)");
 const change=db.prepare("UPDATE vtt_character_locations SET node_id=?,dr_year=?,revision=revision+1 WHERE campaign_id=? AND character_id=? AND revision=?");
 const record=db.prepare("INSERT INTO vtt_character_travel_events(campaign_id,travel_id,character_id,actor_id,from_node,to_node,departure_dr,arrival_dr,method,evidence,previous_revision,resulting_revision,occurred_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)");
 const requireDm=(campaignId,actorId)=>{if(member.get(campaignId,actorId)?.role!=="DM")throw new Error("DM_REQUIRED");};
 const requireIds=values=>{if(values.some(x=>!validId(x)))throw new TypeError("INVALID_ID");};
 const initialize=db.transaction(({campaignId,characterId,actorId})=>{
  requireIds([campaignId,characterId,actorId]);requireDm(campaignId,actorId);
  if(!character.get(campaignId,characterId))throw new Error("CHARACTER_NOT_FOUND");
  const old=current.get(campaignId,characterId);
  if(old)return {duplicate:true,location:old};
  create.run(campaignId,characterId,"pit_ghaunadaur",null);
  return {duplicate:false,location:current.get(campaignId,characterId)};
 });
 const execute=db.transaction(({campaignId,characterId,actorId,travelId,to,arrivalDr=null,method="RABBIT_HOLE",evidence,expectedRevision})=>{
  requireIds([campaignId,characterId,actorId,travelId]);requireDm(campaignId,actorId);
  if(!character.get(campaignId,characterId))throw new Error("CHARACTER_NOT_FOUND");
  if(typeof evidence!=="string"||evidence.length<12||evidence.length>2000)throw new TypeError("TRAVEL_EVIDENCE_REQUIRED");
  if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)throw new TypeError("INVALID_REVISION");
  const replay=existing.get(campaignId,travelId);
  if(replay){
   if(replay.character_id!==characterId||replay.actor_id!==actorId||replay.to_node!==to||replay.arrival_dr!==arrivalDr||replay.method!==method||replay.evidence!==evidence||replay.previous_revision!==expectedRevision)throw new Error("IDEMPOTENCY_CONFLICT");
   return {duplicate:true,event:replay};
  }
  const old=current.get(campaignId,characterId);
  if(!old)throw new Error("LOCATION_NOT_INITIALIZED");
  if(old.revision!==expectedRevision)throw new Error("REVISION_CONFLICT");
  const plan=planTimeSpaceJourney({from:old.node_id,to,departureDr:old.dr_year,arrivalDr,method});
  if(plan.reason==="UNKNOWN_LOCATION"||plan.reason==="INVALID_DR_DATE"||plan.reason==="UNKNOWN_TRAVEL_METHOD")throw new TypeError(plan.reason);
  if(!getWorldNode(to))throw new TypeError("UNKNOWN_LOCATION");
  if(to===old.node_id&&arrivalDr===old.dr_year)throw new Error("NO_MOVEMENT");
  // DM has explicitly reviewed and approved this individual travel event and its evidence.
  const result=change.run(to,arrivalDr,campaignId,characterId,expectedRevision);
  if(result.changes!==1)throw new Error("REVISION_CONFLICT");
  record.run(campaignId,travelId,characterId,actorId,old.node_id,to,old.dr_year,arrivalDr,method,evidence,expectedRevision,expectedRevision+1,new Date().toISOString());
  return {duplicate:false,event:existing.get(campaignId,travelId),location:current.get(campaignId,characterId)};
 });
 return {initializeLocation:initialize,executeTravel:execute,getLocation:(campaignId,characterId)=>current.get(campaignId,characterId)||null};
}
module.exports={createChronalTravelEngine};
