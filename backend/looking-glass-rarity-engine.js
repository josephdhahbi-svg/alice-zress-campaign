"use strict";
const catalog=require("../data/items/looking-glass-five-per-rarity.json");
const byId=new Map(catalog.items.map(x=>[x.id,x]));
if(byId.size!==25||catalog.sets.length!==15)throw Error("INVALID_RARITY_CATALOG");
function listItems(rarity=null){return structuredClone(catalog.items.filter(x=>rarity===null||x.rarity===rarity));}
function previewSet(ids){
 if(!Array.isArray(ids)||ids.length!==3||new Set(ids).size!==3||ids.some(x=>!byId.has(x)))return {valid:false,reason:"EXACTLY_THREE_VALID_ITEMS_REQUIRED"};
 const items=ids.map(id=>byId.get(id));
 const rarity=items[0].rarity;
 if(items.some(x=>x.rarity!==rarity))return {valid:true,path:null,reason:"MIXED_RARITY_NO_TRIAD",applied:false};
 const set=catalog.sets.find(s=>s.requiredItemIds.every(id=>ids.includes(id)));
 return {valid:true,path:set?set.path:null,set:set?structuredClone(set):null,reason:set?"DM_ATTESTED_EQUIPMENT_AND_UNLOCK_REQUIRED":"NO_MATCHING_SET",applied:false};
}
module.exports={listItems,previewSet};
