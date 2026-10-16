"use strict";
const test=require("node:test");const assert=require("node:assert/strict");
const {validatePublication,listUnverifiedSeed,previewHistoricalLink}=require("./gemini-batch1-chronology-review");
test("Nine Gemini seed entries remain unverified",()=>{const r=listUnverifiedSeed();assert.equal(r.length,9);assert.ok(r.every(x=>!validatePublication(x).chronologySortable));});
test("Reject fabricated calendar date",()=>{assert.equal(validatePublication({id:"x",title:"x",publicationYear:1974,publicationDate:"1974-02-30",sourceStatus:"VERIFIED_PRIMARY_SOURCE"}).reason,"INVALID_CALENDAR_DATE");});
test("Do not allow unverified fictional linkage",()=>{assert.equal(previewHistoricalLink({publicationId:"PUB-1974-ODD",calendarId:"CY",fictionalYear:576}).allowed,false);});
