"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listPlanarMutationBlooms,previewPlanarMutation}=require("./planar-mutation-engine");
test("three versioned homebrew mutation ecologies link to real planar weather",()=>{
 const blooms=listPlanarMutationBlooms();
 assert.equal(blooms.length,3);
 assert.ok(blooms.every(x=>x.mode==="PREVIEW_ONLY"&&x.version==="v1"&&x.canonStatus==="MOONVEIL_HOMEBREW"));
 assert.notEqual(blooms[0],listPlanarMutationBlooms()[0]);
});
test("bloom forecasts never mutate Alice or grant progression",()=>{
 const input={bloomId:"bloom_elder_eye",unitId:"alice",stage:"BLOOMING",rounds:5};
 const before=structuredClone(input);
 const result=previewPlanarMutation(input);
 assert.deepEqual(input,before);
 assert.equal(result.possibleQuestHook,"INVESTIGATE_BLOOM");
 assert.equal(result.weatherHazardId,"haz_underdark_slime_rain");
 assert.equal(result.requiresDmAdjudication,true);
 assert.equal(result.applied,false);
 assert.equal(result.mutationPoints,0);
 assert.deepEqual(result.characterChanges,[]);
 assert.deepEqual(result.conditionsApplied,[]);
 assert.deepEqual(result.eventsCreated,[]);
 assert.deepEqual(result.rewards,[]);
 assert.equal(result.travelUnlocked,false);
 assert.equal(result.timelineChanged,false);
 assert.equal(result.effect,"NONE");
 assert.equal(previewPlanarMutation({...input,bloomId:"unknown"}),null);
});
test("cross-plane weather, malformed IDs and invalid stages fail closed",()=>{
 const valid={bloomId:"bloom_elder_eye",unitId:"alice"};
 for(const patch of [{weatherHazardId:"haz_astral_ion_storm"},{stage:"ASCENDED"},{unitId:"alice;DROP"},{rounds:0},{rounds:21},{rounds:1.5}])
  assert.throws(()=>previewPlanarMutation({...valid,...patch}),TypeError);
});
