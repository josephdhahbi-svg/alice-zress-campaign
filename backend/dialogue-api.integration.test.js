"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="dialogue-api-integration-admin-token-long";
test("signed Rabbit Hole dialogue API denies outsiders and never mutates state",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const req=async(method,path,headers,body)=>{
   const res=await fetch(base+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
   const raw=await res.text();
   return {status:res.status,body:raw.startsWith("{")?JSON.parse(raw):raw};
  };
  assert.equal((await req("POST","/api/campaigns",admin,{campaignId:"alpha",name:"Alpha",actorId:"dm"})).status,201);
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("alpha","alice");
  const session=async actorId=>{
   const response=await req("POST","/api/admin/sessions",admin,{actorId});
   assert.equal(response.status,201);
   return {Authorization:"Bearer "+response.body.accessToken,"Content-Type":"application/json"};
  };
  const alice=await session("alice"),outsider=await session("outsider");
  const path="/api/campaigns/alpha/dialogue/pit_ghaunadaur";
  assert.equal((await req("GET",path,admin)).status,403);
  assert.equal((await req("GET",path,outsider)).status,403);
  const scene=await req("GET",path,alice);
  assert.equal(scene.status,200);
  assert.deepEqual(scene.body.choices.map(x=>x.type),["LAWFUL_GOOD","NEUTRAL_GOOD","CHAOTIC_GOOD","UTILITY","ACTION"]);
  const preview=await req("POST",path+"/preview",alice,{choiceType:"UTILITY"});
  assert.equal(preview.status,200);
  assert.equal(preview.body.allowed,false);
  assert.equal(preview.body.sideEffects,"NONE");
  assert.equal((await req("POST",path+"/preview",alice,{choiceType:"FAKE"})).status,400);
  assert.equal((await req("GET","/api/campaigns/alpha/dialogue/unknown",alice)).status,404);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_campaign_events").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_character_travel_events").get().n,0);
 }finally{
  await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve();});});
 }
});
