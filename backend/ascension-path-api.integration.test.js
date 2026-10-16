"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="ascension-readonly-integration-admin-token";
test("signed ascension catalog: membership, isolation, unknown path and no grants",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const post=async(url,headers,body)=>{
   const response=await fetch(base+url,{method:"POST",headers,body:JSON.stringify(body)});
   const raw=await response.text();return {status:response.status,body:raw.startsWith("{")?JSON.parse(raw):raw};
  };
  const get=async(url,headers)=>{
   const response=await fetch(base+url,{headers});
   return {status:response.status,body:await response.json()};
  };
  assert.equal((await post("/api/campaigns",admin,{campaignId:"alpha",name:"Alpha",actorId:"dm"})).status,201);
  assert.equal((await post("/api/campaigns",admin,{campaignId:"beta",name:"Beta",actorId:"otherdm"})).status,201);
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("alpha","alice");
  const session=async actorId=>{
   const result=await post("/api/admin/sessions",admin,{actorId});
   assert.equal(result.status,201);
   return {Authorization:"Bearer "+result.body.accessToken,"Content-Type":"application/json"};
  };
  const alice=await session("alice"),other=await session("otherdm"),outsider=await session("outsider");
  const url="/api/campaigns/alpha/ascension/paths";
  assert.equal((await get(url,admin)).status,403);
  assert.equal((await get(url,outsider)).status,403);
  assert.equal((await get(url,other)).status,403);
  assert.equal((await get("/api/campaigns/beta/ascension/paths",alice)).status,403);
  const list=await get(url,alice);
  assert.equal(list.status,200);
  assert.equal(list.body.paths.length,7);
  assert.equal(list.body.rewardApproved,false);
  assert.equal(list.body.paths.every(p=>p.ritualApproved===false&&p.rewardApproved===false),true);
  const path=await get(url+"/path_web",alice);
  assert.equal(path.status,200);
  assert.equal(path.body.path.deity,"Lolth");
  assert.equal(path.body.path.quests.length,5);
  assert.equal((await get(url+"/not_a_path",alice)).status,404);
  assert.equal((await post(url+"/path_moon/ritual",alice,{verifiedQuestIds:["moon_q1"]})).status,404);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_artifacts").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_quest_completions").get().n,0);
 }finally{
  await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve();});});
 }
});
