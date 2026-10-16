"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createElderEyeSceneService}=require("./elder-eye-scene-service");
const {CHOICE_ORDER}=require("../elder-eye/admin/scene-contract");
const scene={id:"scene-1",location_id:"pit-of-ghaunadaur",character_id:"alice-zress",choices:CHOICE_ORDER.map((kind,i)=>({id:"choice-"+i,order:i+1,kind,check:{ability:"Wisdom",skill:"Insight",dc:12},success:"success",failure:"failure",consequence_tags:["clue"]}))};
function setup(){
 const db=new Database(":memory:");migrate(db);
 db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("elder-eye","Elder Eye",new Date().toISOString());
 db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("elder-eye","alice","PLAYER");
 db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("elder-eye","observer","OBSERVER");
 return {db,service:createElderEyeSceneService(db,{scenes:[scene]})};
}
const input={campaignId:"elder-eye",actorId:"alice",eventId:"event-1",expectedRevision:0,sceneId:"scene-1",option:1,roll:12,modifier:0};
test("records a choice in the existing campaign journal",()=>{const {db,service}=setup();const r=service.submit(input);assert.equal(r.status,201);assert.equal(r.result.success,true);assert.equal(db.prepare("SELECT count(*) n FROM vtt_campaign_events").get().n,1);db.close()});
test("idempotent replay never writes twice",()=>{const {db,service}=setup();assert.equal(service.submit(input).status,201);assert.equal(service.submit(input).status,200);assert.equal(db.prepare("SELECT count(*) n FROM vtt_campaign_events").get().n,1);db.close()});
test("rejects changed replay payload",()=>{const {db,service}=setup();service.submit(input);assert.equal(service.submit({...input,modifier:1}).error,"IDEMPOTENCY_CONFLICT");db.close()});
test("rejects stale revisions",()=>{const {db,service}=setup();service.submit(input);assert.equal(service.submit({...input,eventId:"event-2"}).error,"REVISION_CONFLICT");db.close()});
test("rejects observer actions",()=>{const {db,service}=setup();assert.equal(service.submit({...input,actorId:"observer"}).status,403);db.close()});
test("rejects invalid modifiers rather than inventing stats",()=>{const {db,service}=setup();assert.equal(service.submit({...input,modifier:undefined}).status,400);db.close()});
