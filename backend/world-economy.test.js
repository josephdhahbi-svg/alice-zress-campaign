"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createWorldEconomyEngine}=require("./world-economy");
test("campaign economy is bounded, audited, idempotent, and DM-only",()=>{
 const db=new Database(":memory:");
 try{
  db.pragma("foreign_keys=ON");migrate(db);
  for(const campaign of ["a","b"]){
   db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run(campaign,campaign,"now");
   for(const [actor,role] of [["dm","DM"],["alice","PLAYER"]])
    db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run(campaign,actor,role);
  }
  const e=createWorldEconomyEngine(db);
  assert.throws(()=>e.defineCommodity({campaignId:"a",actorId:"alice",commodityId:"mithral",priceCopper:500}),/DM_REQUIRED/);
  assert.equal(e.defineCommodity({campaignId:"a",actorId:"dm",commodityId:"mithral",priceCopper:500}).duplicate,false);
  assert.equal(e.defineCommodity({campaignId:"a",actorId:"dm",commodityId:"mithral",priceCopper:500}).duplicate,true);
  assert.deepEqual(e.getPrices("b"),[]);
  const input={campaignId:"a",actorId:"dm",adjustmentId:"tick1",commodityId:"mithral",expectedRevision:0,changeBasisPoints:500,reason:"DM market event"};
  assert.deepEqual(e.adjustPrice(input),{duplicate:false,priceCopper:525,revision:1});
  assert.equal(e.adjustPrice(input).duplicate,true);
  assert.throws(()=>e.adjustPrice({...input,changeBasisPoints:-500}),/IDEMPOTENCY_CONFLICT/);
  assert.throws(()=>e.adjustPrice({...input,adjustmentId:"tick2"}),/REVISION_CONFLICT/);
  assert.throws(()=>e.adjustPrice({...input,adjustmentId:"tick2",expectedRevision:1,changeBasisPoints:501}),/INVALID_ADJUSTMENT/);
  assert.equal(e.getPrices("a")[0].price_copper,525);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_world_economy_adjustments").get().n,1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_world_pulses").get().n,0);
 }finally{db.close();}
});
