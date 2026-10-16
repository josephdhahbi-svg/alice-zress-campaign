"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const e=require("./looking-glass-artifact-engine");
test("five artifacts and three distinct paths",()=>{
 assert.equal(e.listArtifacts().length,5);
 assert.deepEqual(e.listTriads().map(x=>x.path),["DAMAGE","DEFENSE","UTILITY"]);
});
test("all triads require three matching items",()=>{
 for(const t of e.listTriads()){
  const p=e.previewLoadout(t.required);
  assert.equal(p.valid,true);assert.equal(p.activeTriad.id,t.id);
  assert.equal(p.activationAllowed,false);
 }
});
test("invalid and unmatched loadouts fail safely",()=>{
 assert.equal(e.previewLoadout(["eye_of_the_caterpillar","eye_of_the_caterpillar"]).valid,false);
 assert.equal(e.previewLoadout(e.listArtifacts().map(x=>x.id)).valid,false);
 assert.equal(e.previewLoadout(["eye_of_the_caterpillar","crown_of_the_red_queen","mirror_of_the_white_queen"]).activeTriad,null);
});
