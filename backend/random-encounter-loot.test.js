"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {previewRandomEncounter}=require("./random-encounter-loot");
const {listAtlasMaps}=require("./chronological-map-atlas");
test("encounter proposals are deterministic and never award loot",()=>{
 for(const map of listAtlasMaps()){
  const args={mapId:map.id,visitSequence:2,seed:"quest-return",level:5,era:"REVISIT"};
  const a=previewRandomEncounter(args);
  assert.deepEqual(a,previewRandomEncounter(args));
  assert.equal(a.combatStarted,false);
  assert.equal(a.lootGranted,false);
  assert.equal(a.inventoryChanged,false);
  assert.equal(a.xpGranted,0);
  if(a.encounter){
   assert.equal(a.encounter.requiresDmApproval,true);
   assert.ok(a.encounter.lootCandidates.length>=2);
  }
 }
});
test("mimics and ordinary monsters are both possible on repeat visits",()=>{
 const kinds=new Set();
 for(let i=1;i<=100;i++){
  const result=previewRandomEncounter({mapId:"pit_ghaunadaur",visitSequence:i});
  if(result.encounter)kinds.add(result.encounter.kind);
 }
 assert.ok(kinds.has("MIMIC"));
 assert.ok(kinds.has("MONSTER"));
 assert.throws(()=>previewRandomEncounter({mapId:"unknown"}),TypeError);
 assert.throws(()=>previewRandomEncounter({mapId:"pit_ghaunadaur",level:100}),TypeError);
});
