"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listEpicQuestCandidates,previewEpicQuestCandidate}=require("./epic-quest-candidates");
const {listLichdomRitualVariants,previewLichdomRitualVariant}=require("./lichdom-ritual-variants");
const {listLichdomPaths}=require("./lichdom-eleven-paths");
test("sprint 127 epic quest LEGO grants neither items nor reputation",()=>{
 const quests=listEpicQuestCandidates();assert.equal(quests.length,3);
 assert.ok(quests.every(q=>q.rewardGranted===false&&q.reputationGranted===0));
 for(const q of quests){const p=previewEpicQuestCandidate(q.id);assert.equal(p.allowed,false);assert.equal(p.effect,"NONE");}
 assert.equal(previewEpicQuestCandidate("unknown"),null);
});
test("sprint 128 ritual variants cannot override canonical nine-plus-two ascension paths",()=>{
 const variants=listLichdomRitualVariants();
 assert.equal(variants.length,11);assert.equal(listLichdomPaths().length,11);
 assert.equal(listLichdomPaths().filter(x=>x.category==="TRANSCENDENT").length,2);
 assert.ok(variants.every(v=>!v.ritualAvailable));
 for(let n=1;n<=11;n++){
  const p=previewLichdomRitualVariant(n);
  assert.equal(p.allowed,false);assert.equal(p.phylacteryBound,false);
  assert.equal(p.ascended,false);assert.equal(p.soulShardsConsumed,0);
 }
 assert.equal(previewLichdomRitualVariant(12),null);
});
