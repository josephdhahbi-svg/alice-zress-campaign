"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),Database=require("better-sqlite3");
const {migrate,MIGRATIONS}=require("./migrations");
const {createWorldEconomyEngine}=require("./world-economy");
test("economy migration v6 survives replay and restart without losing adjustment ledger",()=>{
 const db=new Database(":memory:");
 try{
  db.pragma("foreign_keys=ON");
  assert.throws(()=>createWorldEconomyEngine(db),/ECONOMY_MIGRATION_REQUIRED/);
  migrate(db);
  assert.ok(MIGRATIONS.some(m=>m.version===6));
  db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("c","C","now");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c","dm","DM");
  const engine=createWorldEconomyEngine(db);
  engine.defineCommodity({campaignId:"c",actorId:"dm",commodityId:"ore",priceCopper:100});
  engine.adjustPrice({campaignId:"c",actorId:"dm",adjustmentId:"a1",commodityId:"ore",expectedRevision:0,changeBasisPoints:500,reason:"Market event"});
  migrate(db);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_schema_migrations").get().n,MIGRATIONS.length);
  assert.equal(createWorldEconomyEngine(db).getPrices("c")[0].price_copper,105);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_world_economy_adjustments").get().n,1);
 }finally{db.close();}
});
