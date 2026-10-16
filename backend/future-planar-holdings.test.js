"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listFuturePlanarHoldings,previewFuturePlanarHolding}=require("./future-planar-holdings");
test("future demiplanes stay lore-only and cannot resurrect Alice",()=>{
 const holdings=listFuturePlanarHoldings();
 assert.equal(holdings.length,4);
 assert.ok(holdings.every(x=>!x.accessGranted&&!x.mutationAllowed&&x.canonStatus==="MOONVEIL_HOMEBREW"));
 const alice=holdings.find(x=>x.id==="alice_pit_sanctuary");
 assert.equal(alice.status,"FUTURE_LOCKED");
 assert.match(alice.anchor,/Pit of Ghaunadaur/);
 for(const state of ["QUIESCENT","PULSING","HUNGRY","RESURRECTION","ASCENSION"]){
  const p=previewFuturePlanarHolding(alice.id,state);
  assert.equal(p.allowed,false);assert.equal(p.resurrection,false);
  assert.equal(p.mutationPoints,0);assert.equal(p.effect,"NONE");
 }
 assert.throws(()=>previewFuturePlanarHolding(alice.id,"AUTO_RESURRECT"),TypeError);
 assert.equal(previewFuturePlanarHolding("nonexistent"),null);
});
