"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const tracker=require("./weave-chronology-tracker");
test("Mystryl, Mystra, Midnight eras have explicit boundaries",()=>{
 assert.equal(tracker.eraAtDR(-340).id,"ERA_1_MYSTRYL");
 assert.equal(tracker.eraAtDR(-339).id,"ERA_2_MYSTRA");
 assert.equal(tracker.eraAtDR(1357).id,"ERA_2_MYSTRA");
 assert.equal(tracker.eraAtDR(1358).id,"ERA_3_MIDNIGHT_MYSTRA");
 assert.equal(tracker.eraAtDR(null),null);
});
test("all 30 books have three era windows and seven traversal slots",()=>{
 const t=tracker.getTracker();assert.equal(t.books,30);
 assert.equal(t.eraSlots,90);assert.equal(t.traversalSlots,210);
 for(let book=1;book<=30;book++){
  const b=tracker.getBook(book);assert.equal(b.eraWindows.length,3);
  assert.equal(b.traversals.length,7);
  assert.equal(b.mainlineDR,"UNRESOLVED");
 }
});
test("unverified historical placement and deity presence fail closed",()=>{
 assert.equal(tracker.previewPlacement({book:1,drYear:1492,plane:"Material Plane"}).allowed,false);
 assert.equal(tracker.previewPlacement({book:1,drYear:null,plane:"Material Plane"}).reason,"DATE_REQUIRED");
 assert.equal(tracker.divineStatusAtDR(1400).verified,false);
 assert.equal(tracker.divineStatusAtDR(1400).reason,"SPELLPLAGUE_RESTORATION_TRANSITION_REQUIRES_EXACT_SOURCE");
});
