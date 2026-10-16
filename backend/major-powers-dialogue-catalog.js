"use strict";
const data=require("../data/dialogue/major-powers-45.json");
const core=require("../data/dialogue/alice-core-divine-scenes.json");
const byId=new Map(data.profiles.map(x=>[x.id,x]));
if(byId.size!==45||data.profiles.some(x=>x.dialogue.lines.length!==8))throw Error("INVALID_POWER_ROSTER");
function listPowers({moralRole=null}={}){
 return structuredClone(data.profiles.filter(x=>moralRole===null||x.moralRole===moralRole));
}
function previewPowerDialogue({powerId,trigger,drYear=null,verifiedManifestation=false}){
 const power=byId.get(powerId);
 if(!power)return {allowed:false,reason:"UNKNOWN_POWER"};
 const line=power.dialogue.lines.find(x=>x.trigger===trigger);
 if(!line)return {allowed:false,reason:"UNKNOWN_TRIGGER"};
 return {allowed:false,reason:"CHRONOLOGY_AND_MANIFESTATION_REVIEW_REQUIRED",drYear,verifiedManifestation,character:power.name,proposedLine:structuredClone(line),canonQuote:false};
}
function listCoreScenes(){return structuredClone(core.scenes)}
module.exports={listPowers,previewPowerDialogue,listCoreScenes};
