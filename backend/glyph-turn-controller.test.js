"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {createGlyphTurnController}=require("./glyph-turn-controller");
function state(){return {allies:[{id:"alice",hp:10,maxHp:30},{id:"glyph",hp:20,maxHp:30}],enemies:[{id:"ooze",hp:9,maxHp:9}],log:[]};}
test("one action per round and no double healing",()=>{
 const s=state(),turn=createGlyphTurnController(s,{roll:()=>4});
 assert.deepEqual(turn.status(),{round:1,actionAvailable:true});
 turn.act("SUPPORT");assert.equal(s.allies[0].hp,16);
 assert.throws(()=>turn.act("SUPPORT"),/already spent/);
 assert.equal(s.allies[0].hp,16);assert.equal(s.log.length,1);
 turn.nextRound();turn.act("SUPPORT");assert.equal(s.allies[0].hp,22);
 assert.deepEqual(turn.status(),{round:2,actionAvailable:false});
});
test("invalid and incapacitated actions do not consume a turn",()=>{
 const s=state(),turn=createGlyphTurnController(s);
 assert.throws(()=>turn.act("CHEAT"),/Unknown action/);
 assert.equal(turn.status().actionAvailable,true);
 s.allies[1].hp=0;
 assert.throws(()=>turn.act("ATTACK"),/unavailable/);
 assert.equal(turn.status().actionAvailable,true);
 s.allies[1].hp=20;
 const result=turn.act("DEFEND");
 assert.equal(result.effect.expires,"END_OF_ROUND");
 assert.equal(result.round,1);
 assert.equal(s.allies[1].maxHp,30);
});
test("controller does not modify existing browser saves or canonical character data",()=>{
 const s=state(),turn=createGlyphTurnController(s);
 turn.act("SCAN");turn.nextRound();
 assert.equal(s.allies[0].maxHp,30);
 assert.equal(s.allies[1].maxHp,30);
 assert.equal(s.log.length,1);
});
