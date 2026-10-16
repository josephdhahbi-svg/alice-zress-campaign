"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const adminToken="test-local-admin-token-which-is-long-enough";
test("combat API requires signed DM, blocks outsiders, persists idempotent state", {timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token:adminToken,schedule:false});
 const {server,db}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+adminToken,"Content-Type":"application/json"};
  const request=async(url,method,headers,body)=>{
   const r=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
   return {status:r.status,body:await r.json()};
  };
  for(const campaignId of ["alpha","beta"]){
   assert.equal((await request("/api/campaigns","POST",admin,{campaignId,name:campaignId,actorId:"dm"})).status,201);
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run(campaignId,"player");
  }
  const actor=async id=>{
   const response=await request("/api/admin/sessions","POST",admin,{actorId:id});
   assert.equal(response.status,201);
   return {Authorization:"Bearer "+response.body.accessToken,"Content-Type":"application/json"};
  };
  const dm=await actor("dm"),player=await actor("player"),outsider=await actor("outsider");
  const url="/api/campaigns/alpha/combat/encounters";
  const payload={encounterId:"e1",combatants:[{combatantId:"alice",initiative:12,hp:5,maxHp:9,ownerActorId:"player"},{combatantId:"enemy",initiative:8,hp:8,maxHp:8}]};
  assert.equal((await request(url,"POST",admin,payload)).status,403);
  assert.equal((await request(url,"POST",player,payload)).status,403);
  assert.equal((await request(url,"POST",outsider,payload)).status,403);
  assert.equal((await request(url,"POST",dm,payload)).status,201);
  const actionUrl=url+"/e1/actions";
  const action={actionId:"hit1",kind:"DAMAGE",targetId:"alice",amount:3};
  assert.equal((await request(actionUrl,"POST",player,action)).status,403);
  assert.equal((await request(actionUrl,"POST",dm,action)).status,201);
  const replay=await request(actionUrl,"POST",dm,action);
  assert.equal(replay.status,200);
  assert.equal(replay.body.encounter.duplicate,true);
  const state=await request(url+"/e1","GET",player);
  assert.equal(state.status,200);
  assert.equal(state.body.encounter.combatants[0].hp,2);
  assert.equal((await request(url+"/e1","GET",outsider)).status,403);
  assert.equal((await request("/api/campaigns/beta/combat/encounters/e1","GET",dm)).status,404);
 }finally{await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve()})})}
});
