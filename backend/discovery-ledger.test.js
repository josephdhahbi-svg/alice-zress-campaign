"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {createDiscoveryLedger}=require("./discovery-ledger");
test("hidden discoveries persist by campaign and actor without granting items",()=>{
 const db=new Database(":memory:");
 try{
  const ledger=createDiscoveryLedger(db);
  const args={campaignId:"camp_a",entryId:"visit_02",actorId:"alice",mapId:"pit_ghaunadaur",discoveryId:"moonstone_cache",era:"REVISIT",visitSequence:2,drDate:"1492 DR",localTime:"18:30",availableFlags:["QUEST_ITEM_VERIFIED"],note:"DM verified the item and moonstone clue."};
  const first=ledger.record(args);
  assert.equal(first.entry.status,"REVEALED");
  assert.equal(first.duplicate,false);
  assert.equal(ledger.record(args).duplicate,true);
  assert.equal(ledger.list("camp_a","alice").length,1);
  assert.equal(ledger.list("camp_b","alice").length,0);
  assert.equal(ledger.list("camp_a","bob").length,0);
  assert.equal(first.entry.local_time,"18:30");
  assert.throws(()=>ledger.record({...args,actorId:"bob"}),/ENTRY_CONFLICT/);
  assert.throws(()=>ledger.record({...args,entryId:"new",visitSequence:1}),/DISCOVERY_NOT_VISIBLE/);
  assert.equal(db.prepare("SELECT count(*) AS n FROM vtt_discovery_ledger").get().n,1);
 }finally{db.close()}
});
test("clues can be recorded without exposing undiscovered item identities",()=>{
 const db=new Database(":memory:");
 try{
  const ledger=createDiscoveryLedger(db);
  const x=ledger.record({campaignId:"camp",entryId:"hint_1",actorId:"alice",mapId:"pit_ghaunadaur",discoveryId:"moonstone_cache",era:"REVISIT",visitSequence:2,note:"A seam was observed but the required item is absent."});
  assert.equal(x.entry.status,"CLUE");
  assert.throws(()=>ledger.record({campaignId:"camp",entryId:"hint_2",actorId:"alice",mapId:"invalid_map",discoveryId:"moonstone_cache",era:"REVISIT",visitSequence:2,note:"No map or valid secret is present."}),/DISCOVERY_NOT_VISIBLE/);
 }finally{db.close()}
});
