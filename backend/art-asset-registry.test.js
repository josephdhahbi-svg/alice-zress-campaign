"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {validateAssetRecord,auditAssetRegistry}=require("./art-asset-registry");
const concept={id:"ART-UI-005",title:"Alice dashboard",source:"ChatGPT generated concept",status:"INTAKE"};
test("intake concepts are valid records but never claim integration",()=>{
 assert.deepEqual(validateAssetRecord(concept),[]);
 assert.deepEqual(auditAssetRegistry([concept]).errors,[]);
});
test("verified art requires exact repo path, approval, digest and render evidence",()=>{
 const bad={...concept,status:"VERIFIED",approved:false};
 assert.deepEqual(validateAssetRecord(bad).sort(),["MISSING_SAFE_REPO_PATH","MISSING_VERIFICATION_EVIDENCE","NOT_APPROVED"].sort());
 const good={...concept,status:"VERIFIED",approved:true,repoPath:"assets/art/alice.png",sha256:"a".repeat(64),renderEvidence:"CI screenshot #12"};
 assert.deepEqual(validateAssetRecord(good),[]);
 assert.ok(validateAssetRecord({...good,repoPath:"assets/../secrets"}).includes("MISSING_SAFE_REPO_PATH"));
});
test("duplicate asset identifiers are rejected",()=>{
 const result=auditAssetRegistry([concept,{...concept,title:"duplicate"}]);
 assert.equal(result.valid,false);
 assert.deepEqual(result.errors[0].issues,["DUPLICATE_ID"]);
});
