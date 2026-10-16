"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createQuestEvidenceEngine}=require("./quest-evidence-engine");
test("quest transition state machine records blocked active failed edges and rejects invalid moves",()=>{
 const db=new Database(":memory:");
 try{
  db.pragma("foreign_keys=ON");migrate(db);
  db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("c","C","now");
  for(const [actor,role] of [["dm","DM"],["alice","PLAYER"]])
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c",actor,role);
  db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run("c","alice","alice");
  const q=createQuestEvidenceEngine(db);
  q.registerQuest({campaignId:"c",questId:"q",actorId:"dm",requiredObjectiveIds:["save"]});
  q.approveQuest({campaignId:"c",questId:"q",actorId:"dm"});
  const a={campaignId:"c",characterId:"alice",questId:"q",actorId:"dm"};
  assert.throws(()=>q.transitionQuest({...a,toStatus:"FAILED",reason:"Cannot fail before start",expectedRevision:0}),/INVALID_STATE_EDGE/);
  assert.throws(()=>q.transitionQuest({...a,actorId:"alice",toStatus:"ACTIVE",reason:"Player forgery",expectedRevision:0}),/DM_REQUIRED/);
  for(const [toStatus,expectedRevision] of [["BLOCKED",0],["ACTIVE",1],["FAILED",2],["ACTIVE",3]]){
   assert.equal(q.transitionQuest({...a,toStatus,expectedRevision,reason:"Verified DM transition"}).revision,expectedRevision+1);
  }
  assert.deepEqual(db.prepare("SELECT to_status FROM vtt_quest_state_audit ORDER BY revision").all().map(x=>x.to_status),["BLOCKED","ACTIVE","FAILED","ACTIVE"]);
  assert.equal(db.prepare("SELECT revision FROM vtt_quest_states").get().revision,4);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_quest_completions").get().n,0);
 }finally{db.close();}
});
