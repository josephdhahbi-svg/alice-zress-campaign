"use strict";
const {previewHiddenDiscoveries}=require("./chronological-map-atlas");
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const valid=x=>typeof x==="string"&&ID.test(x);
function createDiscoveryLedger(db){
 db.exec(`CREATE TABLE IF NOT EXISTS vtt_discovery_ledger(
 campaign_id TEXT NOT NULL,entry_id TEXT NOT NULL,actor_id TEXT NOT NULL,
 map_id TEXT NOT NULL,discovery_id TEXT NOT NULL,era TEXT NOT NULL,
 visit_sequence INTEGER NOT NULL,dr_date TEXT,local_time TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('CLUE','REVEALED')),
 note TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(campaign_id,entry_id))`);
 const insert=db.prepare("INSERT INTO vtt_discovery_ledger(campaign_id,entry_id,actor_id,map_id,discovery_id,era,visit_sequence,dr_date,local_time,status,note) VALUES(?,?,?,?,?,?,?,?,?,?,?)");
 const find=db.prepare("SELECT * FROM vtt_discovery_ledger WHERE campaign_id=? AND entry_id=?");
 const list=db.prepare("SELECT * FROM vtt_discovery_ledger WHERE campaign_id=? AND actor_id=? ORDER BY created_at DESC,entry_id DESC LIMIT ?");
 const write=db.transaction(({campaignId,entryId,actorId,mapId,discoveryId,era,visitSequence,drDate=null,localTime="UNSPECIFIED",availableFlags=[],note})=>{
  if(![campaignId,entryId,actorId,mapId,discoveryId].every(valid)||!["ORIGIN","REVISIT","LATER_ERA","ENDGAME"].includes(era)||!Number.isSafeInteger(visitSequence)||visitSequence<1||visitSequence>100000||drDate!==null&&(typeof drDate!=="string"||!/^\d{1,5} DR$/.test(drDate))||typeof localTime!=="string"||!(/^(UNSPECIFIED|(?:[01]\d|2[0-3]):[0-5]\d)$/.test(localTime))||typeof note!=="string"||note.length<12||note.length>1000||!Array.isArray(availableFlags)||availableFlags.length>100||availableFlags.some(x=>typeof x!=="string"||!/^[A-Z0-9_]{1,100}$/.test(x)))throw new TypeError("INVALID_DISCOVERY");
  const candidates=previewHiddenDiscoveries(mapId,{visitSequence,availableFlags});
  const found=candidates.find(x=>x.id===discoveryId);
  if(!found||found.visibility==="HIDDEN")throw new Error("DISCOVERY_NOT_VISIBLE");
  const status=found.visibility==="REVEALED"?"REVEALED":"CLUE";
  const old=find.get(campaignId,entryId);
  if(old){
   if(old.actor_id!==actorId||old.map_id!==mapId||old.discovery_id!==discoveryId||old.era!==era||old.visit_sequence!==visitSequence||old.dr_date!==drDate||old.local_time!==localTime||old.status!==status||old.note!==note)throw new Error("ENTRY_CONFLICT");
   return {entry:old,duplicate:true};
  }
  insert.run(campaignId,entryId,actorId,mapId,discoveryId,era,visitSequence,drDate,localTime,status,note);
  return {entry:find.get(campaignId,entryId),duplicate:false};
 });
 return {record:write,list:(campaignId,actorId,limit=50)=>{
  if(!valid(campaignId)||!valid(actorId)||!Number.isSafeInteger(limit)||limit<1||limit>100)throw new TypeError("INVALID_QUERY");
  return list.all(campaignId,actorId,limit);
 }};
}
module.exports={createDiscoveryLedger};
