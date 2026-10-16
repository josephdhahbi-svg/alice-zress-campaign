"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listSacredAscensions,getSacredAscension,evaluateSacredAscension}=require("./sacred-lich-ascensions");
test("three distinct sacrifice paths are proposals and never grant transformations",()=>{
 const all=listSacredAscensions();
 assert.equal(all.length,3);
 assert.deepEqual(all.map(x=>x.sacrifice),["FREEDOM","PROTECTION","KNOWLEDGE"]);
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

test("Alice leads the three ascensions and parasite origin is narrative, not an automatic lich trigger",()=>{
 const paths=listSacredAscensions();
 assert.deepEqual(paths.map(x=>x.id),["alice_zress","moonveil_witch","starweave_necromancer"]);
 assert.equal(paths[0].parasiteOrigin,"GHAUNADAUR_TOUCH_AT_RABBIT_HOLE_ARRIVAL");
 assert.equal(paths[0].parasiteStatus,"NARRATIVE_ORIGIN_UNRESOLVED_MECHANICS");
 assert.equal(evaluateSacredAscension("alice_zress",{level:1,parasitePresent:true}).allowed,false);
 assert.ok(paths.every(x=>x.path.includes("CELESTIAL_ASPECT")));
});

test("Alice's Far Realm origin and Convergence demiplane remain narrative, not automatic travel access",()=>{
 const alice=getSacredAscension("alice_zress");
 assert.equal(alice.eldritchSourcePlane,"FAR_REALM");
 assert.equal(alice.demiplane,"RABBIT_HOLE");
 assert.equal(alice.demiplaneEntrance,"PIT_OF_GHAUNADAUR_UNDERDARK");
 assert.equal(alice.demiplaneIdentity,"THE_HOLE_ITSELF");
 assert.ok(alice.linkedPlanes.includes("SHADOWFELL"));
 assert.equal(evaluateSacredAscension("alice_zress",{level:30,dmApproved:true,divineReviewApproved:true,verifiedObjectives:[true,true,true,true,true]}).allowed,false);
});
