"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listWorldRoutes,availableRouteLeads,getWorldNode,getMultiverseAdventureIndex}=require("./multiverse-adventure-index");
test("Alice's Rabbit Hole origin leads into Pit of Ghaunadaur and branches without granting travel",()=>{
 const index=getMultiverseAdventureIndex();
 assert.equal(index.origin,"rabbit_hole");
 assert.equal(index.startingLocation,"pit_ghaunadaur");
 assert.equal(index.trilogies,10);
 assert.equal(index.books,30);
 assert.equal(index.traversals,7);
 assert.equal(index.paths.length,7);
 assert.equal(new Set(listWorldRoutes().map(x=>x.id)).size,listWorldRoutes().length);
 assert.deepEqual(availableRouteLeads("rabbit_hole").map(x=>x.id),["pit_ghaunadaur"]);
 assert.ok(availableRouteLeads("pit_ghaunadaur").some(x=>x.id==="underdark"));
 assert.equal(getWorldNode("nhalruun").canonStatus,"HOMEBREW_PROPOSAL");
 assert.equal(getWorldNode("sigil").status,"LOCKED");
 assert.equal(getWorldNode("not_real"),null);
 assert.throws(()=>listWorldRoutes().push({id:"fake"}),TypeError);
});
