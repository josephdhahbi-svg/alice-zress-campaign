"use strict";
const data=require("../data/items/looking-glass-five-artifact-triads.json");
const itemIds=new Set(data.items.map(x=>x.id));
function previewLoadout(attunedIds){
 if(!Array.isArray(attunedIds)||attunedIds.length>3||new Set(attunedIds).size!==attunedIds.length||attunedIds.some(x=>!itemIds.has(x)))return {valid:false,reason:"INVALID_ATTUNEMENT_LOADOUT",activeTriad:null};
 const triad=data.triads.find(x=>x.required.every(id=>attunedIds.includes(id))&&attunedIds.length===3);
 return {valid:true,activeTriad:triad?structuredClone(triad):null,items:structuredClone(data.items.filter(x=>attunedIds.includes(x.id))),activationAllowed:false,reason:"PREVIEW_ONLY_DM_ATTESTED_ATTUNEMENT_REQUIRED"};
}
function listArtifacts(){return structuredClone(data.items)}
function listTriads(){return structuredClone(data.triads)}
module.exports={previewLoadout,listArtifacts,listTriads};
