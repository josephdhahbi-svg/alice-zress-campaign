"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),Database=require("better-sqlite3");
const {migrate,MIGRATIONS}=require("./migrations");
const {createSettlementTradeEngine}=require("./settlement-trade-engine");
function setup(){
 const db=new Database(":memory:");db.pragma("foreign_keys=ON");migrate(db);
 db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("c","Campaign","now");
 db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("other","Other","now");
 db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c","dm","DM");
 db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c","alice","PLAYER");
 db.prepare("INSERT INTO vtt_world_economy VALUES(?,?,?,0)").run("c","ore",100);
 return db;
}
test("migration v7 and settlement trade: idempotent, bounded, campaign-scoped",()=>{
 const db=setup();
 try{
  assert.equal(MIGRATIONS.at(-1).version,7);
  const e=createSettlementTradeEngine(db);
  const s={campaignId:"c",actorId:"dm",settlementId:"s1",name:"Silver Refuge",planeId:"material",regionId:"underdark"};
  assert.equal(e.createSettlement(s).duplicate,false);
  assert.equal(e.createSettlement(s).duplicate,true);
  assert.throws(()=>e.createSettlement({...s,actorId:"alice"}),/DM_REQUIRED/);
  const m={campaignId:"c",actorId:"dm",settlementId:"s1",commodityId:"ore",stockUnits:10,localPriceCopper:120};
  e.defineMarket(m);
  const t={campaignId:"c",actorId:"dm",tradeId:"t1",settlementId:"s1",commodityId:"ore",expectedRevision:0,unitsDelta:-3,reason:"Relief supply"};
  assert.deepEqual(e.recordTrade(t),{duplicate:false,stockUnits:7,revision:1});
  assert.equal(e.recordTrade(t).duplicate,true);
  assert.throws(()=>e.recordTrade({...t,tradeId:"t2"}),/REVISION_CONFLICT/);
  assert.throws(()=>e.recordTrade({...t,tradeId:"t3",expectedRevision:1,unitsDelta:-8}),/STOCK_BOUNDS/);
  assert.throws(()=>e.recordTrade({...t,tradeId:"t4",expectedRevision:1,actorId:"alice"}),/DM_REQUIRED/);
  assert.throws(()=>e.recordTrade({...t,tradeId:"t1",unitsDelta:1}),/IDEMPOTENCY_CONFLICT/);
  assert.equal(e.getMarkets("c")[0].stock_units,7);
  assert.deepEqual(e.getMarkets("other"),[]);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_settlement_trade_audit").get().n,1);
  migrate(db);
  assert.equal(createSettlementTradeEngine(db).getMarkets("c")[0].stock_units,7);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_artifacts").get().n,0);
 }finally{db.close();}
});
