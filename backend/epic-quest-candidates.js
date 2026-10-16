"use strict";
/** Sprint 127: candidate epic quest stories. No completion, inventory or reputation mutation. */
const QUESTS=Object.freeze([
 {id:"quest_act1_pit_awakening",title:"Awakening the Pit Parasite",act:1,source:"Trilogy of the Ten Act I (user proposal)",giver:"Alice Z'ress (proposed)",objective:"Investigate the Ghaunadaur slime vault and determine whether its primordial core can be secured without corrupting Alice.",reward:"item_ghaunadaur_slime_core",reputation:100,era:"UNVERIFIED",plane:"Underdark",status:"PROPOSED"},
 {id:"quest_act2_mystra_weave",title:"Restoring the Shattered Weave",act:2,source:"Mystra's Chosen Arc (user proposal)",giver:"Elminster Aumar (chronology unverified)",objective:"Locate three azure Weave shards in Myth Drannor, subject to historical availability and DM approval.",reward:"item_mystra_azure_shard",reputation:150,era:"UNVERIFIED",plane:"Toril / Myth Drannor",status:"PROPOSED"},
 {id:"quest_act3_lich_ascension",title:"The Eleventh Path to Immortality",act:3,source:"Eldritch Lich Codex (homebrew)",giver:"The Sovereign Necromancer (identity unverified)",objective:"Investigate a future twilight ritual in the Pit sanctuary; ascension requires separate sacrificial and DM quest evidence.",reward:"item_blood_iron_crown",reputation:300,era:"FUTURE_UNVERIFIED",plane:"Rabbit Hole / Pit of Ghaunadaur",status:"FUTURE_LOCKED"}
].map(x=>Object.freeze(x)));
function listEpicQuestCandidates(){return QUESTS.map(q=>({...q,canonStatus:"HOMEBREW_PROPOSAL",rewardGranted:false,reputationGranted:0}));}
function previewEpicQuestCandidate(id){
 const q=QUESTS.find(x=>x.id===id);
 return q?{quest:{...q,canonStatus:"HOMEBREW_PROPOSAL"},allowed:false,reason:"DM_APPROVAL_AND_OBJECTIVE_EVIDENCE_REQUIRED",rewardGranted:false,reputationGranted:0,effect:"NONE"}:null;
}
module.exports={listEpicQuestCandidates,previewEpicQuestCandidate};
