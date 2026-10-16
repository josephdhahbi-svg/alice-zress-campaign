"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {createAliceExplorationJournal}=require("./alice-exploration-journal");
test("Rabbit Hole journal persists proposals and DM reviews without granting powers",()=>{
 const db=new Database(":memory:");
 try{
  const journal=createAliceExplorationJournal(db);
  const input={campaignId:"alpha",entryId:"entry1",actorId:"alice",roomId:"threshold",choiceNumber:2};
  const first=journal.submit(input);
  assert.equal(first.status,"PENDING");assert.equal(first.duplicate,false);
  assert.equal(journal.submit(input).duplicate,true);
  assert.throws(()=>journal.submit({...input,choiceNumber:3}),/ENTRY_CONFLICT/);
  assert.throws(()=>journal.submit({...input,entryId:"locked",roomId:"return_gate"}),/ROOM_LOCKED/);
  assert.equal(journal.list("alpha").length,1);
  const reviewed=journal.review({campaignId:"alpha",entryId:"entry1",dmActorId:"dm",status:"ACKNOWLEDGED",note:"Narrative recorded, no unlock"});
  assert.equal(reviewed.status,"ACKNOWLEDGED");
  assert.throws(()=>journal.review({campaignId:"alpha",entryId:"entry1",dmActorId:"dm",status:"DECLINED",note:"Again"}),/ALREADY_REVIEWED/);
  assert.equal(db.prepare("SELECT COUNT(*) n FROM vtt_alice_exploration_journal").get().n,1);
 }finally{db.close()}
});
