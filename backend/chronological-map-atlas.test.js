"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {listAtlasMaps,previewAtlasVisit}=require("./chronological-map-atlas");
test("grid maps include legends",()=>{
 const maps=listAtlasMaps();
 assert.equal(maps.length,9);
 for(const map of maps){
  assert.equal(map.grid.length,5);
  assert.ok(map.grid.every(row=>row.length===8));
  for(const row of map.grid)for(const symbol of row)if(symbol!=="#"&&symbol!==".")assert.ok(map.legend[symbol]);
 }
});
test("return visits show newly unlocked actions without moving the character",()=>{
 const early=previewAtlasVisit("pit_ghaunadaur");
 const later=previewAtlasVisit("pit_ghaunadaur",{era:"REVISIT",visitSequence:2,availableFlags:["QUEST_ITEM_VERIFIED"]});
 assert.equal(early.hooks.find(x=>x.key==="item").ready,false);
 assert.equal(later.hooks.find(x=>x.key==="item").ready,true);
 assert.equal(later.travelPerformed,false);
 assert.equal(later.timelineChanged,false);
 assert.deepEqual(later.rewards,[]);
});
