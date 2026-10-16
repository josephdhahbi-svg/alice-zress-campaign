"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const net=require("node:net");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const token="elder-eye-http-test-token-with-24-characters";
async function freePort(){
 const s=net.createServer();await new Promise((ok,fail)=>s.once("error",fail).listen(0,"127.0.0.1",ok));
 const port=s.address().port;await new Promise(ok=>s.close(ok));return port;
}
async function ready(child,base){
 for(let i=0;i<90;i++){if(child.exitCode!==null)throw Error("server exited "+child.exitCode);
  try{if((await fetch(base+"/api/health",{headers:{Authorization:"Bearer "+token}})).ok)return;}catch{}
  await new Promise(ok=>setTimeout(ok,100));
 }
 throw Error("server startup timeout");
}
test("Elder Eye scene HTTP is scoped and cannot be forged through generic journal", {timeout:25000},async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"elder-eye-http-"));
 const port=await freePort(),base="http://127.0.0.1:"+port;
 const child=spawn(process.execPath,["server.js"],{cwd:path.resolve(__dirname,".."),env:{...process.env,PORT:String(port),MOONVEIL_DEV_TOKEN:token,MOONVEIL_DB_PATH:path.join(dir,"test.db"),MOONVEIL_ENABLE_CRON:"0"},stdio:"ignore"});
 const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
 const request=(url,method,headers,body)=>fetch(base+url,{method,headers,body:body?JSON.stringify(body):undefined});
 const scene="scene-book01-rabbit-hole-01";
 try{
  await ready(child,base);
  assert.equal((await request("/api/elder-eye/scenes/"+scene,"GET",admin)).status,410);
  assert.equal((await request("/api/campaigns/c1/scenes/"+scene,"GET",admin)).status,400);
  const create=await request("/api/campaigns/c1","POST",admin,{campaignId:"c1",name:"Elder Eye Test",actorId:"alice"});
  // Campaign creation is mounted at /api/campaigns, not /api/campaigns/:id.
  assert.equal(create.status,404);
  assert.equal((await request("/api/campaigns","POST",admin,{campaignId:"c1",name:"Elder Eye Test",actorId:"alice"})).status,201);
  const signed=await request("/api/admin/sessions","POST",admin,{actorId:"alice",ttlSeconds:3600});
  assert.equal(signed.status,201);
  const access=(await signed.json()).accessToken;
  const alice={Authorization:"Bearer "+access,"Content-Type":"application/json","X-Moonveil-Actor":"intruder"};
  const outsiderSession=await request("/api/admin/sessions","POST",admin,{actorId:"outsider"});
  const outsider={Authorization:"Bearer "+(await outsiderSession.json()).accessToken};
  assert.equal((await request("/api/campaigns/c1/scenes/"+scene,"GET",outsider)).status,403);
  const read=await request("/api/campaigns/c1/scenes/"+scene,"GET",alice);
  assert.equal(read.status,200);
  const body=await read.json();assert.equal(body.scene.choices.length,5);
  assert.equal((await request("/api/campaigns/c1/events","POST",alice,{eventId:"forged",expectedRevision:0,eventType:"ELDER_EYE_CHOICE",payload:{success:true}})).status,403);
  const choice={eventId:"choice-1",expectedRevision:0,option:1,modifier:0};
  const first=await request("/api/campaigns/c1/scenes/"+scene+"/choices","POST",alice,choice);
  assert.equal(first.status,201);const outcome=await first.json();
  assert.ok(outcome.result.roll>=1&&outcome.result.roll<=20);
  const again=await request("/api/campaigns/c1/scenes/"+scene+"/choices","POST",alice,choice);
  assert.equal(again.status,200);const replay=await again.json();
  assert.deepEqual(replay.result,outcome.result);
  assert.equal((await request("/api/campaigns/c1/scenes/"+scene+"/choices","POST",alice,{...choice,eventId:"choice-2"})).status,409);
  const events=await request("/api/campaigns/c1/events","GET",alice);
  assert.equal((await events.json()).events.length,1);
 }finally{child.kill();fs.rmSync(dir,{recursive:true,force:true});}
});
