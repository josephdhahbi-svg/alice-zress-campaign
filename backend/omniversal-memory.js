"use strict";
/** Persistent, campaign-scoped memory across 10 trilogies, 30 books and 7 traversals.
 * DM-attested facts only; NPC knowledge is never inferred from player knowledge.
 */
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const valid=x=>typeof x==="string"&&ID.test(x);
const TYPES=new Set(["QUEST","DIALOGUE","RELATIONSHIP","FACTION","ITEM","DISCOVERY","MAP","TIMELINE","CONSEQUENCE","NPC_KNOWLEDGE"]);
const VISIBILITY=new Set(["PRIVATE","PARTY","WORLD"]);
function createOmniversalMemory(db){
 db.exec(`CREATE TABLE IF NOT EXISTS vtt_omniversal_memory(
 campaign_id TEXT NOT NULL,memory_id TEXT NOT NULL,subject_id TEXT NOT NULL,
 memory_type TEXT NOT NULL,visibility TEXT NOT NULL,description TEXT NOT NULL,
 trilogy INTEGER NOT NULL CHECK(trilogy BETWEEN 1 AND 10),
 book INTEGER NOT NULL CHECK(book BETWEEN 1 AND 30),
 traversal INTEGER NOT NULL CHECK(traversal BETWEEN 1 AND 7),
 era TEXT NOT NULL,dr_date TEXT,plane TEXT NOT NULL,map_id TEXT,
 witness_ids_json TEXT NOT NULL,source_event_id TEXT NOT NULL,
 attested_by TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(campaign_id,memory_id));
 CREATE INDEX IF NOT EXISTS idx_omni_subject ON vtt_omniversal_memory(campaign_id,subject_id,traversal,book)`);
 const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const get=db.prepare("SELECT * FROM vtt_omniversal_memory WHERE campaign_id=? AND memory_id=?");
 const insert=db.prepare(`INSERT INTO vtt_omniversal_memory(
 campaign_id,memory_id,subject_id,memory_type,visibility,description,trilogy,book,traversal,
 era,dr_date,plane,map_id,witness_ids_json,source_event_id,attested_by)
 VALUES(@campaignId,@memoryId,@subjectId,@memoryType,@visibility,@description,@trilogy,@book,@traversal,
 @era,@drDate,@plane,@mapId,@witnessIdsJson,@sourceEventId,@attestedBy)`);
 const query=db.prepare("SELECT * FROM vtt_omniversal_memory WHERE campaign_id=? AND (subject_id=? OR visibility='WORLD' OR (visibility='PARTY' AND instr(witness_ids_json,?)>0)) ORDER BY traversal DESC,book DESC,created_at DESC LIMIT ?");
 const record=db.transaction(({campaignId,memoryId,subjectId,memoryType,visibility="PRIVATE",description,trilogy,book,traversal,era="UNVERIFIED",drDate=null,plane="UNVERIFIED",mapId=null,witnessIds=[],sourceEventId,actorId})=>{
  if(![campaignId,memoryId,subjectId,sourceEventId,actorId].every(valid)||!TYPES.has(memoryType)||!VISIBILITY.has(visibility)||typeof description!=="string"||description.length<10||description.length>2000||!Number.isInteger(trilogy)||trilogy<1||trilogy>10||!Number.isInteger(book)||book<1||book>30||Math.ceil(book/3)!==trilogy||!Number.isInteger(traversal)||traversal<1||traversal>7||typeof era!=="string"||era.length>100||typeof plane!=="string"||plane.length>100||drDate!==null&&(typeof drDate!=="string"||drDate.length>100)||mapId!==null&&!valid(mapId)||!Array.isArray(witnessIds)||witnessIds.length>50||witnessIds.some(x=>!valid(x)))throw new TypeError("INVALID_MEMORY");
  if(member.get(campaignId,actorId)?.role!=="DM")throw new Error("DM_REQUIRED");
  const row={campaignId,memoryId,subjectId,memoryType,visibility,description,trilogy,book,traversal,era,drDate,plane,mapId,witnessIdsJson:JSON.stringify([...new Set(witnessIds)].sort()),sourceEventId,attestedBy:actorId};
  const prior=get.get(campaignId,memoryId);
  if(prior){
   if(prior.subject_id!==subjectId||prior.source_event_id!==sourceEventId||prior.description!==description)throw new Error("MEMORY_CONFLICT");
   return {duplicate:true,memoryId};
  }
  insert.run(row);return {duplicate:false,memoryId};
 });
 function recall({campaignId,actorId,subjectId,limit=30}){
  if(![campaignId,actorId,subjectId].every(valid)||!Number.isInteger(limit)||limit<1||limit>100)throw new TypeError("INVALID_RECALL");
  if(!member.get(campaignId,actorId))throw new Error("NOT_AUTHORIZED");
  const isDm=member.get(campaignId,actorId).role==="DM";
  const rows=query.all(campaignId,subjectId,'"'+actorId+'"',limit);
  return rows.filter(x=>isDm||x.visibility!=="PRIVATE"||x.subject_id===actorId).map(x=>({
   memoryId:x.memory_id,subjectId:x.subject_id,type:x.memory_type,description:x.description,
   trilogy:x.trilogy,book:x.book,traversal:x.traversal,era:x.era,drDate:x.dr_date,
   plane:x.plane,mapId:x.map_id,sourceEventId:x.source_event_id
  }));
 }
 return {record,recall};
}
module.exports={createOmniversalMemory};
