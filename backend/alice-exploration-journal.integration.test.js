"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="alice-journal-test-admin-token-long-enough";
test("signed exploration journal enforces campaign membership and DM review",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const req=async(method,path,bearer,body)=>{
   const res=await fetch(base+path,{method,headers:bearer?{Authorization:"Bearer "+bearer,"Content-Type":"application/json"}:{},body:body?JSON.stringify(body):undefined});
   const raw=await res.text();return {status:res.status,data:raw.startsWith("{")?JSON.parse(raw):raw};
  };
  assert.equal((await req("POST","/api/campaigns",token,{campaignId:"alpha",name:"Alpha",actorId:"dm"})).status,201);
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("alpha","alice");
  const session=async actor=>{const x=await req("POST","/api/admin/sessions",token,{actorId:actor});assert.equal(x.status,201);return x.data.accessToken};
  const alice=await session("alice"),outsider=await session("outsider"),dm=await session("dm");
  const url="/api/campaigns/alpha/world/alice-demiplane/journal";
  assert.equal((await req("GET",url,null)).status,401);
  assert.equal((await req("GET",url,outsider)).status,403);
  const submitted=await req("POST",url,alice,{entryId:"e1",roomId:"threshold",choiceNumber:1});
  assert.equal(submitted.status,201);assert.equal(submitted.data.entry.status,"PENDING");
  assert.equal((await req("POST",url,alice,{entryId:"e2",roomId:"return_gate",choiceNumber:1})).status,409);
  assert.equal((await req("POST",url+"/e1/review",alice,{status:"ACKNOWLEDGED",note:"ok"})).status,403);
  assert.equal((await req("POST",url+"/e1/review",dm,{status:"ACKNOWLEDGED",note:"Story only"})).status,200);
  const entries=await req("GET",url,alice);assert.equal(entries.data.entries.length,1);
  assert.equal(entries.data.entries[0].status,"ACKNOWLEDGED");
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_travel_events").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_campaign_events").get().n,0);
 }finally{await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve()})})}
});
