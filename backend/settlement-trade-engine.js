"use strict";
/** Explicit DM-controlled settlement inventory; not an automated economy or player currency transfer. */
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const valid=x=>typeof x==="string"&&ID.test(x);
function createSettlementTradeEngine(db){
 for(const table of ["vtt_settlements","vtt_settlement_markets","vtt_settlement_trade_audit"]){
  if(!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table))throw Error("SETTLEMENT_MIGRATION_REQUIRED");
 }
 const role=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
 const dm=(campaignId,actorId)=>{
  if(!valid(campaignId)||!valid(actorId))throw new TypeError("INVALID_ID");
  if(role.get(campaignId,actorId)?.role!=="DM")throw Error("DM_REQUIRED");
 };
 const create=db.transaction(({campaignId,actorId,settlementId,name,planeId,regionId})=>{
  dm(campaignId,actorId);
  if(![settlementId,planeId,regionId].every(valid)||typeof name!=="string"||name.trim().length<1||name.length>120)throw new TypeError("INVALID_SETTLEMENT");
  const existing=db.prepare("SELECT name,plane_id,region_id FROM vtt_settlements WHERE campaign_id=? AND settlement_id=?").get(campaignId,settlementId);
  if(existing){
   if(existing.name!==name.trim()||existing.plane_id!==planeId||existing.region_id!==regionId)throw Error("SETTLEMENT_CONFLICT");
   return {duplicate:true,settlementId};
  }
  db.prepare("INSERT INTO vtt_settlements VALUES(?,?,?,?,?,?)").run(campaignId,settlementId,name.trim(),planeId,regionId,actorId);
  return {duplicate:false,settlementId};
 });
 const market=db.transaction(({campaignId,actorId,settlementId,commodityId,stockUnits,localPriceCopper})=>{
  dm(campaignId,actorId);
  if(!valid(settlementId)||!valid(commodityId)||!Number.isSafeInteger(stockUnits)||stockUnits<0||stockUnits>1000000000||!Number.isSafeInteger(localPriceCopper)||localPriceCopper<1||localPriceCopper>1000000000)throw new TypeError("INVALID_MARKET");
  const previous=db.prepare("SELECT stock_units,local_price_copper,revision FROM vtt_settlement_markets WHERE campaign_id=? AND settlement_id=? AND commodity_id=?").get(campaignId,settlementId,commodityId);
  if(previous){
   if(previous.stock_units!==stockUnits||previous.local_price_copper!==localPriceCopper||previous.revision!==0)throw Error("MARKET_CONFLICT");
   return {duplicate:true,settlementId,commodityId};
  }
  db.prepare("INSERT INTO vtt_settlement_markets VALUES(?,?,?,?,?,0)").run(campaignId,settlementId,commodityId,stockUnits,localPriceCopper);
  return {duplicate:false,settlementId,commodityId};
 });
 const trade=db.transaction(({campaignId,actorId,tradeId,settlementId,commodityId,expectedRevision,unitsDelta,reason})=>{
  dm(campaignId,actorId);
  if(![tradeId,settlementId,commodityId].every(valid)||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||
     !Number.isSafeInteger(unitsDelta)||unitsDelta===0||Math.abs(unitsDelta)>1000000||
     typeof reason!=="string"||reason.trim().length<3||reason.length>500)throw new TypeError("INVALID_TRADE");
  const old=db.prepare("SELECT settlement_id,commodity_id,units_delta,reason FROM vtt_settlement_trade_audit WHERE campaign_id=? AND trade_id=?").get(campaignId,tradeId);
  if(old){
   if(old.settlement_id!==settlementId||old.commodity_id!==commodityId||old.units_delta!==unitsDelta||old.reason!==reason.trim())throw Error("IDEMPOTENCY_CONFLICT");
   return {duplicate:true};
  }
  const state=db.prepare("SELECT stock_units,revision FROM vtt_settlement_markets WHERE campaign_id=? AND settlement_id=? AND commodity_id=?").get(campaignId,settlementId,commodityId);
  if(!state)throw Error("UNKNOWN_MARKET");
  if(state.revision!==expectedRevision)throw Error("REVISION_CONFLICT");
  const next=state.stock_units+unitsDelta;
  if(!Number.isSafeInteger(next)||next<0||next>1000000000)throw Error("STOCK_BOUNDS");
  db.prepare("UPDATE vtt_settlement_markets SET stock_units=?,revision=revision+1 WHERE campaign_id=? AND settlement_id=? AND commodity_id=?").run(next,campaignId,settlementId,commodityId);
  db.prepare("INSERT INTO vtt_settlement_trade_audit VALUES(?,?,?,?,?,?,?,?,?)").run(campaignId,tradeId,settlementId,commodityId,actorId,unitsDelta,state.stock_units,next,reason.trim(),new Date().toISOString());
  return {duplicate:false,stockUnits:next,revision:state.revision+1};
 });
 return {createSettlement:x=>create(x),defineMarket:x=>market(x),recordTrade:x=>trade(x),
  getMarkets:campaignId=>{
   if(!valid(campaignId))throw new TypeError("INVALID_ID");
   return db.prepare("SELECT s.settlement_id,s.name,s.plane_id,s.region_id,m.commodity_id,m.stock_units,m.local_price_copper,m.revision FROM vtt_settlements s LEFT JOIN vtt_settlement_markets m ON s.campaign_id=m.campaign_id AND s.settlement_id=m.settlement_id WHERE s.campaign_id=? ORDER BY s.settlement_id,m.commodity_id").all(campaignId);
  }};
}
module.exports={createSettlementTradeEngine};
