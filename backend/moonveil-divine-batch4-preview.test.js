"use strict";
const test=require("node:test");const assert=require("node:assert/strict");
const {listDivineFixtures,previewBlessing,previewSpellInteraction}=require("./moonveil-divine-batch4-preview");
test("established deity pairings preserved",()=>{const d=listDivineFixtures().deities;assert.equal(d.find(x=>x.id==="mystra").wonderland,"White Rabbit");assert.equal(d.find(x=>x.id==="selune").wonderland,"Mouse");});
test("score cannot grant reward",()=>{const r=previewBlessing({deityId:"eilistraee",questsCompleted:100,faithWeight:100,corruption:0});assert.equal(r.eligible,true);assert.equal(r.granted,false);assert.equal(r.applied,false);});
test("invalid scores fail closed",()=>{assert.equal(previewBlessing({deityId:"lolth",questsCompleted:Infinity,faithWeight:2,corruption:0}).eligible,false);});
test("detect magic does not reveal full lore",()=>{const r=previewSpellInteraction({objectId:"oozing_altar",spellName:"Detect Magic"});assert.equal(r.loreRevealed,false);assert.equal(r.applied,false);});
test("dispel magic cannot automatically remove curse",()=>{const r=previewSpellInteraction({objectId:"oozing_altar",spellName:"Dispel Magic"});assert.equal(r.curseRemoved,false);assert.equal(r.applied,false);});
