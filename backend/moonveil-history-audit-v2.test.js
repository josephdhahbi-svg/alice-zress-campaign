"use strict";
const test=require("node:test");const assert=require("node:assert/strict");
const {auditBatch,auditRecord,createQueries}=require("./moonveil-history-audit-v2");
test("five submitted records are not a complete archive",()=>{const r=auditBatch();assert.equal(r.received,5);assert.equal(r.complete,false);});
test("reversed AD&D product codes are detected",()=>{const r=auditBatch();assert.equal(r.results.filter(x=>x.issues.includes("PRODUCT_CODE_CONFLICT")).length,2);});
test("unverified sources never pass",()=>{assert.equal(auditRecord({year:1974,sourceStatus:"SOURCE_VERIFICATION_REQUIRED"}).approved,false);});
test("query module requires injected connection",()=>{assert.throws(()=>createQueries(),/INJECTED_DB_REQUIRED/);});
