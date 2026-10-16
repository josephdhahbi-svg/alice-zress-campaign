"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createQuestEvidenceEngine}=require("./quest-evidence-engine");
test("quest evidence requires authorized journal proof and DM completion approval; no unearned artifacts",()=>{
 const db=new Database(":memory:");
 try{
  db.pragma("foreign_keys=ON");migrate(db);
  for(const campaign of ["a","b"]){
   db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run(campaign,campaign,"now");
   for(const [actor,role] of [["dm","DM"],["alice","PLAYER"],["other","PLAYER"]])
    db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run(campaign,actor,role);
   db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run(campaign,"alice","alice");
  }
  const append=(campaign,eventId,actor,eventType,payload)=>{
   const revision=db.prepare("SELECT COALESCE(MAX(revision),0)+1 AS n FROM vtt_campaign_events WHERE campaign_id=?").get(campaign).n;
   db.prepare("INSERT INTO vtt_campaign_events VALUES(?,?,?,?,?,?,?)").run(campaign,revision,eventId,actor,eventType,JSON.stringify(payload),"now");
  };
  const q=createQuestEvidenceEngine(db);
  q.registerQuest({campaignId:"a",questId:"Q1",actorId:"dm",requiredObjectiveIds:["rescue","seal"]});
  assert.equal(q.registerQuest({campaignId:"a",questId:"Q1",actorId:"dm",requiredObjectiveIds:["seal","rescue"]}).duplicate,true);
  assert.throws(()=>q.registerQuest({campaignId:"a",questId:"Q1",actorId:"dm",requiredObjectiveIds:["rescue"]}),/IMMUTABLE/);
  const args={campaignId:"a",characterId:"alice",actorId:"alice",questId:"Q1",objectiveId:"rescue",eventId:"proof"};
  assert.throws(()=>q.verifyObjective(args),/EVIDENCE_REQUIRED/);
  append("b","proof","dm","QUEST_OBJECTIVE_VERIFIED",{characterId:"alice",questId:"Q1",objectiveId:"rescue"});
  assert.throws(()=>q.verifyObjective(args),/EVIDENCE_REQUIRED/);
  append("a","proof","dm","QUEST_OBJECTIVE_VERIFIED",{characterId:"alice",questId:"Q1",objectiveId:"rescue"});
  assert.throws(()=>q.verifyObjective({...args,actorId:"other"}),/NOT_AUTHORIZED/);
  assert.equal(q.verifyObjective(args).duplicate,false);
  assert.equal(q.verifyObjective(args).duplicate,true);
  assert.throws(()=>q.verifyObjective({...args,eventId:"different"}),/OBJECTIVE_CONFLICT/);
  const done={campaignId:"a",characterId:"alice",actorId:"alice",questId:"Q1",completionEventId:"approved",requiredObjectiveIds:["rescue","seal"]};
  append("a","approved","dm","QUEST_COMPLETION_APPROVED",{characterId:"alice",questId:"Q1",requiredObjectiveIds:["rescue","seal"]});
  assert.throws(()=>q.completeQuest(done),/OBJECTIVES_UNVERIFIED/);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_quest_completions").get().n,0);
  append("a","seal-proof","dm","QUEST_OBJECTIVE_VERIFIED",{characterId:"alice",questId:"Q1",objectiveId:"seal"});
  q.verifyObjective({...args,objectiveId:"seal",eventId:"seal-proof"});
  assert.throws(()=>q.completeQuest({...done,requiredObjectiveIds:["rescue"]}),/OBJECTIVE_SET_MISMATCH/);
  const result=q.completeQuest(done);
  assert.deepEqual(result,{duplicate:false,awardedArtifacts:[]});
  assert.equal(q.completeQuest(done).duplicate,true);
  assert.throws(()=>q.completeQuest({...done,completionEventId:"different"}),/COMPLETION_CONFLICT/);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_character_artifacts").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM vtt_quest_completions WHERE campaign_id='b'").get().n,0);
 }finally{db.close();}
});
