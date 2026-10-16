"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const catalog=require("./divine-shrine-catalog");
test("60 distinct shrines cover all 30 books with nonautomatic blessings",()=>{
 const all=catalog.listShrines();assert.equal(all.length,60);
 assert.equal(new Set(all.map(s=>s.id)).size,60);
 for(let book=1;book<=30;book++)assert.equal(catalog.listShrines({book}).length,2);
 for(const s of all){
  assert.equal(s.blessing.duration,"UNTIL_NEXT_COMPLETED_LONG_REST");
  assert.equal(s.blessing.automaticGrant,false);
  assert.equal(s.timeline,undefined);
  assert.equal(s.existenceAtDate,"DM_REVIEW_REQUIRED");
 }
});
test("no blessing or historical cameo is automatically granted",()=>{
 const preview=catalog.previewBlessing({shrineId:"mv_shrine_001",characterAffinity:99,domainMatch:true});
 assert.equal(preview.eligible,false);
 assert.equal(catalog.previewCameo({cameoId:"qilue_veladorn",book:1,region:"Underdark",drDate:"1492 DR"}).allowed,false);
 assert.equal(catalog.previewCameo({cameoId:"qilue_veladorn",book:1,region:"Avernus"}).reason,"LOCATION_MISMATCH");
});
test("read-only shrine responses are independent",()=>{
 const a=catalog.getShrine("mv_shrine_001");a.deity="TEST";
 assert.notEqual(catalog.getShrine("mv_shrine_001").deity,"TEST");
 assert.throws(()=>catalog.listShrines({book:31}),TypeError);
});
