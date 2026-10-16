"use strict";
const data=require("../data/factions/gemini-batch4-divine-staging.json");
const byDeity=new Map(data.deities.map(x=>[x.id,x]));
function listDivineFixtures(){return structuredClone({deities:data.deities,npcs:data.homebrewNpcs,environment:data.environment,rewardCandidates:data.rewardCandidates});}
function previewBlessing({deityId,questsCompleted,faithWeight,corruption}={}){
 if(!byDeity.has(deityId))return {eligible:false,reason:"UNKNOWN_DEITY",applied:false};
 if(![questsCompleted,faithWeight,corruption].every(x=>typeof x==="number"&&Number.isFinite(x)&&x>=0))return {eligible:false,reason:"INVALID_SCORE_INPUT",applied:false};
 const score=questsCompleted*1.5+faithWeight*2-corruption*0.5;
 const reward=data.rewardCandidates.find(x=>x.deityId===deityId);
 return {eligible:score>=data.policy.defaultThreshold,score,threshold:data.policy.defaultThreshold,rewardCandidate:reward?reward.name:null,applied:false,granted:false,reason:"QUEST_PREREQUISITES_SOURCE_REVIEW_AND_DM_APPROVAL_REQUIRED"};
}
function previewSpellInteraction({objectId,spellName}={}){
 const obj=data.environment.find(x=>x.id===objectId);
 if(!obj)return {allowed:false,reason:"UNKNOWN_OBJECT",applied:false};
 if(typeof spellName!=="string")return {allowed:false,reason:"INVALID_SPELL",applied:false};
 const spell=spellName.trim().toLowerCase();
 if(spell==="detect magic")return {allowed:true,applied:false,effect:"DETECT_MAGIC_AURA_IF_PRESENT_AND_IN_RANGE",loreRevealed:false,curseRemoved:false};
 if(spell==="dispel magic")return {allowed:false,applied:false,reason:"SPECIFIC_DISPELLABLE_SPELL_EFFECT_AND_CHECK_REQUIRED",curseRemoved:false};
 return {allowed:false,applied:false,reason:"SPELL_NOT_SUPPORTED"};
}
module.exports={listDivineFixtures,previewBlessing,previewSpellInteraction};
