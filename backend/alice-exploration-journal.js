"use strict";
const {getAliceDemiplaneRoom,previewAliceDemiplaneRoomChoice}=require("./alice-demiplane-rooms");
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
function createAliceExplorationJournal(db){
 db.exec(`CREATE TABLE IF NOT EXISTS vtt_alice_exploration_journal (
  campaign_id TEXT NOT NULL, entry_id TEXT NOT NULL, actor_id TEXT NOT NULL,
  room_id TEXT NOT NULL, choice_number INTEGER NOT NULL CHECK(choice_number BETWEEN 1 AND 5),
  choice_text TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','ACKNOWLEDGED','DECLINED')),
  reviewed_by TEXT, review_note TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT, PRIMARY KEY(campaign_id,entry_id)
 )`);
 const insert=db.prepare("INSERT INTO vtt_alice_exploration_journal(campaign_id,entry_id,actor_id,room_id,choice_number,choice_text) VALUES(?,?,?,?,?,?)");
 const get=db.prepare("SELECT * FROM vtt_alice_exploration_journal WHERE campaign_id=? AND entry_id=?");
 const list=db.prepare("SELECT * FROM vtt_alice_exploration_journal WHERE campaign_id=? ORDER BY created_at DESC,entry_id DESC LIMIT ?");
 const update=db.prepare("UPDATE vtt_alice_exploration_journal SET status=?,reviewed_by=?,review_note=?,reviewed_at=CURRENT_TIMESTAMP WHERE campaign_id=? AND entry_id=? AND status='PENDING'");
 function submit({campaignId,entryId,actorId,roomId,choiceNumber}){
  if(![campaignId,entryId,actorId].every(x=>typeof x==="string"&&ID.test(x)))throw new TypeError("INVALID_ID");
  const preview=previewAliceDemiplaneRoomChoice(roomId,choiceNumber);
  if(preview.reason==="UNKNOWN_ROOM"||preview.reason==="INVALID_CHOICE")throw new TypeError(preview.reason);
  if(getAliceDemiplaneRoom(roomId).status!=="ORIGIN")throw new Error("ROOM_LOCKED");
  const old=get.get(campaignId,entryId);
  if(old){if(old.actor_id===actorId&&old.room_id===roomId&&old.choice_number===choiceNumber)return {...old,duplicate:true};throw new Error("ENTRY_CONFLICT")}
  insert.run(campaignId,entryId,actorId,roomId,choiceNumber,preview.text);
  return {...get.get(campaignId,entryId),duplicate:false};
 }
 function review({campaignId,entryId,dmActorId,status,note}){
  if(![campaignId,entryId,dmActorId].every(x=>typeof x==="string"&&ID.test(x)))throw new TypeError("INVALID_ID");
  if(!["ACKNOWLEDGED","DECLINED"].includes(status)||typeof note!=="string"||note.length>1000)throw new TypeError("INVALID_REVIEW");
  if(!get.get(campaignId,entryId))throw new Error("NOT_FOUND");
  if(update.run(status,dmActorId,note,campaignId,entryId).changes!==1)throw new Error("ALREADY_REVIEWED");
  return get.get(campaignId,entryId);
 }
 return {submit,review,list:(campaignId,limit=50)=>{if(!ID.test(campaignId)||!Number.isSafeInteger(limit)||limit<1||limit>100)throw new TypeError("INVALID_QUERY");return list.all(campaignId,limit)},get:(campaignId,entryId)=>get.get(campaignId,entryId)};
}
module.exports={createAliceExplorationJournal};
