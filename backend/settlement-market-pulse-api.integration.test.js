"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="market-pulse-http-test-admin-token-strong";
test("signed market pulse HTTP: DM only, replay, revision, atomic rollback and campaign isolation",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const post=async(url,headers,body)=>{
   const response=await fetch(base+url,{method:"POST",headers,body:JSON.stringify(body)});
   return {status:response.status,body:await response.json()};
  };
  const get=async(url,headers)=>{
   const response=await fetch(base+url,{headers});
   return {status:response.status,body:await response.json()};
  };
  for(const campaignId of ["alpha","beta"]){
   assert.equal((await post("/api/campaigns",admin,{campaignId,name:campaignId,actorId:"dm"})).status,201);
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run(campaignId,"alice");
  }
  const session=async actorId=>{
   const response=await post("/api/admin/sessions",admin,{actorId});
   assert.equal(response.status,201);
   return {Authorization:"Bearer "+response.body.accessToken,"Content-Type":"application/json"};
  };
  const dm=await session("dm"),player=await session("alice"),outsider=await session("outsider");
  const root="/api/campaigns/alpha/world/settlements";
  const pulseUrl=root+"/pulses";
  assert.equal((await post(root+"/create",dm,{settlementId:"refuge",name:"Moon Refuge",planeId:"material",regionId:"underdark"})).status,201);
  assert.equal((await post("/api/campaigns/alpha/world/economy/commodities",dm,{commodityId:"ore",priceCopper:100})).status,201);
  assert.equal((await post("/api/campaigns/alpha/world/economy/commodities",dm,{commodityId:"grain",priceCopper:100})).status,201);
  for(const commodityId of ["ore","grain"])
   assert.equal((await post(root+"/markets",dm,{settlementId:"refuge",commodityId,stockUnits:10,localPriceCopper:100})).status,201);
  const changes=[{settlementId:"refuge",commodityId:"ore",expectedRevision:0,stockDelta:-3,priceBasisPoints:500}];
  const pulse={pulseId:"event1",changes};
  assert.equal((await post(pulseUrl,admin,pulse)).status,403);
  assert.equal((await post(pulseUrl,player,pulse)).status,403);
  assert.equal((await post(pulseUrl,outsider,pulse)).status,403);
  const first=await post(pulseUrl,dm,pulse);
  assert.equal(first.status,201);
  assert.equal(first.body.results[0].stockUnits,7);
  assert.equal(first.body.results[0].priceCopper,105);
  const retry=await post(pulseUrl,dm,pulse);
  assert.equal(retry.status,200);
  assert.equal(retry.body.duplicate,true);
  assert.equal((await post(pulseUrl,dm,{...pulse,changes:[{...changes[0],stockDelta:1}]})).status,409);
  assert.equal((await post(pulseUrl,dm,{pulseId:"stale",changes})).status,409);
  assert.equal((await post(pulseUrl,dm,{pulseId:"invalid",changes:[{...changes[0],expectedRevision:1,priceBasisPoints:501}]})).status,400);
  const mixed={pulseId:"rollback",changes:[
   {settlementId:"refuge",commodityId:"grain",expectedRevision:0,stockDelta:5,priceBasisPoints:100},
   {settlementId:"refuge",commodityId:"ore",expectedRevision:1,stockDelta:-100,priceBasisPoints:100}
  ]};
  assert.equal((await post(pulseUrl,dm,mixed)).status,409);
  const markets=(await get(root,player)).body.markets;
  assert.equal(markets.find(m=>m.commodity_id==="ore").stock_units,7);
  assert.equal(markets.find(m=>m.commodity_id==="grain").stock_units,10);
  assert.deepEqual((await get("/api/campaigns/beta/world/settlements",player)).body.markets,[]);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_settlement_market_pulses").get().n,1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_character_artifacts").get().n,0);
 }finally{
  await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve();});});
 }
});
