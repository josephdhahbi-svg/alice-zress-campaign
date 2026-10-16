"use strict";
/** Campaign-scoped DM paradox adjudication; deliberately separate from travel/chronology writes. */
const {previewChronosStabilization}=require("./chronos-anomaly-catalog");
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const valid=x=>typeof x==="string"&&ID.test(x);
function createChronosReviewEngine(db){
 db.exec(`CREATE TABLE IF NOT EXISTS vtt_chronos_reviews(
 campaign_id TEXT NOT NULL,review_id TEXT NOT NULL,character_id TEXT NOT NULL,
 anomaly_id TEXT NOT NULL,dm_actor_id TEXT NOT NULL,d20_roll INTEGER NOT NULL,
 chrono_bonus INTEGER NOT NULL,expected_dc INTEGER NOT NULL,
 check_succeeded INTEGER NOT NULL CHECK(check_succeeded IN(0,1)),
 verdict TEXT NOT NULL CHECK(verdict IN('OBSERVED','NEEDS_EVIDENCE','REJECTED')),
 evidence TEXT NOT NULL,created_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,review_id))`);
 const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const character=db.prepare("SELECT owner_actor_id FROM vtt_characters WHERE campaign_id=? AND character_id=?");
 const prior=db.prepare("SELECT * FROM vtt_chronos_reviews WHERE campaign_id=? AND review_id=?");
 const insert=db.prepare("INSERT INTO vtt_chronos_reviews VALUES(?,?,?,?,?,?,?,?,?,?,?,?)");
 const list=db.prepare("SELECT * FROM vtt_chronos_reviews WHERE campaign_id=? ORDER BY created_at DESC,review_id DESC LIMIT ?");
 const review=db.transaction(({campaignId,reviewId,characterId,actorId,anomalyId,d20Roll,chronoBonus,verdict,evidence})=>{
  if(![campaignId,reviewId,characterId,actorId].every(valid))throw new TypeError("INVALID_ID");
  if(member.get(campaignId,actorId)?.role!=="DM")throw new Error("DM_REQUIRED");
  if(!character.get(campaignId,characterId))throw new Error("CHARACTER_NOT_FOUND");
  if(!["OBSERVED","NEEDS_EVIDENCE","REJECTED"].includes(verdict)||typeof evidence!=="string"||evidence.trim().length<12||evidence.length>2000)throw new TypeError("INVALID_REVIEW");
  const p=previewChronosStabilization({anomalyId,characterId,d20Roll,chronoBonus});
  if(!p)throw new Error("UNKNOWN_ANOMALY");
  const old=prior.get(campaignId,reviewId);
  if(old){
   if(old.character_id!==characterId||old.anomaly_id!==anomalyId||old.dm_actor_id!==actorId||old.d20_roll!==d20Roll||old.chrono_bonus!==chronoBonus||old.verdict!==verdict||old.evidence!==evidence.trim())throw new Error("IDEMPOTENCY_CONFLICT");
   return {duplicate:true,record:old,applied:false};
  }
  insert.run(campaignId,reviewId,characterId,anomalyId,actorId,d20Roll,chronoBonus,p.targetDC,p.checkWouldSucceed?1:0,verdict,evidence.trim(),new Date().toISOString());
  return {duplicate:false,record:prior.get(campaignId,reviewId),applied:false};
 });
 return {review,list:(campaignId,actorId,limit=50)=>{
  if(!valid(campaignId)||!valid(actorId)||!Number.isSafeInteger(limit)||limit<1||limit>100)throw new TypeError("INVALID_QUERY");
  if(member.get(campaignId,actorId)?.role!=="DM")throw new Error("DM_REQUIRED");
  return list.all(campaignId,limit);
 }};
}
module.exports={createChronosReviewEngine};
