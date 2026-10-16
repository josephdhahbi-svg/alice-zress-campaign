"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {simulateTick}=require("./autonomous-world-director");
const input={campaignId:"demo",book:1,traversal:1,tickKey:"day1-watch1"};
test("world agent proposals are deterministic and never auto-applied",()=>{
 const a=simulateTick(input),b=simulateTick(input);
 assert.deepEqual(a,b);assert.equal(a.appliedCount,0);
 assert.ok(a.proposals.length>=5);
 assert.ok(a.proposals.some(x=>x.kind==="TAVERN"));
 assert.ok(a.proposals.some(x=>x.kind==="SHRINE"));
 for(const p of a.proposals){assert.equal(p.applied,false);assert.equal(p.requiresDmApproval,true);assert.ok(p.canonCheck)}
});
test("all 30 books produce location-specific world activity",()=>{
 for(let book=1;book<=30;book++){
  const result=simulateTick({...input,book});
  assert.equal(result.book,book);
  assert.ok(result.proposals.length>=5);
 }
});
test("bad tick keys and invalid chronology fail closed",()=>{
 assert.throws(()=>simulateTick({...input,book:31}),TypeError);
 assert.throws(()=>simulateTick({...input,traversal:8}),TypeError);
 assert.throws(()=>simulateTick({...input,tickKey:"invalid key"}),TypeError);
 assert.throws(()=>simulateTick({...input,drYear:"1492"}),TypeError);
});
