"use strict";
/** Gemini submission intake: nine alignment paths and two transcendent paths.
 * This is a proposed catalog, not an unlock/ritual/resurrection system.
 */
const alignments=[
 ["lawful_good","Lawful Good","Oathbound Guardian"],
 ["neutral_good","Neutral Good","Benevolent Keeper"],
 ["chaotic_good","Chaotic Good","Liberator of Souls"],
 ["lawful_neutral","Lawful Neutral","Deathless Arbiter"],
 ["true_neutral","True Neutral","Keeper of Equilibrium"],
 ["chaotic_neutral","Chaotic Neutral","Wandering Paradox"],
 ["lawful_evil","Lawful Evil","Tyrant of the Sepulcher"],
 ["neutral_evil","Neutral Evil","Soul Broker"],
 ["chaotic_evil","Chaotic Evil","Ruinous Hunger"]
];
const paths=Object.freeze([
 ...alignments.map(([id,alignment,title])=>Object.freeze({id:"lich_"+id,category:"ALIGNMENT_9",alignment,title,canonStatus:"HOMEBREW_PROPOSAL",ritualApproved:false,phylacteryApproved:false,questsApproved:false})),
 Object.freeze({id:"lich_true_trinity",category:"TRANSCENDENT",alignment:"HEROIC_CHOICE",title:"True Trinity Eldritch Lich",character:"alice_zress",core:"THE_RABBIT_HOLE_ITSELF",physicalAnchor:"PIT_OF_GHAUNADAUR_UNDERDARK",eldritchInfluence:"FAR_REALM",canonStatus:"HOMEBREW_PROPOSAL",ritualApproved:false,phylacteryApproved:false,questsApproved:false}),
 Object.freeze({id:"lich_stellar_void",category:"TRANSCENDENT",alignment:"UNRESOLVED",title:"Stellar Void Star-Eater",canonStatus:"HOMEBREW_PROPOSAL",ritualApproved:false,phylacteryApproved:false,questsApproved:false})
]);
function listLichdomPaths(){return paths.map(p=>({...p}));}
function getLichdomPath(id){return listLichdomPaths().find(p=>p.id===id)||null;}
function previewLichdomPath(id){const path=getLichdomPath(id);return path?{allowed:false,reason:"DM_RITUAL_AND_QUEST_EVIDENCE_REQUIRED",path}:{allowed:false,reason:"UNKNOWN_PATH"};}
module.exports={listLichdomPaths,getLichdomPath,previewLichdomPath};
