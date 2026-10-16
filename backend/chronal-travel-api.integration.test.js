"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {startMoonveilServer}=require("../server");
const token="chronal-http-integration-admin-token-long";
test("signed Rabbit Hole travel API: owner isolation, DM authority, replay and no rewards",{timeout:20000},async()=>{
 const instance=startMoonveilServer({port:0,dbPath:":memory:",token,schedule:false});
 const {db,server}=instance;
 try{
  if(!server.listening)await new Promise(resolve=>server.once("listening",resolve));
  const base="http://127.0.0.1:"+server.address().port;
  const admin={Authorization:"Bearer "+token,"Content-Type":"application/json"};
  const request=async(method,url,headers,body)=>{
   const response=await fetch(base+url,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
   const raw=await response.text();
   return {status:response.status,body:raw.startsWith("{")?JSON.parse(raw):raw};
  };
  const post=(url,h,body)=>request("POST",url,h,body),get=(url,h)=>request("GET",url,h);
  assert.equal((await post("/api/campaigns",admin,{campaignId:"alpha",name:"Alpha",actorId:"dm"})).status,201);
  assert.equal((await post("/api/campaigns",admin,{campaignId:"beta",name:"Beta",actorId:"otherdm"})).status,201);
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("alpha","alice");
  db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'PLAYER')").run("alpha","bob");
  db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run("alpha","alice_zress","alice");
  db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run("alpha","bob_hero","bob");
  db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run("beta","alice_zress","otherdm");
  const session=async actorId=>{
   const result=await post("/api/admin/sessions",admin,{actorId});
   assert.equal(result.status,201);
   return {Authorization:"Bearer "+result.body.accessToken,"Content-Type":"application/json"};
  };
  const dm=await session("dm"),alice=await session("alice"),bob=await session("bob"),outsider=await session("outsider");
  const url="/api/campaigns/alpha/characters/alice_zress";
  assert.equal((await get(url+"/location",admin)).status,403);
  assert.equal((await get(url+"/location",bob)).status,403);
  assert.equal((await get(url+"/location",outsider)).status,403);
  assert.equal((await get(url+"/location",alice)).status,200);
  assert.equal((await post(url+"/initialize",alice,{})).status,403);
  assert.equal((await post(url+"/initialize",admin,{})).status,403);
  assert.equal((await post(url+"/initialize",dm,{})).status,201);
  assert.equal((await post(url+"/initialize",dm,{})).status,200);
  assert.equal((await get(url+"/location",alice)).body.location.node_id,"pit_ghaunadaur");
  const travel={travelId:"rabbit1",to:"sigil",arrivalDr:1492,method:"CHRONAL_GATE",evidence:"DM approved historical route and portal key",expectedRevision:0};
  assert.equal((await post(url+"/travel",alice,travel)).status,403);
  assert.equal((await post(url+"/travel",dm,{...travel,arrivalDr:Infinity})).status,400);
  assert.equal((await post(url+"/travel",dm,travel)).status,201);
  assert.equal((await post(url+"/travel",dm,travel)).status,200);
  assert.equal((await post(url+"/travel",dm,{...travel,to:"abyss"})).status,409);
  assert.equal((await post(url+"/travel",dm,{...travel,travelId:"rabbit2"})).status,409);
  const location=(await get(url+"/location",alice)).body.location;
  assert.equal(location.node_id,"sigil");
  assert.equal(location.dr_year,1492);
  assert.equal(location.revision,1);
  assert.equal((await get("/api/campaigns/beta/characters/alice_zress/location",alice)).status,403);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_travel_events").get().n,1);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_artifacts").get().n,0);
 }finally{
  await new Promise(resolve=>{instance.wss.close();server.close(()=>{db.close();resolve();});});
 }
});
