"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const net = require("node:net");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const token = "test-only-local-token-with-at-least-24-characters";
async function freePort() {
  const server = net.createServer();
  await new Promise((resolve,reject)=>server.once("error",reject).listen(0,"127.0.0.1",resolve));
  const port=server.address().port;
  await new Promise(resolve=>server.close(resolve));
  return port;
}
async function waitForReady(child,port) {
  for(let i=0;i<80;i++){
    if(child.exitCode!==null)throw new Error("Server exited before ready: "+child.exitCode);
    try{
      const r=await fetch("http://127.0.0.1:"+port+"/api/health",{headers:{Authorization:"Bearer "+token}});
      if(r.ok)return;
    }catch(_){}
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error("Server did not become ready");
}
test("local server protects APIs and persists bounded relationship updates", {timeout:20000}, async()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-server-"));
  const port=await freePort();
  const child=spawn(process.execPath,["server.js"],{
    cwd:path.resolve(__dirname,".."),
    env:{...process.env,PORT:String(port),MOONVEIL_DEV_TOKEN:token,
      MOONVEIL_DB_PATH:path.join(dir,"test.db"),MOONVEIL_ENABLE_CRON:"0"},
    stdio:"ignore"
  });
  const base="http://127.0.0.1:"+port;
  const headers={"Authorization":"Bearer "+token,"Content-Type":"application/json"};
  try{
    await waitForReady(child,port);
    const denied=await fetch(base+"/api/health");
    assert.equal(denied.status,401);
    const health=await fetch(base+"/api/health",{headers});
    assert.equal(health.status,200);
    assert.equal((await health.json()).wal,true);
    const bad=await fetch(base+"/api/romance/approval",{method:"POST",headers,
      body:JSON.stringify({entityId:"alice",companionName:"ally",delta:999})});
    assert.equal(bad.status,400);
    const approval=await fetch(base+"/api/romance/approval",{method:"POST",headers,
      body:JSON.stringify({entityId:"alice",companionName:"ally",delta:7})});
    assert.equal(approval.status,200);
    const relationship=(await approval.json()).relationship;
    assert.equal(relationship.approval_score,7);
    assert.equal(relationship.romance_active,0);
    const missing=await fetch(base+"/api/items/equip-advanced",{method:"POST",headers,
      body:JSON.stringify({entityId:"alice",itemId:"nonexistent",slot:"hand"})});
    assert.equal(missing.status,404);
    const war=await fetch(base+"/api/war-table/overview/book01",{headers});
    assert.deepEqual((await war.json()).territories,[]);
    const factions=await fetch(base+"/api/factions",{headers});
    assert.deepEqual((await factions.json()).factions,[]);
    const created=await fetch(base+"/api/campaigns",{method:"POST",headers,
      body:JSON.stringify({campaignId:"test-campaign",name:"Local Test",actorId:"dm-1"})});
    assert.equal(created.status,201);
    const memberHeaders={...headers,"X-Moonveil-Actor":"dm-1"};
    const outsider=await fetch(base+"/api/campaigns/test-campaign/events",{headers:{...headers,"X-Moonveil-Actor":"intruder"}});
    assert.equal(outsider.status,403);
    const payload={eventId:"event-1",expectedRevision:0,eventType:"SCENE_STARTED",payload:{scene:"pit"}};
    const first=await fetch(base+"/api/campaigns/test-campaign/events",{method:"POST",headers:memberHeaders,body:JSON.stringify(payload)});
    assert.equal(first.status,201);
    assert.equal((await first.json()).revision,1);
    const retry=await fetch(base+"/api/campaigns/test-campaign/events",{method:"POST",headers:memberHeaders,body:JSON.stringify(payload)});
    assert.equal(retry.status,200);
    assert.equal((await retry.json()).duplicate,true);
    const conflict=await fetch(base+"/api/campaigns/test-campaign/events",{method:"POST",headers:memberHeaders,
      body:JSON.stringify({...payload,eventId:"event-2"})});
    assert.equal(conflict.status,409);
    const read=await fetch(base+"/api/campaigns/test-campaign/events",{headers:memberHeaders});
    assert.equal((await read.json()).events.length,1);
    const pulse=await fetch(base+"/api/admin/world-pulse",{method:"POST",headers,body:"{}"});
    assert.equal(pulse.status,200);
    const duplicate=await fetch(base+"/api/admin/world-pulse",{method:"POST",headers,body:"{}"});
    assert.equal((await duplicate.json()).applied,false);
  }finally{
    child.kill("SIGTERM");
    await new Promise(resolve=>{if(child.exitCode!==null)return resolve();child.once("exit",resolve);setTimeout(resolve,1000).unref();});
    fs.rmSync(dir,{recursive:true,force:true});
  }
});
