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

test("hidden discoveries emerge on revisits only after verified quest gates",()=>{
 const first=previewAtlasVisit("pit_ghaunadaur");
 assert.ok(first.hiddenDiscoveries.every(x=>x.visibility==="HIDDEN"&&x.name===null));
 const second=previewAtlasVisit("pit_ghaunadaur",{era:"REVISIT",visitSequence:2});
 assert.equal(second.hiddenDiscoveries[0].visibility,"HINT_ONLY");
 assert.equal(second.hiddenDiscoveries[0].name,null);
 const unlocked=previewAtlasVisit("pit_ghaunadaur",{era:"REVISIT",visitSequence:2,availableFlags:["QUEST_ITEM_VERIFIED"]});
 assert.equal(unlocked.hiddenDiscoveries[0].visibility,"REVEALED");
 assert.equal(unlocked.hiddenDiscoveries[0].collectible,false);
 assert.equal(unlocked.hiddenDiscoveries[0].claimed,false);
 assert.equal(unlocked.worldChanged,false);
 const later=previewAtlasVisit("pit_ghaunadaur",{era:"LATER_ERA",level:15,visitSequence:3,availableFlags:["DIALOGUE_UNLOCKED","SPELL_KNOWN_VERIFIED"]});
 assert.equal(later.hiddenDiscoveries[1].visibility,"REVEALED");
});
test("every map contains an unclaimed hidden discovery",()=>{
 for(const map of listAtlasMaps()){
  const result=previewAtlasVisit(map.id);
  assert.ok(result.hiddenDiscoveries.length>0);
  assert.ok(result.hiddenDiscoveries.every(x=>x.dmApprovalRequired&&!x.claimed));
 }
});
