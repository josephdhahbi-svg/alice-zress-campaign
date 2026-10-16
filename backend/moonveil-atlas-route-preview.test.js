"use strict";
const test=require("node:test");const assert=require("node:assert/strict");
const {listLocations,getLocation,previewRoute}=require("./moonveil-atlas-route-preview");
test("four published locations staged without invented layers",()=>{assert.equal(listLocations().length,4);assert.equal(getLocation("menzoberranzan").layer,"UNVERIFIED");});
test("proposed route is blocked in normal preview",()=>{const r=previewRoute({from:"menzoberranzan",to:"blingdenstone",eraId:"ERA_3_MIDNIGHT_MYSTRA"});assert.equal(r.reachable,false);assert.equal(r.proposedRouteAvailable,true);});
test("no invented travel metrics even when proposed routes are requested",()=>{const r=previewRoute({from:"menzoberranzan",to:"blingdenstone",eraId:"ERA_3_MIDNIGHT_MYSTRA",allowProposed:true});assert.equal(r.reachable,false);assert.equal(r.travelDays,undefined);});
test("unknown locations and eras fail closed",()=>{assert.equal(previewRoute({from:"foo",to:"blingdenstone",eraId:"ERA_1_MYSTRYL"}).reachable,false);assert.equal(previewRoute({from:"menzoberranzan",to:"blingdenstone",eraId:"ERA_99"}).reachable,false);});
