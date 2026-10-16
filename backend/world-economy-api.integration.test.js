"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="economy-api-test-admin-token-long-enough";
test("signed economy API: DM writes, members read, outsiders denied, revision and replay safe",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const request=async(method,url,headers,body)=>{
   const response=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
   return {status:response.status,body:await response.json()};
  };
  const post=(url,headers,body)=>request("POST",url,headers,body);
  for(const campaignId of ["alpha","beta"]){
   assert.equal((await post("/api/campaigns",admin,{campaignId,name:campaignId,actorId:"dm"})).status,201);
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run(campaignId,"alice");
  }
  const session=async actorId=>{
   const result=await post("/api/admin/sessions",admin,{actorId});
   assert.equal(result.status,201);
   return {Authorization:"Bearer "+result.body.accessToken,"Content-Type":"application/json"};
  };
  const dm=await session("dm"),player=await session("alice"),outsider=await session("outsider");
  const root="/api/campaigns/alpha/world/economy";
  assert.equal((await request("GET",root,admin)).status,403);
  assert.equal((await request("GET",root,outsider)).status,403);
  assert.equal((await request("GET",root,player)).status,200);
  assert.equal((await post(root+"/commodities",player,{commodityId:"mithral",priceCopper:100})).status,403);
  assert.equal((await post(root+"/commodities",admin,{commodityId:"mithral",priceCopper:100})).status,403);
  assert.equal((await post(root+"/commodities",dm,{commodityId:"mithral",priceCopper:100})).status,201);
  assert.equal((await post(root+"/commodities",dm,{commodityId:"mithral",priceCopper:100})).status,200);
  assert.equal((await post(root+"/commodities",dm,{commodityId:"mithral",priceCopper:999})).status,409);
  const adjustment={adjustmentId:"pulse1",commodityId:"mithral",expectedRevision:0,changeBasisPoints:500,reason:"DM-approved market event"};
  assert.equal((await post(root+"/adjustments",player,adjustment)).status,403);
  assert.equal((await post(root+"/adjustments",dm,{...adjustment,changeBasisPoints:501})).status,400);
  assert.equal((await post(root+"/adjustments",dm,adjustment)).status,201);
  assert.equal((await post(root+"/adjustments",dm,adjustment)).status,200);
  assert.equal((await post(root+"/adjustments",dm,{...adjustment,changeBasisPoints:-500})).status,409);
  assert.equal((await post(root+"/adjustments",dm,{...adjustment,adjustmentId:"pulse2"})).status,409);
  const a=await request("GET",root,player),b=await request("GET","/api/campaigns/beta/world/economy",player);
  assert.equal(a.body.commodities[0].price_copper,105);
  assert.deepEqual(b.body.commodities,[]);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_world_economy_adjustments WHERE campaign_id='alpha'").get().n,1);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_character_artifacts").get().n,0);
 }finally{
  await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve();});});
 }
});
