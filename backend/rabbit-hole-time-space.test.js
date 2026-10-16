"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {planTimeSpaceJourney,listTimeSpaceEras,listTravelMethods}=require("./rabbit-hole-time-space");
test("Rabbit Hole time-space travel planning spans eras and planes but never moves characters",()=>{
 assert.ok(listTimeSpaceEras().length>=5);
 assert.ok(listTravelMethods().includes("CHRONAL_GATE"));
 const trip=planTimeSpaceJourney({from:"pit_ghaunadaur",to:"sigil",departureDr:1492,arrivalDr:-1000,method:"CHRONAL_GATE",portalEvidence:"unverified-key"});
 assert.equal(trip.allowed,false);
 assert.equal(trip.preview.crossEra,true);
 assert.equal(trip.preview.crossPlane,true);
 assert.equal(trip.preview.requiresApproval,true);
 assert.equal(trip.sideEffects,"NONE");
 assert.equal(planTimeSpaceJourney({to:"sigil",arrivalDr:Infinity}).reason,"INVALID_DR_DATE");
 assert.equal(planTimeSpaceJourney({to:"sigil",arrivalDr:1.5}).reason,"INVALID_DR_DATE");
 assert.equal(planTimeSpaceJourney({to:"sigil",method:"INSTANT_TELEPORT"}).reason,"UNKNOWN_TRAVEL_METHOD");
 assert.equal(planTimeSpaceJourney({to:"unknown"}).reason,"UNKNOWN_LOCATION");
 assert.equal(planTimeSpaceJourney({to:"pit_ghaunadaur"}).allowed,false);
 assert.throws(()=>listTimeSpaceEras().push({}),TypeError);
});
