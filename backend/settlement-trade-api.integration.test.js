"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="settlement-integration-admin-token-long-enough";
test("settlement HTTP API enforces signed DM, membership, replay and isolation",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const request=async(method,url,headers,body)=>{
   const r=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
   return {status:r.status,body:await r.json()};
  };
  const post=(url,h,b)=>request("POST",url,h,b);
  for(const campaignId of ["a","b"]){
   assert.equal((await post("/api/campaigns",admin,{campaignId,name:campaignId,actorId:"dm"})).status,201);
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run(campaignId,"alice");
  }
  const session=async actorId=>{
   const r=await post("/api/admin/sessions",admin,{actorId});
   return {Authorization:"Bearer "+r.body.accessToken,"Content-Type":"application/json"};
  };
  const dm=await session("dm"),alice=await session("alice"),outsider=await session("outsider");
  const root="/api/campaigns/a/world/settlements";
  assert.equal((await request("GET",root,outsider)).status,403);
  assert.equal((await request("GET",root,alice)).status,200);
  const settlement={settlementId:"s",name:"Refuge",planeId:"material",regionId:"underdark"};
  assert.equal((await post(root+"/create",alice,settlement)).status,403);
  assert.equal((await post(root+"/create",admin,settlement)).status,403);
  assert.equal((await post(root+"/create",dm,settlement)).status,201);
  assert.equal((await post(root+"/create",dm,settlement)).status,200);
  assert.equal((await post("/api/campaigns/a/world/economy/commodities",dm,{commodityId:"ore",priceCopper:100})).status,201);
  const market={settlementId:"s",commodityId:"ore",stockUnits:10,localPriceCopper:120};
  assert.equal((await post(root+"/markets",dm,market)).status,201);
  const trade={tradeId:"t",settlementId:"s",commodityId:"ore",expectedRevision:0,unitsDelta:-2,reason:"Refugee supplies"};
  assert.equal((await post(root+"/trades",alice,trade)).status,403);
  assert.equal((await post(root+"/trades",dm,trade)).status,201);
  assert.equal((await post(root+"/trades",dm,trade)).status,200);
  assert.equal((await post(root+"/trades",dm,{...trade,tradeId:"t2"})).status,409);
  assert.equal((await request("GET",root,alice)).body.markets[0].stock_units,8);
  assert.deepEqual((await request("GET","/api/campaigns/b/world/settlements",alice)).body.markets,[]);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_settlement_trade_audit").get().n,1);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_artifacts").get().n,0);
 }finally{await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve();});});}
});
