"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {auditLocalVisualAssets}=require("./visual-asset-audit");
test("visual UI files exist and have stable SHA-256 digests",()=>{
 const first=auditLocalVisualAssets(),second=auditLocalVisualAssets();
 assert.equal(first.length,4);
 assert.deepEqual(first,second);
 for(const item of first){
  assert.equal(item.exists,true,item.name);
  assert.ok(item.bytes>100);
  assert.match(item.sha256,/^[a-f0-9]{64}$/);
 }
});
