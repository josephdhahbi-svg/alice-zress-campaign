"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {getAliceDemiplane,previewAliceDemiplaneAccess}=require("./alice-demiplane-catalog");
test("Rabbit Hole is the demiplane at the physical Pit of Ghaunadaur",()=>{
 const d=getAliceDemiplane();
 assert.equal(d.kind,"PERSONAL_ELDRITCH_DEMIPLANE");
 assert.equal(d.identity,"THE_HOLE_ITSELF");
 assert.equal(d.entranceNode,"pit_ghaunadaur");
 assert.equal(d.entranceRegion,"UNDERDARK");
 assert.equal(d.eldritchInfluence,"FAR_REALM");
 assert.equal(d.ascension,"NOT_EARNED");
});
test("demiplane access previews never grant travel even with user supplied approval",()=>{
 assert.equal(previewAliceDemiplaneAccess({currentNode:"sigil",approvedEvidence:true}).reason,"NOT_AT_PHYSICAL_ENTRANCE");
 assert.equal(previewAliceDemiplaneAccess({currentNode:"pit_ghaunadaur"}).reason,"DM_PORTAL_EVIDENCE_REQUIRED");
 assert.equal(previewAliceDemiplaneAccess({currentNode:"pit_ghaunadaur",approvedEvidence:true}).reason,"AUTHORITATIVE_TRAVEL_ENGINE_REQUIRED");
 assert.equal(previewAliceDemiplaneAccess({currentNode:"pit_ghaunadaur",approvedEvidence:true}).allowed,false);
 const d=getAliceDemiplane();d.connections.push("fake");
 assert.equal(getAliceDemiplane().connections.includes("fake"),false);
});
