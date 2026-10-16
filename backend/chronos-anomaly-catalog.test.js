"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listChronosAnomalies,previewChronosStabilization}=require("./chronos-anomaly-catalog");
test("Chronos catalogs four proposed anomalies without resolving history",()=>{
 const a=listChronosAnomalies();
 assert.equal(a.length,4);
 assert.deepEqual(a.map(x=>x.severity),[8,9,6,5]);
 assert.ok(a.every(x=>x.canonStatus==="HOMEBREW_PROPOSAL"&&!x.timelineMutated));
});
test("Chronos previews are deterministic and never mutate timeline",()=>{
 for(const anomaly of listChronosAnomalies()){
  const p=previewChronosStabilization({anomalyId:anomaly.id,characterId:"alice_zress",chronoBonus:5,d20Roll:12});
  assert.equal(p.targetDC,10+anomaly.severity);
  assert.equal(p.totalCheck,17);
  assert.equal(p.checkWouldSucceed,17>=p.targetDC);
  assert.equal(p.applied,false);assert.equal(p.allowed,false);
  assert.equal(p.timelineMutated,false);assert.equal(p.stabilizerOwnershipVerified,false);
  assert.deepEqual(p.rewards,[]);
 }
 assert.equal(previewChronosStabilization({anomalyId:"missing",characterId:"alice_zress"}),null);
 for(const bad of [{anomalyId:"anomaly_spellplague_fracture",characterId:"alice_zress",d20Roll:21},{anomalyId:"anomaly_spellplague_fracture",characterId:"alice_zress",chronoBonus:Infinity},{anomalyId:"anomaly_spellplague_fracture",characterId:"bad id"}]){
  assert.throws(()=>previewChronosStabilization(bad),TypeError);
 }
});
