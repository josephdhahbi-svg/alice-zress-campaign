"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const c=require("./major-powers-dialogue-catalog");
test("45 recurring powers, 15 per narrative role, with eight lines each",()=>{
 const all=c.listPowers();assert.equal(all.length,45);
 for(const role of ["BLUE_GOOD","GREEN_NEUTRAL","RED_EVIL"])assert.equal(c.listPowers({moralRole:role}).length,15);
 assert.equal(all.reduce((n,p)=>n+p.dialogue.lines.length,0),360);
});
test("all core Alice scenes retain five distinct choices",()=>{
 const scenes=c.listCoreScenes();assert.equal(scenes.length,3);
 for(const s of scenes)assert.deepEqual(s.choices.map(x=>x.type),["LAWFUL_GOOD","NEUTRAL_GOOD","CHAOTIC_GOOD","UTILITY","ACTION"]);
});
test("historically unverified divine dialogue is never auto-authorized",()=>{
 const result=c.previewPowerDialogue({powerId:"mv_power_001",trigger:"FIRST_ENCOUNTER",drYear:1492});
 assert.equal(result.allowed,false);assert.equal(result.canonQuote,false);
});
