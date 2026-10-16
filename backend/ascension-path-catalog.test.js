"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listAscensionPaths,getAscensionPath,assessAscensionReadiness}=require("./ascension-path-catalog");
test("seven proposal paths contain 35 staged quests, 21 spells, 21 items, and two endings each",()=>{
 const paths=listAscensionPaths();
 assert.equal(paths.length,7);
 assert.equal(new Set(paths.map(p=>p.id)).size,7);
 assert.equal(paths.reduce((n,p)=>n+p.quests.length,0),35);
 assert.equal(paths.reduce((n,p)=>n+p.spells.length,0),21);
 assert.equal(paths.reduce((n,p)=>n+p.items.length,0),21);
 for(const path of paths){
  assert.equal(path.endings.length,2);
  assert.equal(path.rewardApproved,false);
  assert.equal(path.ritualApproved,false);
  assert.equal(path.canonStatus,"HOMEBREW_PROPOSAL");
  assert.equal(path.chronology.reviewRequired,true);
  assert.deepEqual(path.quests.map(q=>q.stage),[1,2,3,4,5]);
  assert.equal(assessAscensionReadiness({pathId:path.id,approval:true,verifiedQuestIds:path.quests.map(q=>q.id),verifiedItemIds:path.items.map(i=>i.id)}).eligible,false);
 }
 assert.equal(getAscensionPath("path_web").deity,"Lolth");
 assert.equal(getAscensionPath("unknown"),null);
 assert.equal(assessAscensionReadiness({pathId:"unknown"}).reason,"UNKNOWN_PATH");
 assert.throws(()=>paths.push("evil"),TypeError);
 assert.throws(()=>paths[0].quests.push("fake"),TypeError);
});
