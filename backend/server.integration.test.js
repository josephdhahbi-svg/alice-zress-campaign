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
    const issue=await fetch(base+"/api/admin/sessions",{method:"POST",headers,
      body:JSON.stringify({actorId:"dm-1",ttlSeconds:3600})});
    assert.equal(issue.status,201);
    const sessionToken=(await issue.json()).accessToken;
    const actorHeaders={"Authorization":"Bearer "+sessionToken,"Content-Type":"application/json",
      "X-Moonveil-Actor":"intruder"};
    const blockedAdmin=await fetch(base+"/api/admin/world-pulse",{method:"POST",headers:actorHeaders,body:"{}"});
    assert.equal(blockedAdmin.status,403);
    const forged=await fetch(base+"/api/campaigns/test-campaign/events",{headers:actorHeaders});
    assert.equal(forged.status,200);
    const invalidToken=await fetch(base+"/api/campaigns/test-campaign/events",{
      headers:{"Authorization":"Bearer "+sessionToken+"tampered","X-Moonveil-Actor":"dm-1"}});
    assert.equal(invalidToken.status,401);
    const memberHeaders={...headers,"X-Moonveil-Actor":"dm-1"};
    const outsiderSession=await fetch(base+"/api/admin/sessions",{method:"POST",headers,
      body:JSON.stringify({actorId:"intruder"})});
    const outsiderToken=(await outsiderSession.json()).accessToken;
    const outsider=await fetch(base+"/api/campaigns/test-campaign/events",{
      headers:{"Authorization":"Bearer "+outsiderToken,"X-Moonveil-Actor":"dm-1"}});
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
    const badCursor=await fetch(base+"/api/campaigns/test-campaign/events?after=-1",{headers:memberHeaders});
    assert.equal(badCursor.status,400);
    const replayAsOtherActor=await fetch(base+"/api/campaigns/test-campaign/events",{
      method:"POST",headers:{...headers,"X-Moonveil-Actor":"dm-1"},
      body:JSON.stringify({...payload,eventType:"DIFFERENT_EVENT"})});
    assert.equal(replayAsOtherActor.status,409);
    const page=await fetch(base+"/api/campaigns/test-campaign/events?after=1",{headers:memberHeaders});
    assert.deepEqual((await page.json()).events,[]);
    const read=await fetch(base+"/api/campaigns/test-campaign/events",{headers:memberHeaders});
    assert.equal((await read.json()).events.length,1);
    // Signed actor identity overrides a forged actor header for journal writes.
    const signedWrite=await fetch(base+"/api/campaigns/test-campaign/events",{
      method:"POST",headers:actorHeaders,
      body:JSON.stringify({eventId:"signed-1",expectedRevision:1,eventType:"ACTOR_JOINED",payload:{actor:"dm-1"}})});
    assert.equal(signedWrite.status,201);
    const signedRead=await fetch(base+"/api/campaigns/test-campaign/events",{headers:actorHeaders});
    assert.equal(signedRead.status,200);
    const signedEvents=(await signedRead.json()).events;
    assert.equal(signedEvents[1].actor_id,"dm-1");
    assert.equal(signedEvents[1].event_id,"signed-1");

    // A member of one campaign must not read or write another campaign's journal.
    const otherCreated=await fetch(base+"/api/campaigns",{method:"POST",headers,
      body:JSON.stringify({campaignId:"other-campaign",name:"Separate Game",actorId:"dm-2"})});
    assert.equal(otherCreated.status,201);
    const crossRead=await fetch(base+"/api/campaigns/other-campaign/events",{headers:memberHeaders});
    assert.equal(crossRead.status,403);
    const crossWrite=await fetch(base+"/api/campaigns/other-campaign/events",{method:"POST",headers:memberHeaders,
      body:JSON.stringify({eventId:"cross-1",expectedRevision:0,eventType:"SCENE_STARTED",payload:{scene:"pit"}})});
    assert.equal(crossWrite.status,403);
    const secondHeaders={...headers,"X-Moonveil-Actor":"dm-2"};
    const otherRead=await fetch(base+"/api/campaigns/other-campaign/events",{headers:secondHeaders});
    assert.equal(otherRead.status,200);
    assert.deepEqual((await otherRead.json()).events,[]);
    // Reusing an event ID with changed contents must not silently mutate history.
    const changedRetry=await fetch(base+"/api/campaigns/test-campaign/events",{method:"POST",headers:memberHeaders,
      body:JSON.stringify({...payload,payload:{scene:"different"}})});
    assert.equal(changedRetry.status,409);
    assert.equal((await changedRetry.json()).error,"IDEMPOTENCY_CONFLICT");
    const logout=await fetch(base+"/api/sessions/logout",{method:"POST",headers:actorHeaders,body:"{}"});
    assert.equal(logout.status,200);
    const afterLogout=await fetch(base+"/api/campaigns/test-campaign/events",{headers:actorHeaders});
    assert.equal(afterLogout.status,401);
    const another=await fetch(base+"/api/admin/sessions",{method:"POST",headers,
      body:JSON.stringify({actorId:"dm-1"})});
    const anotherToken=(await another.json()).accessToken;
    const revoked=await fetch(base+"/api/admin/sessions/revoke",{method:"POST",headers,
      body:JSON.stringify({accessToken:anotherToken})});
    assert.equal(revoked.status,200);
    const afterRevoke=await fetch(base+"/api/campaigns/test-campaign/events",{
      headers:{"Authorization":"Bearer "+anotherToken}});
    assert.equal(afterRevoke.status,401);
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
