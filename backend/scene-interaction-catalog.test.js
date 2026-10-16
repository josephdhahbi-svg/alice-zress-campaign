"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listSceneActions,previewSceneAction}=require("./scene-interaction-catalog");
const {CHOICE_ORDER,getDialogueChoices,previewDialogueChoice}=require("./dialogue-engine");
test("scene catalog exposes spell, equipment and environmental actions without state mutation",()=>{
 const actions=listSceneActions("pit_ghaunadaur");
 assert.equal(actions.length,12);
 assert.equal(new Set(actions.map(x=>x.id)).size,12);
 assert.deepEqual(["SPELL","ITEM","ENVIRONMENT"].map(kind=>listSceneActions("pit_ghaunadaur",{kind}).length),[5,3,4]);
 for(const x of actions){
  const p=previewSceneAction("pit_ghaunadaur",x.id);
  assert.equal(p.requiresDmApproval,true);
  assert.equal(p.spellCast,false);
  assert.equal(p.itemConsumed,false);
  assert.equal(p.inventoryChanged,false);
  assert.equal(p.worldChanged,false);
  assert.deepEqual(p.rewards,[]);
  assert.equal(p.effect,"NONE");
 }
 assert.equal(previewSceneAction("pit_ghaunadaur","spell_missing"),null);
 assert.deepEqual(listSceneActions("unknown_scene"),[]);
 assert.throws(()=>listSceneActions("pit_ghaunadaur",{kind:"HACK"}),TypeError);
});
test("Alice's three origin gifts are distinct from unknown spells and items",()=>{
 const spells=listSceneActions("pit_ghaunadaur",{kind:"SPELL"});
 assert.deepEqual(spells.filter(x=>x.access.includes("ORIGIN_GIFT")).map(x=>x.name).sort(),["Acid Splash","Light","Shield"]);
 assert.ok(spells.filter(x=>x.access==="KNOWN_SPELL_REQUIRED").every(x=>x.status==="PREVIEW_ONLY"));
 assert.ok(listSceneActions("pit_ghaunadaur",{kind:"ITEM"}).every(x=>x.access.startsWith("INVENTORY")));
});
test("expanded dialogue preserves five canonical choices and DM adjudication",()=>{
 for(const id of ["pit_ghaunadaur","moonstone_refuge","spore_bridge"]){
  const choices=getDialogueChoices(id);
  assert.equal(choices.length,5);
  assert.deepEqual(choices.map(x=>x.type),CHOICE_ORDER);
  assert.ok(choices.every(x=>x.effect==="NONE"&&x.approval==="DM_REQUIRED"));
  assert.equal(previewDialogueChoice(id,"UTILITY").sideEffects,"NONE");
 }
});
