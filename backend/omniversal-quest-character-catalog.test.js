"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const catalog=require("./omniversal-quest-character-catalog");
test("100 distinct NPCs each link to twenty quests and have independent stat blocks",()=>{
 const all=catalog.listCharacters();
 assert.equal(all.total,100);
 assert.equal(new Set(all.characters.map(x=>x.id)).size,100);
 for(const row of all.characters){
  const c=catalog.getCharacter(row.id);
  assert.equal(c.questLinks.wave2.length,10);
  assert.equal(c.questLinks.wave3.length,10);
  assert.equal(c.statBlock.status,"HOMEBREW_LEVEL_1_PROPOSAL");
  assert.equal(c.dmApprovalRequired,true);
  assert.equal(Object.keys(c.statBlock.abilities).length,6);
  for(const id of [...c.questLinks.wave2,...c.questLinks.wave3])assert.ok(catalog.getQuest(id).cast.some(x=>x.id===c.id));
 }
});
test("200 chain quests link to previous waves and never grant rewards automatically",()=>{
 const list=catalog.listQuests({limit:100,offset:100});
 assert.equal(list.total,200);
 assert.equal(list.quests.length,100);
 for(const q of list.quests){
  const full=catalog.getQuest(q.id);
  assert.equal(full.requiresDmApproval,true);
  assert.equal(full.automaticRewards,false);
  assert.ok(full.previousQuestId);
  assert.equal(full.recurringCastIds.length,10);
 }
 assert.equal(catalog.getQuest("not_a_quest"),null);
 assert.equal(catalog.getCharacter("not_a_character"),null);
 assert.throws(()=>catalog.listQuests({limit:1000}),TypeError);
});
test("returned character sheets cannot mutate the canonical roster",()=>{
 const c=catalog.getCharacter("chain_01_member_1");
 c.statBlock.hitPoints=9999;c.questLinks.wave2.pop();
 assert.notEqual(catalog.getCharacter("chain_01_member_1").statBlock.hitPoints,9999);
 assert.equal(catalog.getCharacter("chain_01_member_1").questLinks.wave2.length,10);
});
