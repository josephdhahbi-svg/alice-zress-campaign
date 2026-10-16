"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const html=fs.readFileSync(path.join(__dirname,"../game/tactical-command-deck.html"),"utf8");
test("deck has accessible round control and no changes to existing pin key",()=>{
 assert.match(html,/id="nextRound"/);assert.match(html,/id="glyphTurn" role="status"/);
 assert.match(html,/moonveil-command-deck-pins-v1/);
 assert.match(html,/actionSpent=true/);
 assert.match(html,/round=1;actionSpent=false/);
});
test("embedded tactical deck script parses",()=>{
 const script=html.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(script,"inline script must exist");
 assert.doesNotThrow(()=>new vm.Script(script[1]));
});
