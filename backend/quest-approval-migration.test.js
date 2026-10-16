"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {migrate,MIGRATIONS}=require("./migrations");
const {createQuestEvidenceEngine}=require("./quest-evidence-engine");
test("versioned quest approval schema survives migration replay and denies unapproved objectives",()=>{
 const db=new Database(":memory:");
 try{
  db.pragma("foreign_keys=ON");migrate(db);
  db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("c","C","now");
  for(const [actor,role] of [["dm","DM"],["alice","PLAYER"]])
   db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run("c",actor,role);
  db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run("c","alice","alice");
  const engine=createQuestEvidenceEngine(db);
  assert.equal(engine.registerQuest({campaignId:"c",questId:"q",actorId:"dm",requiredObjectiveIds:["rescue"]}).duplicate,false);
  assert.throws(()=>engine.verifyObjective({campaignId:"c",characterId:"alice",actorId:"alice",questId:"q",objectiveId:"rescue",eventId:"p"}),/QUEST_NOT_APPROVED/);
  assert.equal(engine.approveQuest({campaignId:"c",questId:"q",actorId:"dm"}).duplicate,false);
  migrate(db);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_schema_migrations").get().n,MIGRATIONS.length);
  assert.deepEqual(db.prepare("SELECT event_type FROM vtt_quest_definition_audit ORDER BY revision").all().map(x=>x.event_type),["REGISTERED","APPROVED"]);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_quest_approvals").get().n,1);
  assert.throws(()=>engine.registerQuest({campaignId:"c",questId:"q",actorId:"dm",requiredObjectiveIds:["different"]}),/IMMUTABLE/);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_quest_definition_audit").get().n,2);
 }finally{db.close();}
});
