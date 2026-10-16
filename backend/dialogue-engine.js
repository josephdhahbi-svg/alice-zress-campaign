"use strict";
/**
 * Read-only authored dialogue for the opening Rabbit Hole scene.
 * Choices are proposals: selection never mutates a quest, inventory or character.
 */
const ORDER=Object.freeze(["LAWFUL_GOOD","NEUTRAL_GOOD","CHAOTIC_GOOD","UTILITY","ACTION"]);
const PALETTE=Object.freeze({LAWFUL_GOOD:"#478DFF",NEUTRAL_GOOD:"#48C99A",CHAOTIC_GOOD:"#48C99A",UTILITY:"#64C8DF",ACTION:"#F16B78"});
const SCENES=Object.freeze({
 pit_ghaunadaur:Object.freeze({
  id:"pit_ghaunadaur",name:"The Pit of Ghaunadaur",plane:"MATERIAL",region:"Underdark",
  drYear:null,sourceStatus:"HOMEBREW_PROPOSAL",prerequisites:Object.freeze(["ALICE_LEVEL_1_ORIGIN"]),
  choices:Object.freeze([
   Object.freeze({type:"LAWFUL_GOOD",text:"Promise to protect the prisoner trapped beneath the fallen stones.",preview:"Investigate a rescue before proceeding.",check:"DM_ADJUDICATED"}),
   Object.freeze({type:"NEUTRAL_GOOD",text:"Follow Eilistraee's distant light toward the cries for help.",preview:"Look for a compassionate route through the darkness.",check:"DM_ADJUDICATED"}),
   Object.freeze({type:"CHAOTIC_GOOD",text:"Challenge the cultists threatening the helpless.",preview:"Risk confrontation to interrupt the cultists.",check:"DM_ADJUDICATED"}),
   Object.freeze({type:"UTILITY",text:"Examine the Rabbit Hole portal's runes and nearby traps.",preview:"Gather information about the unstable time-space passage.",check:"DM_ADJUDICATED"}),
   Object.freeze({type:"ACTION",text:"Ready a weapon as something stirs in the shadows.",preview:"Prepare for an encounter without initiating combat automatically.",check:"DM_ADJUDICATED"})
  ])
 })
});
function getDialogueScene(nodeId){return Object.hasOwn(SCENES,nodeId)?SCENES[nodeId]:(Object.hasOwn(EXPANDED,nodeId)?EXPANDED[nodeId]:null);}
function getDialogueChoices(nodeId){
 const scene=getDialogueScene(nodeId);
 if(!scene)return [];
 return scene.choices.map((choice,index)=>Object.freeze({...choice,number:index+1,color:PALETTE[choice.type],approval:"DM_REQUIRED",effect:"NONE"}));
}
function previewDialogueChoice(nodeId,choiceType){
 const scene=getDialogueScene(nodeId);
 if(!scene)return {allowed:false,reason:"UNKNOWN_SCENE"};
 if(!ORDER.includes(choiceType))return {allowed:false,reason:"INVALID_CHOICE"};
 const choice=getDialogueChoices(nodeId).find(c=>c.type===choiceType);
 return {allowed:false,reason:"DM_ADJUDICATION_REQUIRED",nodeId,choice,sideEffects:"NONE"};
}
module.exports={CHOICE_ORDER:ORDER,getDialogueScene,getDialogueChoices,previewDialogueChoice};
