"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listTaverns,getTavern}=require("./omniversal-tavern-catalog");
test("100 unique taverns cover every one of 30 books",()=>{
 const all=listTaverns();assert.equal(all.total,100);
 assert.equal(new Set(all.taverns.map(t=>t.id)).size,100);
 for(let book=1;book<=30;book++)assert.ok(listTaverns({book}).total>=3);
});
test("all taverns connect to quest chains without automatic rest or rewards",()=>{
 for(const t of listTaverns().taverns){
  assert.match(t.quests.regionalQuestId,/^mv_side_\d{3}$/);
  assert.match(t.quests.wave2QuestId,/^mv_side_\d{3}$/);
  assert.match(t.quests.wave3QuestId,/^mv_side_\d{3}$/);
  assert.equal(t.restPolicy.noAutomaticTimeAdvance,true);
  assert.equal(t.persistentState,"DRAFT_NOT_SPAWNED");
  assert.equal(t.timeline.existenceAtDate,"REVIEW_REQUIRED");
 }
});
test("returned taverns are immutable relative to catalog",()=>{
 const t=getTavern("mv_tavern_001");t.name="Changed";
 assert.notEqual(getTavern("mv_tavern_001").name,"Changed");
 assert.equal(getTavern("unknown"),null);
 assert.throws(()=>listTaverns({book:31}),TypeError);
});
