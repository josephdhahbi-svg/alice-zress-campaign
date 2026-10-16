"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="test-local-admin-token-which-is-long-enough";
test("signed DM world API enforces roles, isolation and idempotent ledger", {timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={"Authorization":"Bearer "+token,"Content-Type":"application/json"};
  const request=async(url,method,headers,body)=>{
   const r=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
   return {status:r.status,body:await r.json()};
  };
  for(const campaign of ["alpha","beta"]){
   const made=await request("/api/campaigns","POST",admin,{campaignId:campaign,name:campaign,actorId:"dm"});
   assert.equal(made.status,201);
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run(campaign,"player");
   for(const faction of ["blue","red"])db.prepare("INSERT INTO vtt_world_factions(campaign_id,faction_id,name,alignment,ideology_axis) VALUES(?,?,?,?,?)").run(campaign,faction,faction,faction==="blue"?"HERO":"VILLAIN","NEUTRAL");
   db.prepare("INSERT INTO vtt_world_territories(campaign_id,territory_id,name,zone_coords,controlling_faction_id,contested_status) VALUES(?,?,?,?,?,1)").run(campaign,"zone","Zone","[0,0,0]","blue");
  }
  const getActor=async actor=>{
   const response=await request("/api/admin/sessions","POST",admin,{actorId:actor});
   assert.equal(response.status,201);
   return {"Authorization":"Bearer "+response.body.accessToken,"Content-Type":"application/json","X-Moonveil-Actor":"dm"};
  };
  const dm=await getActor("dm"),player=await getActor("player"),outsider=await getActor("outsider");
  const endpoint="/api/campaigns/alpha/world/pulses";
  const payload={pulseId:"pulse1",drDate:"DR 1492",shifts:[{territoryId:"zone",newFactionId:"red"}]};
  assert.equal((await request(endpoint,"POST",admin,payload)).status,403);
  assert.equal((await request(endpoint,"POST",player,payload)).status,403);
  assert.equal((await request(endpoint,"POST",outsider,payload)).status,403);
  assert.equal((await request(endpoint,"POST",dm,{...payload,pulseId:"bad",shifts:[{territoryId:"zone",newFactionId:"missing"}]})).status,409);
  assert.equal((await request(endpoint,"POST",dm,payload)).status,201);
  const replay=await request(endpoint,"POST",dm,payload);
  assert.equal(replay.status,200);
  assert.equal(replay.body.duplicate,true);
  const ledger=await request("/api/campaigns/alpha/world/ledger","GET",dm);
  assert.equal(ledger.status,200);
  assert.equal(ledger.body.events.length,1);
  assert.equal(ledger.body.events[0].dr_date,"DR 1492");
  assert.equal((await request("/api/campaigns/alpha/world/ledger","GET",outsider)).status,403);
  assert.equal((await request("/api/campaigns/alpha/world/ledger?limit=-1","GET",dm)).status,400);
  const separate=await request("/api/campaigns/beta/world/ledger","GET",dm);
  assert.equal(separate.status,200);
  assert.equal(separate.body.events.length,0);
  assert.equal(db.prepare("SELECT controlling_faction_id FROM vtt_world_territories WHERE campaign_id='beta'").get().controlling_faction_id,"blue");
 }finally{await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve()})})}
});
