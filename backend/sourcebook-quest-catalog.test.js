"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const catalog=require("./sourcebook-quest-catalog");
test("one quest per source and all books covered",()=>{
 const all=catalog.listSourceQuests({limit:200});
 assert.equal(all.total,89);
 for(let book=1;book<=30;book++)assert.ok(catalog.listSourceQuests({book}).total>=2);
 for(const q of all.quests){assert.equal(q.fiveChoices.length,5);assert.equal(q.reward.xp,"NONE_AUTOMATIC");}
});
