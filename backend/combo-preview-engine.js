"use strict";
const catalog=require("../data/combat/moonveil-spell-environment-combos.json");
function previewCombo(comboId,activeTags){
 const combo=catalog.combos.find(x=>x.id===comboId);
 if(!combo)return {ready:false,reason:"UNKNOWN_COMBO"};
 if(!Array.isArray(activeTags))throw new TypeError("TAGS_REQUIRED");
 const missing=combo.requiredTags.filter(x=>!activeTags.includes(x));
 return {ready:false,reason:missing.length?"MISSING_CONDITIONS":"DM_APPROVAL_REQUIRED",missing,combo:structuredClone(combo),applied:false};
}
module.exports={previewCombo,listCombos:()=>structuredClone(catalog.combos)};
