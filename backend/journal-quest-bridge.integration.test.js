"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="journal-bridge-integration-admin-secret";
test("signed journal attestation requires DM, acknowledgement, ownership and approved objective",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const req=async(method,path,bearer,body)=>{
   const response=await fetch(base+path,{method,headers:bearer?{Authorization:"Bearer "+bearer,"Content-Type":"application/json"}:{},body:body?JSON.stringify(body):undefined});
   return {status:response.status,data:await response.json()};
  };
  assert.equal((await req("POST","/api/campaigns",token,{campaignId:"alpha",name:"Alpha",actorId:"dm"})).status,201);
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("alpha","alice");
  db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run("alpha","alice","alice");
  const session=async actor=>{
   const result=await req("POST","/api/admin/sessions",token,{actorId:actor});
   assert.equal(result.status,201);return result.data.accessToken;
  };
  const dm=await session("dm"),alice=await session("alice"),outsider=await session("outsider");
  const root="/api/campaigns/alpha";
  const journal=root+"/world/alice-demiplane/journal";
  const attest=root+"/quests/objectives/attest-journal";
  const body={entryId:"entry1",characterId:"alice",questId:"q1",objectiveId:"discover",eventId:"proof1"};
  assert.equal((await req("POST",journal,alice,{entryId:"entry1",roomId:"threshold",choiceNumber:1})).status,201);
  assert.equal((await req("POST",root+"/quests/catalog",dm,{questId:"q1",requiredObjectiveIds:["discover"]})).status,201);
  assert.equal((await req("POST",root+"/quests/catalog/q1/approve",dm,{})).status,201);
  assert.equal((await req("POST",attest,alice,body)).status,403);
  assert.equal((await req("POST",attest,outsider,body)).status,403);
  assert.equal((await req("POST",attest,dm,body)).status,409);
  assert.equal((await req("POST",journal+"/entry1/review",dm,{status:"ACKNOWLEDGED",note:"Validated narrative discovery"})).status,200);
  const first=await req("POST",attest,dm,body);
  assert.equal(first.status,201);
  assert.equal(first.data.gameMutation,false);
  assert.deepEqual(first.data.awardedArtifacts,[]);
  assert.equal((await req("POST",attest,dm,body)).status,200);
  assert.equal((await req("POST",attest,dm,{...body,eventId:"proof2"})).status,409);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_campaign_events").get().n,1);
  const verified=await req("POST",root+"/quests/objectives/verify",alice,{characterId:"alice",questId:"q1",objectiveId:"discover",eventId:"proof1"});
  assert.equal(verified.status,201);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_artifacts").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_quest_completions").get().n,0);
 }finally{await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve()})})}
});
