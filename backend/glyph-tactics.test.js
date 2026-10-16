"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {chooseGlyphAction,applyGlyphAction}=require("./glyph-tactics");
function encounter(){return {allies:[{id:"alice",hp:10,maxHp:30},{id:"glyph",hp:20,maxHp:30}],enemies:[{id:"ooze",hp:9,maxHp:9}],log:[]};}
test("Glyph prioritizes injured Alice without altering canonical character build",()=>{
 const s=encounter();
 assert.equal(chooseGlyphAction({glyph:s.allies[1],allies:s.allies,enemies:s.enemies}),"SUPPORT");
 const result=applyGlyphAction(s,"SUPPORT",{roll:()=>6});
 assert.equal(result.action,"SUPPORT");assert.equal(s.allies[0].hp,18);
 assert.equal(s.allies[0].maxHp,30);assert.equal(s.log.length,1);
});
test("Glyph combat caps damage and does not produce negative HP",()=>{
 const s=encounter();s.allies[0].hp=30;
 assert.equal(chooseGlyphAction({glyph:s.allies[1],allies:s.allies,enemies:s.enemies}),"ATTACK");
 applyGlyphAction(s,"ATTACK",{roll:()=>10000});
 assert.equal(s.enemies[0].hp,1);
 applyGlyphAction(s,"ATTACK",{roll:()=>10000});
 assert.equal(s.enemies[0].hp,0);
});
test("Glyph defense effects expire instead of permanently inflating stats",()=>{
 const s=encounter(),original={...s.allies[1]};
 const result=applyGlyphAction(s,"DEFEND");
 assert.equal(result.effect.expires,"END_OF_ROUND");
 assert.deepEqual(s.allies[1],original);
 assert.throws(()=>applyGlyphAction(s,"UNKNOWN"),/Unknown action/);
});
test("Glyph never acts when incapacitated",()=>{
 const s=encounter();s.allies[1].hp=0;
 assert.equal(chooseGlyphAction({glyph:s.allies[1],allies:s.allies,enemies:s.enemies}),"INACTIVE");
 assert.throws(()=>applyGlyphAction(s,"ATTACK"),/unavailable/);
});

test("Glyph rejects malformed HP and contains nonfinite random rolls",()=>{
 const s=encounter();s.allies[1].maxHp=0;
 assert.equal(chooseGlyphAction({glyph:s.allies[1],allies:s.allies,enemies:s.enemies}),"INACTIVE");
 assert.throws(()=>applyGlyphAction(s,"ATTACK"),/unavailable/);
 s.allies[1].maxHp=30;
 applyGlyphAction(s,"ATTACK",{roll:()=>NaN});
 assert.equal(s.enemies[0].hp,6);
 s.allies[0].hp=NaN;
 const result=applyGlyphAction(s,"SUPPORT",{roll:()=>Infinity});
 assert.equal(result.detail,"No eligible ally");
});
