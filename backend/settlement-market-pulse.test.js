"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createSettlementMarketPulseEngine}=require("./settlement-market-pulse");
test("deterministic pulses: replay, rollback, isolation, migration restart",()=>{
 const db=new Database(":memory:");db.pragma("foreign_keys=ON");
 try{
  assert.throws(()=>createSettlementMarketPulseEngine(db),/PULSE_MIGRATION_REQUIRED/);
  migrate(db);
  for(const campaign of ["a","b"]){
   db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run(campaign,campaign,"now");
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run(campaign,"dm","DM");
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run(campaign,"player","PLAYER");
   db.prepare("INSERT INTO vtt_world_economy VALUES(?,?,?,0)").run(campaign,"ore",100);
   db.prepare("INSERT INTO vtt_settlements VALUES(?,?,?,?,?,?)").run(campaign,"s","Refuge","material","underdark","dm");
   db.prepare("INSERT INTO vtt_settlement_markets VALUES(?,?,?,?,?,0)").run(campaign,"s","ore",10,100);
  }
  const engine=createSettlementMarketPulseEngine(db);
  const base={campaignId:"a",actorId:"dm",pulseId:"p1",changes:[{settlementId:"s",commodityId:"ore",expectedRevision:0,stockDelta:-3,priceBasisPoints:500}]};
  assert.equal(engine.executePulse(base).results[0].priceCopper,105);
  assert.equal(engine.executePulse(base).duplicate,true);
  assert.throws(()=>engine.executePulse({...base,actorId:"player"}),/DM_REQUIRED/);
  assert.throws(()=>engine.executePulse({...base,changes:[{...base.changes[0],stockDelta:1}]}),/IDEMPOTENCY_CONFLICT/);
  assert.throws(()=>engine.executePulse({...base,pulseId:"p2"}),/REVISION_CONFLICT/);
  const broken={...base,pulseId:"broken",changes:[{...base.changes[0],expectedRevision:1,stockDelta:-100}]};
  assert.throws(()=>engine.executePulse(broken),/MARKET_BOUNDS/);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_settlement_market_pulses WHERE campaign_id='a'").get().n,1);
  assert.equal(db.prepare("SELECT stock_units n FROM vtt_settlement_markets WHERE campaign_id='a'").get().n,7);
  assert.equal(db.prepare("SELECT stock_units n FROM vtt_settlement_markets WHERE campaign_id='b'").get().n,10);
  migrate(db);
  assert.equal(createSettlementMarketPulseEngine(db).executePulse(base).duplicate,true);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_artifacts").get().n,0);
 }finally{db.close();}
});
