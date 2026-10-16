"use strict";
/** Sprint 128: source-submitted ritual variants, intentionally distinct from canonical 9+2 paths. */
const VARIANTS=Object.freeze([
 [1,"Slime-Bound Phylactery","Ghaunadaur","item_ghaunadaur_slime_core",10,18],
 [2,"Astral Starlight Lichdom","Selune","item_starlight_eclipse_prism",12,19],
 [3,"Weave-Corrupted Lichdom","Mystra","item_mystra_azure_shard",15,21],
 [4,"Blood-Iron Sovereignty","Barovia","item_blood_iron_crown",10,17],
 [5,"Chronos Clockwork Singularity","Mechanus","item_modron_chrono_gear",14,22],
 [6,"Void Prism Immortality","Far Realm","item_void_singularity_stone",16,25],
 [7,"Sunsword Reliquary","Lathander","item_sunsword_hilt",10,18],
 [8,"Nine Hells Infernal Contract","Asmodeus","item_infernal_pact_scroll",12,20],
 [9,"Shadowfell Weeping Ossuary","Raven Queen","item_shadowfell_crystal_skull",11,19],
 [10,"Elemental Chaos Magma Heart","Imix","item_magma_heart_relic",13,21],
 [11,"True Trinity Absolute Convergence","Alice Z'ress (future only)","item_true_trinity_convergence_orb",20,30]
].map(([number,title,domain,relic,shards,dc])=>Object.freeze({number,title,domain,relic,proposedSoulShards:shards,proposedDC:dc,canonStatus:"HOMEBREW_VARIANT",status:"UNAPPROVED"})));
function listLichdomRitualVariants(){return VARIANTS.map(v=>({...v,ritualAvailable:false}));}
function previewLichdomRitualVariant(number){
 const v=VARIANTS.find(x=>x.number===number);
 return v?{variant:{...v},allowed:false,reason:"UNAPPROVED_VARIANT_NOT_A_CANONICAL_PATH",phylacteryBound:false,soulShardsConsumed:0,ascended:false,effect:"NONE"}:null;
}
module.exports={listLichdomRitualVariants,previewLichdomRitualVariant};
