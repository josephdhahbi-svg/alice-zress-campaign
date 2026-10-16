"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {WebSocket}=require("ws");
const {spawn}=require("node:child_process");
const net=require("node:net");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const token="test-only-local-token-with-at-least-24-characters";
async function port(){
 const s=net.createServer();await new Promise(r=>s.listen(0,"127.0.0.1",r));
 const p=s.address().port;await new Promise(r=>s.close(r));return p;
}
function connect(url,protocol){
 return new Promise((resolve,reject)=>{
  const ws=new WebSocket(url,[protocol]);
  ws.once("error",reject);
  ws.once("open",()=>resolve(ws));
 });
}
function receive(ws){
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error("No websocket message")),3000);
  ws.once("message",raw=>{clearTimeout(timer);resolve(JSON.parse(raw.toString()));});
 });
}
test("campaign sockets isolate events and reject unauthorized actors",{timeout:20000},async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-ws-")),p=await port();
 const child=spawn(process.execPath,["server.js"],{cwd:path.resolve(__dirname,".."),
  env:{...process.env,PORT:String(p),MOONVEIL_DB_PATH:path.join(dir,"db.sqlite"),
   MOONVEIL_DEV_TOKEN:token,MOONVEIL_ENABLE_CRON:"0"},stdio:"ignore"});
 const base="http://127.0.0.1:"+p,wsBase="ws://127.0.0.1:"+p;
 const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
 const post=async(url,body,headers=admin)=>fetch(base+url,{method:"POST",headers,body:JSON.stringify(body)});
 let aliceSocket,otherSocket;
 try{
  for(let i=0;i<80;i++){try{const r=await fetch(base+"/api/health",{headers:admin});if(r.ok)break;}catch{}
   await new Promise(r=>setTimeout(r,100));}
  assert.equal((await post("/api/campaigns",{campaignId:"alice",name:"Alice",actorId:"alice-dm"})).status,201);
  assert.equal((await post("/api/campaigns",{campaignId:"other",name:"Other",actorId:"other-dm"})).status,201);
  const mint=async actorId=>(await (await post("/api/admin/sessions",{actorId})).json()).accessToken;
  const a=await mint("alice-dm"),b=await mint("other-dm");
  await assert.rejects(connect(wsBase+"/events?campaignId=other","moonveil."+a));
  aliceSocket=await connect(wsBase+"/events?campaignId=alice","moonveil."+a);
  otherSocket=await connect(wsBase+"/events?campaignId=other","moonveil."+b);
  // Connection acknowledgement can arrive before a test listener attaches.
  await new Promise(r=>setTimeout(r,40));
  let leaked=false;otherSocket.on("message",()=>{leaked=true;});
  const notice=receive(aliceSocket);
  const write=await post("/api/campaigns/alice/events",
   {eventId:"e1",expectedRevision:0,eventType:"SCENE_STARTED",payload:{scene:"pit"}},
   {Authorization:"Bearer "+a,"Content-Type":"application/json"});
  assert.equal(write.status,201);
  assert.equal((await notice).revision,1);
  await new Promise(r=>setTimeout(r,150));
  assert.equal(leaked,false);
  // Reconnecting from revision zero should signal a missed event, while
  // reconnecting from revision one should not.
  const replayMessages=[];
  const replaySocket=new WebSocket(wsBase+"/events?campaignId=alice&after=0",["moonveil."+a]);
  replaySocket.on("message",raw=>replayMessages.push(JSON.parse(raw.toString())));
  await new Promise((resolve,reject)=>{replaySocket.once("open",resolve);replaySocket.once("error",reject);});
  await new Promise(r=>setTimeout(r,80));
  assert.equal(replayMessages[0].type,"CONNECTED");
  assert.equal(replayMessages[0].revision,1);
  assert.equal(replayMessages[1].type,"CATCH_UP_REQUIRED");
  replaySocket.terminate();
  const caughtUp=[];
  const currentSocket=new WebSocket(wsBase+"/events?campaignId=alice&after=1",["moonveil."+a]);
  currentSocket.on("message",raw=>caughtUp.push(JSON.parse(raw.toString())));
  await new Promise((resolve,reject)=>{currentSocket.once("open",resolve);currentSocket.once("error",reject);});
  await new Promise(r=>setTimeout(r,80));
  assert.equal(caughtUp.length,1);
  assert.equal(caughtUp[0].revision,1);
  currentSocket.terminate();
  await assert.rejects(connect(wsBase+"/events?campaignId=alice&after=-1","moonveil."+a));
  assert.equal((await post("/api/admin/sessions/revoke",{accessToken:a})).status,200);
  const rejected=await post("/api/campaigns/alice/events",
   {eventId:"e2",expectedRevision:1,eventType:"SCENE_STARTED",payload:{}},
   {Authorization:"Bearer "+a,"Content-Type":"application/json"});
  assert.equal(rejected.status,401);
 }finally{
  aliceSocket?.terminate();otherSocket?.terminate();child.kill();
  await new Promise(r=>{if(child.exitCode!==null)return r();child.once("exit",r);setTimeout(r,1000).unref();});
  fs.rmSync(dir,{recursive:true,force:true});
 }
});
