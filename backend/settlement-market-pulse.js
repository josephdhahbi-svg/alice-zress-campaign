"use strict";
/** Deterministic, explicitly DM-authorized market pulse; never runs on a timer. */
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const valid=x=>typeof x==="string"&&ID.test(x);
function createSettlementMarketPulseEngine(db){
 if(!db.prepare("SELECT 1 FROM sqlite_master WHERE type='table' AND name='vtt_settlement_market_pulses'").get())throw Error("PULSE_MIGRATION_REQUIRED");
 const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const market=db.prepare("SELECT stock_units,local_price_copper,revision FROM vtt_settlement_markets WHERE campaign_id=? AND settlement_id=? AND commodity_id=?");
 const prior=db.prepare("SELECT actor_id,changes_json,result_json FROM vtt_settlement_market_pulses WHERE campaign_id=? AND pulse_id=?");
 const update=db.prepare("UPDATE vtt_settlement_markets SET stock_units=?,local_price_copper=?,revision=revision+1 WHERE campaign_id=? AND settlement_id=? AND commodity_id=? AND revision=?");
 const insert=db.prepare("INSERT INTO vtt_settlement_market_pulses VALUES(?,?,?,?,?,?)");
 const execute=db.transaction(({campaignId,actorId,pulseId,changes})=>{
  if(![campaignId,actorId,pulseId].every(valid))throw new TypeError("INVALID_ID");
  if(member.get(campaignId,actorId)?.role!=="DM")throw Error("DM_REQUIRED");
  if(!Array.isArray(changes)||changes.length<1||changes.length>50)throw new TypeError("INVALID_PULSE");
  const sorted=changes.map(c=>{
   if(!c||![c.settlementId,c.commodityId].every(valid)||!Number.isSafeInteger(c.expectedRevision)||c.expectedRevision<0||
      !Number.isSafeInteger(c.stockDelta)||Math.abs(c.stockDelta)>1000000||
      !Number.isSafeInteger(c.priceBasisPoints)||Math.abs(c.priceBasisPoints)>500)throw new TypeError("INVALID_CHANGE");
   return {settlementId:c.settlementId,commodityId:c.commodityId,expectedRevision:c.expectedRevision,stockDelta:c.stockDelta,priceBasisPoints:c.priceBasisPoints};
  }).sort((a,b)=>a.settlementId.localeCompare(b.settlementId)||a.commodityId.localeCompare(b.commodityId));
  for(let i=1;i<sorted.length;i++)if(sorted[i].settlementId===sorted[i-1].settlementId&&sorted[i].commodityId===sorted[i-1].commodityId)throw new TypeError("DUPLICATE_MARKET");
  const canonical=JSON.stringify(sorted);
  const existing=prior.get(campaignId,pulseId);
  if(existing){
   if(existing.actor_id!==actorId||existing.changes_json!==canonical)throw Error("IDEMPOTENCY_CONFLICT");
   return {duplicate:true,results:JSON.parse(existing.result_json)};
  }
  const results=[];
  for(const c of sorted){
   const old=market.get(campaignId,c.settlementId,c.commodityId);
   if(!old)throw Error("UNKNOWN_MARKET");
   if(old.revision!==c.expectedRevision)throw Error("REVISION_CONFLICT");
   const stock=old.stock_units+c.stockDelta;
   const price=Math.max(1,Math.round(old.local_price_copper*(10000+c.priceBasisPoints)/10000));
   if(!Number.isSafeInteger(stock)||stock<0||stock>1000000000||price>1000000000)throw Error("MARKET_BOUNDS");
   const result=update.run(stock,price,campaignId,c.settlementId,c.commodityId,c.expectedRevision);
   if(result.changes!==1)throw Error("REVISION_CONFLICT");
   results.push({settlementId:c.settlementId,commodityId:c.commodityId,stockUnits:stock,priceCopper:price,revision:c.expectedRevision+1});
  }
  insert.run(campaignId,pulseId,actorId,canonical,JSON.stringify(results),new Date().toISOString());
  return {duplicate:false,results};
 });
 return {executePulse:x=>execute(x)};
}
module.exports={createSettlementMarketPulseEngine};
