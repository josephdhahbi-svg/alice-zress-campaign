"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="alice-atlas-local-integration-secret-long";
test("local Alice atlas serves only allowlisted assets and signed room API stays private",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const req=async(method,url,headers,body)=>{
   const response=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
   const raw=await response.text();return {status:response.status,headers:response.headers,body:raw.startsWith("{")?JSON.parse(raw):raw};
  };
  const page=await req("GET","/play/alice");
  assert.equal(page.status,200);assert.match(page.headers.get("content-type"),/text\/html/);
  assert.match(page.body,/Rabbit Hole Room Atlas/);
  assert.match(page.body,/id="submit-choice"/);
  assert.match(page.body,/id="journal-entries"/);
  assert.match(page.headers.get("content-security-policy"),/frame-ancestors 'none'/);
  assert.match(page.body,/src="\.\/alice-room-atlas\.js"/);
  assert.doesNotMatch(page.body,/<script>/);
  assert.doesNotMatch(page.headers.get("content-security-policy"),/unsafe-inline/);
  const script=await req("GET","/play/alice-room-atlas.js");
  assert.equal(script.status,200);
  assert.match(script.headers.get("content-type"),/javascript/);
  assert.match(script.body,/DM adjudication|read-only adjudication/i);
  assert.match(script.body,/refreshJournal/);
  assert.match(script.body,/entryId,roomId:active.id,choiceNumber:selectedChoice/);
  const css=await req("GET","/play/moonveil-theme.css");
  assert.equal(css.status,200);assert.match(css.body,/--mv-hero:#478DFF/);
  assert.equal((await req("GET","/play/not-allowed")).status,401);
  const api="/api/campaigns/alpha/world/alice-demiplane/rooms";
  assert.equal((await req("GET",api)).status,401);
  assert.equal((await req("POST","/api/campaigns",admin,{campaignId:"alpha",name:"Alpha",actorId:"dm"})).status,201);
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("alpha","alice");
  const session=async actorId=>{
   const res=await req("POST","/api/admin/sessions",admin,{actorId});
   assert.equal(res.status,201);return {Authorization:"Bearer "+res.body.accessToken,"Content-Type":"application/json"};
  };
  const alice=await session("alice"),outsider=await session("outsider");
  assert.equal((await req("GET",api,outsider)).status,403);
  const atlas=await req("GET",api,alice);
  assert.equal(atlas.status,200);assert.equal(atlas.body.rooms.length,5);
  const preview=await req("POST",api+"/threshold/preview",alice,{choiceNumber:1});
  assert.equal(preview.status,200);assert.equal(preview.body.allowed,false);
  assert.equal(preview.body.effect,"NONE");
  assert.equal((await req("POST",api+"/threshold/preview",alice,{choiceNumber:6})).status,400);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_campaign_events").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_character_travel_events").get().n,0);
 }finally{
  await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve();});});
 }
});
