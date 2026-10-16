"use strict";
/** Explicit DM-attested bridge: an acknowledged story entry is never evidence by itself. */
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const valid=x=>typeof x==="string"&&ID.test(x);
function createJournalQuestBridge(db){
 if(!db||typeof db.transaction!=="function")throw new TypeError("SQLITE_REQUIRED");
 db.exec(`CREATE TABLE IF NOT EXISTS vtt_journal_quest_links (
 campaign_id TEXT NOT NULL, entry_id TEXT NOT NULL, character_id TEXT NOT NULL,
 quest_id TEXT NOT NULL, objective_id TEXT NOT NULL, event_id TEXT NOT NULL,
 attested_by TEXT NOT NULL, created_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,entry_id),
 UNIQUE(campaign_id,event_id),
 UNIQUE(campaign_id,character_id,quest_id,objective_id),
 FOREIGN KEY(campaign_id,character_id) REFERENCES vtt_characters(campaign_id,character_id),
 FOREIGN KEY(campaign_id,attested_by) REFERENCES vtt_campaign_members(campaign_id,actor_id)
 )`);
 const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const entry=db.prepare("SELECT actor_id,status FROM vtt_alice_exploration_journal WHERE campaign_id=? AND entry_id=?");
 const owner=db.prepare("SELECT owner_actor_id FROM vtt_characters WHERE campaign_id=? AND character_id=?");
 const definition=db.prepare("SELECT required_objectives_json FROM vtt_quest_catalog WHERE campaign_id=? AND quest_id=?");
 const approved=db.prepare("SELECT 1 FROM vtt_quest_approvals WHERE campaign_id=? AND quest_id=?");
 const existing=db.prepare("SELECT * FROM vtt_journal_quest_links WHERE campaign_id=? AND entry_id=?");
 const event=db.prepare("SELECT * FROM vtt_campaign_events WHERE campaign_id=? AND event_id=?");
 const link=db.transaction(({campaignId,entryId,characterId,questId,objectiveId,eventId,dmActorId})=>{
  if(![campaignId,entryId,characterId,questId,objectiveId,eventId,dmActorId].every(valid))throw new TypeError("INVALID_ID");
  if(member.get(campaignId,dmActorId)?.role!=="DM")throw new Error("DM_REQUIRED");
  const story=entry.get(campaignId,entryId);
  if(!story||story.status!=="ACKNOWLEDGED")throw new Error("ACKNOWLEDGED_ENTRY_REQUIRED");
  const characterOwner=owner.get(campaignId,characterId)?.owner_actor_id;
  if(!characterOwner||story.actor_id!==characterOwner)throw new Error("ENTRY_OWNER_MISMATCH");
  const quest=definition.get(campaignId,questId);
  if(!quest||!approved.get(campaignId,questId)||!JSON.parse(quest.required_objectives_json).includes(objectiveId))
   throw new Error("APPROVED_OBJECTIVE_REQUIRED");
  const old=existing.get(campaignId,entryId);
  if(old){
   if(old.character_id===characterId&&old.quest_id===questId&&old.objective_id===objectiveId&&old.event_id===eventId&&old.attested_by===dmActorId)
    return {duplicate:true,eventId};
   throw new Error("LINK_CONFLICT");
  }
  if(event.get(campaignId,eventId))throw new Error("EVENT_ID_CONFLICT");
  const payload=JSON.stringify({characterId,questId,objectiveId,journalEntryId:entryId,submittedBy:story.actor_id,attestedBy:dmActorId});
  const revision=db.prepare("SELECT COALESCE(MAX(revision),0)+1 n FROM vtt_campaign_events WHERE campaign_id=?").get(campaignId).n;
  const now=new Date().toISOString();
  db.prepare("INSERT INTO vtt_campaign_events(campaign_id,revision,event_id,actor_id,event_type,payload_json,occurred_at) VALUES(?,?,?,?,?,?,?)")
   .run(campaignId,revision,eventId,dmActorId,"QUEST_OBJECTIVE_VERIFIED",payload,now);
  db.prepare("INSERT INTO vtt_journal_quest_links VALUES(?,?,?,?,?,?,?,?)")
   .run(campaignId,entryId,characterId,questId,objectiveId,eventId,dmActorId,now);
  return {duplicate:false,eventId,revision,gameMutation:false,awardedArtifacts:[]};
 });
 return {attest:link};
}
module.exports={createJournalQuestBridge};
