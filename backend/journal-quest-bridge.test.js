"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createAliceExplorationJournal}=require("./alice-exploration-journal");
const {createQuestEvidenceEngine}=require("./quest-evidence-engine");
const {createJournalQuestBridge}=require("./journal-quest-bridge");
test("DM attestation links acknowledged owned journal evidence atomically, with replay and isolation",()=>{
 const db=new Database(":memory:");
 try{
  db.pragma("foreign_keys=ON");migrate(db);
  for(const campaign of ["a","b"]){
   db.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run(campaign,campaign,"now");
   for(const [actor,role] of [["dm","DM"],["alice","PLAYER"],["other","PLAYER"]])
    db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run(campaign,actor,role);
   db.prepare("INSERT INTO vtt_characters VALUES(?,?,?)").run(campaign,"alice","alice");
  }
  const journal=createAliceExplorationJournal(db),quest=createQuestEvidenceEngine(db),bridge=createJournalQuestBridge(db);
  journal.submit({campaignId:"a",entryId:"e1",actorId:"alice",roomId:"threshold",choiceNumber:1});
  quest.registerQuest({campaignId:"a",questId:"q1",actorId:"dm",requiredObjectiveIds:["discover"]});
  quest.approveQuest({campaignId:"a",questId:"q1",actorId:"dm"});
  const args={campaignId:"a",entryId:"e1",characterId:"alice",questId:"q1",objectiveId:"discover",eventId:"proof1",dmActorId:"dm"};
  assert.throws(()=>bridge.attest(args),/ACKNOWLEDGED_ENTRY_REQUIRED/);
  journal.review({campaignId:"a",entryId:"e1",dmActorId:"dm",status:"ACKNOWLEDGED",note:"Investigated"});
  assert.throws(()=>bridge.attest({...args,dmActorId:"other"}),/DM_REQUIRED/);
  assert.throws(()=>bridge.attest({...args,campaignId:"b"}),/ACKNOWLEDGED_ENTRY_REQUIRED/);
  assert.throws(()=>bridge.attest({...args,objectiveId:"unapproved"}),/APPROVED_OBJECTIVE_REQUIRED/);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_campaign_events").get().n,0);
  const result=bridge.attest(args);
  assert.equal(result.duplicate,false);
  assert.equal(bridge.attest(args).duplicate,true);
  assert.throws(()=>bridge.attest({...args,eventId:"proof2"}),/LINK_CONFLICT/);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_campaign_events").get().n,1);
  assert.equal(quest.verifyObjective({campaignId:"a",characterId:"alice",questId:"q1",objectiveId:"discover",eventId:"proof1",actorId:"alice"}).duplicate,false);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_character_artifacts").get().n,0);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_quest_completions").get().n,0);
 }finally{db.close()}
});
