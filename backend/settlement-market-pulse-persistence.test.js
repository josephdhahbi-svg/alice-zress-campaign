"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),Database=require("better-sqlite3");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {migrate}=require("./migrations");
const {createSettlementMarketPulseEngine}=require("./settlement-market-pulse");
function open(file){const db=new Database(file);db.pragma("foreign_keys=ON");db.pragma("busy_timeout=1000");migrate(db);return db;}
test("file-backed market pulse survives process-style close and reopen; competing writer cannot double apply",()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-market-pulse-"));
 const file=path.join(directory,"campaign.sqlite");
 let first,second;
 try{
  first=open(file);
  first.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("c","Campaign","now");
  first.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c","dm","DM");
  first.prepare("INSERT INTO vtt_world_economy VALUES(?,?,?,0)").run("c","ore",100);
  first.prepare("INSERT INTO vtt_settlements VALUES(?,?,?,?,?,?)").run("c","s","Refuge","material","underdark","dm");
  first.prepare("INSERT INTO vtt_settlement_markets VALUES(?,?,?,?,?,0)").run("c","s","ore",10,100);
  second=open(file);
  const pulse={campaignId:"c",actorId:"dm",pulseId:"pulse",changes:[{settlementId:"s",commodityId:"ore",expectedRevision:0,stockDelta:-2,priceBasisPoints:100}]};
  assert.equal(createSettlementMarketPulseEngine(first).executePulse(pulse).duplicate,false);
  assert.equal(createSettlementMarketPulseEngine(second).executePulse(pulse).duplicate,true);
  assert.throws(()=>createSettlementMarketPulseEngine(second).executePulse({...pulse,pulseId:"other"}),/REVISION_CONFLICT/);
  first.close();first=null;
  second.close();second=null;
  const reopened=open(file);
  try{
   assert.equal(createSettlementMarketPulseEngine(reopened).executePulse(pulse).duplicate,true);
   assert.equal(reopened.prepare("SELECT stock_units AS stock,revision FROM vtt_settlement_markets WHERE campaign_id='c'").get().stock,8);
   assert.equal(reopened.prepare("SELECT COUNT(*) AS n FROM vtt_settlement_market_pulses").get().n,1);
  }finally{reopened.close();}
 }finally{
  if(first)first.close();if(second)second.close();
  fs.rmSync(directory,{recursive:true,force:true});
 }
});
