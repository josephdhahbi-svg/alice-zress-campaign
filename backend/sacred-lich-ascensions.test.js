"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listSacredAscensions,getSacredAscension,evaluateSacredAscension}=require("./sacred-lich-ascensions");
test("three distinct sacrifice paths are proposals and never grant transformations",()=>{
 const all=listSacredAscensions();
 assert.equal(all.length,3);
 assert.deepEqual(all.map(x=>x.sacrifice),["PROTECTION","FREEDOM","KNOWLEDGE"]);
 assert.ok(all.every(x=>x.approved===false&&x.canonStatus==="HOMEBREW_PROPOSAL"&&x.objectives.length===5));
 assert.deepEqual(getSacredAscension("alice_zress").path,["ELDRITCH_LICH","ARCH_ELDRITCH_LICH","CHOSEN","CELESTIAL_ASPECT"]);
 assert.equal(evaluateSacredAscension("alice_zress",{level:1}).reason,"LEVEL_GATE_UNMET");
 assert.equal(evaluateSacredAscension("alice_zress",{level:17,dmApproved:true}).reason,"DM_AND_DIVINE_REVIEW_REQUIRED");
 const reviewed=evaluateSacredAscension("alice_zress",{level:17,dmApproved:true,divineReviewApproved:true,verifiedObjectives:[true,true,true,true,true]});
 assert.equal(reviewed.allowed,false);
 assert.equal(reviewed.reviewReady,true);
 assert.equal(reviewed.reason,"PROPOSAL_ONLY_NO_TRANSFORMATION_ENGINE");
 assert.equal(evaluateSacredAscension("unknown",{level:30}).reason,"UNKNOWN_ASCENSION");
 all[0].objectives[0]="changed";
 assert.notEqual(getSacredAscension("moonveil_witch").objectives[0],"changed");
});
