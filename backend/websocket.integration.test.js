"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const net=require("node:net");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const WebSocket=require("ws");
const admin="test-only-local-token-with-at-least-24-characters";
async function port(){
  const s=net.createServer();
  await new Promise(r=>s.listen(0,"127.0.0.1",r));
  const n=s.address().port;
  await new Promise(r=>s.close(r));
  return n;
}
function connect(url,session){
  return new Promise((resolve,reject)=>{
    const ws=new WebSocket(url,["moonveil."+session]);
    ws.initialMessage=new Promise(resolve=>ws.once("message",buf=>resolve(JSON.parse(String(buf)))));
    const timer=setTimeout(()=>{ws.terminate();reject(new Error("WebSocket timeout"));},3000);
    ws.once("open",()=>{clearTimeout(timer);resolve(ws);});
    ws.once("error",e=>{clearTimeout(timer);reject(e);});
    ws.once("unexpected-response",(_req,res)=>{clearTimeout(timer);reject(new Error("WebSocket denied: "+res.statusCode));});
  });
}
function message(ws){
  return new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error("Missing campaign event")),2500);
    ws.once("message",buf=>{clearTimeout(timer);resolve(JSON.parse(String(buf)));});
  });
}
test("WebSocket event delivery is restricted to authenticated campaign members",{timeout:20000},async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-ws-"));
  const p=await port();
  const child=spawn(process.execPath,["server.js"],{cwd:path.resolve(__dirname,".."),
    env:{...process.env,PORT:String(p),MOONVEIL_DEV_TOKEN:admin,MOONVEIL_DB_PATH:path.join(dir,"test.db"),MOONVEIL_ENABLE_CRON:"0"},stdio:"ignore"});
  const base="http://127.0.0.1:"+p;
  const headers={Authorization:"Bearer "+admin,"Content-Type":"application/json"};
  const post=async(route,body)=>fetch(base+route,{method:"POST",headers,body:JSON.stringify(body)});
  let ws;
  try{
    for(let i=0;i<70;i++){
      try{const r=await fetch(base+"/api/health",{headers});if(r.ok)break;}catch{}
      if(i===69)throw Error("Server not ready");
      await new Promise(r=>setTimeout(r,100));
    }
    assert.equal((await post("/api/campaigns",{campaignId:"a",name:"A",actorId:"alice"})).status,201);
    assert.equal((await post("/api/campaigns",{campaignId:"b",name:"B",actorId:"bob"})).status,201);
    const alice=(await (await post("/api/admin/sessions",{actorId:"alice"})).json()).accessToken;
    const bob=(await (await post("/api/admin/sessions",{actorId:"bob"})).json()).accessToken;
    const url="ws://127.0.0.1:"+p+"/events?campaignId=";
    await assert.rejects(connect(url+"a",bob),/denied|403/i);
    await assert.rejects(connect(url+"b",alice),/denied|403/i);
    ws=await connect(url+"a",alice);
    const connected=await ws.initialMessage;
    assert.equal(connected.campaignId,"a");
    const next=message(ws);
    const sent=await fetch(base+"/api/campaigns/a/events",{method:"POST",
      headers:{Authorization:"Bearer "+alice,"Content-Type":"application/json"},
      body:JSON.stringify({eventId:"evt1",expectedRevision:0,eventType:"SCENE_STARTED",payload:{scene:"pit"}})});
    assert.equal(sent.status,201);
    const event=await next;
    assert.equal(event.type,"CAMPAIGN_EVENT");
    assert.equal(event.campaignId,"a");
    assert.equal(event.revision,1);
    assert.equal(event.eventType,"SCENE_STARTED");
    // Recover committed history after a disconnected socket.
    ws.terminate();
    ws=await connect(url+"a",alice);
    assert.equal((await ws.initialMessage).campaignId,"a");
    const replayResponse=await fetch(base+"/api/campaigns/a/events?after=0",{
      headers:{Authorization:"Bearer "+alice}});
    assert.equal(replayResponse.status,200);
    const replayBody=await replayResponse.json();
    assert.equal(replayBody.events.length,1);
    assert.equal(replayBody.events[0].event_id,"evt1");
    // A stale expected revision must not overwrite a committed event.
    const staleResponse=await fetch(base+"/api/campaigns/a/events",{
      method:"POST",
      headers:{Authorization:"Bearer "+alice,"Content-Type":"application/json"},
      body:JSON.stringify({eventId:"stale-1",expectedRevision:0,
        eventType:"SCENE_STARTED",payload:{scene:"alternate"}})});
    assert.equal(staleResponse.status,409);
    assert.equal((await staleResponse.json()).error,"REVISION_CONFLICT");
    const logout=await fetch(base+"/api/sessions/logout",{method:"POST",headers:{Authorization:"Bearer "+alice}});
    assert.equal(logout.status,200);
    await assert.rejects(connect(url+"a",alice),/denied|403/i);
  }finally{
    if(ws)ws.terminate();
    child.kill("SIGTERM");
    await new Promise(r=>{if(child.exitCode!==null)return r();child.once("exit",r);setTimeout(r,1000).unref();});
    fs.rmSync(dir,{recursive:true,force:true});
  }
});
