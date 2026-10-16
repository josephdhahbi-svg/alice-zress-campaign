"use strict";
/**
 * Proposed Skyrim-inspired ascension paths. Read-only content, not character state.
 * No player-supplied quest/inventory array can grant transformation or rewards.
 */
const definitions=[
 ["moon","Moonveil Circle","Selûne","Moonwraith",["The Silver Road","Dreamsea Crossing","Shadow of the Self","Moonshard Hunt","Ascend the Veil"],["Moonveil Light","Dreamwalk","Lunar Reflection"],["Moonshard","Silverwater","Dreamthread"],["Shadowmoon","Purelight"]],
 ["flesh","The Flesh Coven","Ghaunadaur","Flesh Hydra",["The Hunger Below","Memory Feast","Fleshcraft Trial","The Elder Eye","Become the Hydra"],["Fleshshift","Oozeform","Aberrant Mutation"],["Flesh Seed","Ooze Core","Aberrant Organ"],["Controlled mutation","Chaotic mutation"]],
 ["dragon","The Dragonbound","Bahamut / Tiamat","Half-Dragon",["Scale of the Wyrm","Fivefold Challenge","Tyrant’s Fang","Kneel or Defy","Ascend the Throne"],["Chromatic Breath","Tyrant’s Command","Fivefold Fury"],["Chromatic Scales","Tyrant’s Fang","Draconic Blood Chalice"],["Bahamut","Tiamat"]],
 ["weave","The Arcane Forge","Mystryl","Spellwrought Entity",["Break the Spell","Weave Exposure","Arcane Identity","Reality Stitch","Spellwrought Ascension"],["Spellweave Body","Arcane Pulse","Reality Stitch"],["Weave-Tear Crystal","Spellheart Core","Arcane Sigil"],["Logic","Emotion"]],
 ["web","The Shadow Matrons","Lolth","Drider Ascendant",["Web of Lies","Matron’s Game","Venomkiss Trial","Shadowblood Rite","Become Drider"],["Venomkiss","Webstep","Shadowweave"],["Shadowblood Chalice","Venomkiss Fang","Webweave Silk"],["Serve Lolth","Defy Lolth"]],
 ["void","The Nightfall Order","Shar","Voidspawn",["Erase the Memory","Night Maze","Voiddrop Pearl","Silence Trial","Voidspawn Ritual"],["Void Pulse","Nightform","Memory Drain"],["Voiddrop Pearl","Memory Husk","Nightglass"],["Embrace oblivion","Resist oblivion"]],
 ["root","The Worldroot Tribe","Silvanus","Verdant Titan",["Heal the Grove","Elder Communion","Rootcall Trial","Titan Sap","Become Titan"],["Rootcall","Verdant Titanform","Stormheart"],["Worldroot Seed","Barkplate","Titan Sap"],["Beast","Guardian"]]
];
const slug=s=>s.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");
const catalog=Object.freeze(definitions.map(([id,faction,deity,form,quests,spells,items,endings])=>Object.freeze({
 id:"path_"+id,faction,deity,proposedForm:form,
 quests:Object.freeze(quests.map((name,i)=>Object.freeze({id:id+"_q"+(i+1),name,stage:i+1,approval:"PROPOSED"}))),
 spells:Object.freeze(spells.map(name=>Object.freeze({id:slug(name),name,approval:"PROPOSED"}))),
 items:Object.freeze(items.map(name=>Object.freeze({id:slug(name),name,approval:"PROPOSED"}))),
 endings:Object.freeze(endings.map(name=>Object.freeze({id:slug(name),name,approval:"PROPOSED"}))),
 canonStatus:"HOMEBREW_PROPOSAL",rewardApproved:false,ritualApproved:false,
 chronology:{drDate:null,plane:null,earliestAvailability:null,source:"user-supplied ascension module",reviewRequired:true}
})));
function listAscensionPaths(){return catalog;}
function getAscensionPath(id){return catalog.find(p=>p.id===id)||null;}
function assessAscensionReadiness({pathId,verifiedQuestIds=[],verifiedItemIds=[],approval=false}={}){
 const path=getAscensionPath(pathId);
 if(!path)return {eligible:false,reason:"UNKNOWN_PATH"};
 if(approval!==true||!path.ritualApproved)return {eligible:false,reason:"RITUAL_NOT_APPROVED"};
 // Deliberately fail closed: a future server-owned ledger must authorize eligibility.
 return {eligible:false,reason:"SERVER_EVIDENCE_REQUIRED"};
}
module.exports={listAscensionPaths,getAscensionPath,assessAscensionReadiness};
