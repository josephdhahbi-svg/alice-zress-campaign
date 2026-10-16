"use strict";
/** Campaign-scoped, opt-in economy ledger. No cron, implicit time advancement, or inventory grants. */
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const valid=x=>typeof x==="string"&&ID.test(x);
const SCHEMA=`
CREATE TABLE IF NOT EXISTS vtt_world_economy (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 commodity_id TEXT NOT NULL, price_copper INTEGER NOT NULL CHECK(price_copper BETWEEN 1 AND 1000000000),
 revision INTEGER NOT NULL DEFAULT 0 CHECK(revision>=0),
 PRIMARY KEY(campaign_id,commodity_id)
);
CREATE TABLE IF NOT EXISTS vtt_world_economy_adjustments (
 campaign_id TEXT NOT NULL, adjustment_id TEXT NOT NULL,
 commodity_id TEXT NOT NULL, actor_id TEXT NOT NULL,
 old_price_copper INTEGER NOT NULL, new_price_copper INTEGER NOT NULL,
 reason TEXT NOT NULL, occurred_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,adjustment_id),
 FOREIGN KEY(campaign_id,commodity_id) REFERENCES vtt_world_economy(campaign_id,commodity_id),
 FOREIGN KEY(campaign_id,actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
`;
function createWorldEconomyEngine(db){
 if(!db||typeof db.transaction!=="function")throw new TypeError("SQLITE_REQUIRED");
 // Migration v6 owns the schema; reject unmigrated databases.
 for(const table of ["vtt_world_economy","vtt_world_economy_adjustments"]){
  if(!db.prepare("SELECT name FROM sqlite_master WHERE type=? AND name=?").get("table",table))throw new Error("ECONOMY_MIGRATION_REQUIRED");
 }
 const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const price=db.prepare("SELECT price_copper,revision FROM vtt_world_economy WHERE campaign_id=? AND commodity_id=?");
 const prior=db.prepare("SELECT commodity_id,old_price_copper,new_price_copper,reason FROM vtt_world_economy_adjustments WHERE campaign_id=? AND adjustment_id=?");
 const requireDM=(campaignId,actorId)=>{
  if(!valid(campaignId)||!valid(actorId))throw new TypeError("INVALID_ID");
  if(member.get(campaignId,actorId)?.role!=="DM")throw new Error("DM_REQUIRED");
 };
 const define=db.transaction(({campaignId,actorId,commodityId,priceCopper})=>{
  requireDM(campaignId,actorId);
  if(!valid(commodityId)||!Number.isSafeInteger(priceCopper)||priceCopper<1||priceCopper>1000000000)throw new TypeError("INVALID_COMMODITY");
  const existing=price.get(campaignId,commodityId);
  if(existing){
   if(existing.price_copper!==priceCopper||existing.revision!==0)throw new Error("COMMODITY_EXISTS");
   return {duplicate:true,priceCopper};
  }
  db.prepare("INSERT INTO vtt_world_economy VALUES(?,?,?,0)").run(campaignId,commodityId,priceCopper);
  return {duplicate:false,priceCopper};
 });
 const adjust=db.transaction(({campaignId,actorId,adjustmentId,commodityId,expectedRevision,changeBasisPoints,reason})=>{
  requireDM(campaignId,actorId);
  if(!valid(adjustmentId)||!valid(commodityId)||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||
     !Number.isSafeInteger(changeBasisPoints)||changeBasisPoints< -500||changeBasisPoints>500||
     typeof reason!=="string"||reason.trim().length<3||reason.length>500)throw new TypeError("INVALID_ADJUSTMENT");
  const previous=prior.get(campaignId,adjustmentId);
  if(previous){
   if(previous.commodity_id!==commodityId||previous.reason!==reason.trim()||previous.new_price_copper!==Math.max(1,Math.round(previous.old_price_copper*(10000+changeBasisPoints)/10000)))throw new Error("IDEMPOTENCY_CONFLICT");
   return {duplicate:true,priceCopper:previous.new_price_copper};
  }
  const current=price.get(campaignId,commodityId);
  if(!current)throw new Error("UNKNOWN_COMMODITY");
  if(current.revision!==expectedRevision)throw new Error("REVISION_CONFLICT");
  const next=Math.max(1,Math.round(current.price_copper*(10000+changeBasisPoints)/10000));
  if(next>1000000000)throw new Error("PRICE_OVERFLOW");
  db.prepare("UPDATE vtt_world_economy SET price_copper=?,revision=revision+1 WHERE campaign_id=? AND commodity_id=?").run(next,campaignId,commodityId);
  db.prepare("INSERT INTO vtt_world_economy_adjustments VALUES(?,?,?,?,?,?,?,?)").run(campaignId,adjustmentId,commodityId,actorId,current.price_copper,next,reason.trim(),new Date().toISOString());
  return {duplicate:false,priceCopper:next,revision:current.revision+1};
 });
 return {defineCommodity:x=>define(x),adjustPrice:x=>adjust(x),getPrices:campaignId=>{
  if(!valid(campaignId))throw new TypeError("INVALID_ID");
  return db.prepare("SELECT commodity_id,price_copper,revision FROM vtt_world_economy WHERE campaign_id=? ORDER BY commodity_id").all(campaignId);
 }};
}
module.exports={SCHEMA,createWorldEconomyEngine};
