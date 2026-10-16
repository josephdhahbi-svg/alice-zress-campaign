"use strict";
/** Read-only LEGO action catalog. DM adjudicates all actions; no inventory or spell grants. */
const ACTIONS=[
 {id:"spell_light",kind:"SPELL",name:"Light",source:"2024_DND_SPELL",access:"ALICE_EILISTRAEE_ORIGIN_GIFT",scene:"pit_ghaunadaur",target:"fallen_moonstone",check:"DM_ADJUDICATED",result:"Illuminate the moonstone and inspect inscriptions",consumesSlot:false},
 {id:"spell_acid_splash",kind:"SPELL",name:"Acid Splash",source:"2024_DND_SPELL",access:"ALICE_GHAUNADAUR_ORIGIN_GIFT",scene:"pit_ghaunadaur",target:"slime_membrane",check:"DM_ADJUDICATED",result:"Test a distant slime membrane without automatically destroying it",consumesSlot:false},
 {id:"spell_shield",kind:"SPELL",name:"Shield",source:"2024_DND_SPELL",access:"ALICE_MYSTRA_ORIGIN_GIFT",scene:"pit_ghaunadaur",target:"alice",check:"TRIGGER_REQUIRED",result:"Propose a defensive reaction when a qualifying attack occurs",consumesSlot:"DM_VERIFY_ORIGIN_GIFT"},
 {id:"spell_eldritch_blast",kind:"SPELL",name:"Eldritch Blast",source:"2024_DND_SPELL",access:"KNOWN_SPELL_REQUIRED",scene:"pit_ghaunadaur",target:"hostile_ooze",check:"ATTACK_ROLL_REQUIRED",result:"Preview a ranged attack if the spell is actually known",consumesSlot:false},
 {id:"spell_mage_hand",kind:"SPELL",name:"Mage Hand",source:"2024_DND_SPELL",access:"KNOWN_SPELL_REQUIRED",scene:"pit_ghaunadaur",target:"rune_lever",check:"DM_ADJUDICATED",result:"Inspect or manipulate a reachable lever without risking Alice",consumesSlot:false},
 {id:"item_rope",kind:"ITEM",name:"Hempen Rope",source:"DND_EQUIPMENT_REFERENCE",access:"INVENTORY_REQUIRED",scene:"pit_ghaunadaur",target:"collapsed_bridge",check:"DM_ADJUDICATED",result:"Secure a crossing anchor if rope is actually carried"},
 {id:"item_torch",kind:"ITEM",name:"Torch",source:"DND_EQUIPMENT_REFERENCE",access:"INVENTORY_REQUIRED",scene:"pit_ghaunadaur",target:"dark_passage",check:"DM_ADJUDICATED",result:"Illuminate a passage if a torch is actually carried"},
 {id:"item_thieves_tools",kind:"ITEM",name:"Thieves' Tools",source:"DND_EQUIPMENT_REFERENCE",access:"INVENTORY_AND_PROFICIENCY_CHECK",scene:"pit_ghaunadaur",target:"sealed_cage",check:"ABILITY_CHECK_REQUIRED",result:"Attempt to release a captive without damaging the cage"},
 {id:"env_moonstone",kind:"ENVIRONMENT",name:"Fallen Moonstone",source:"MOONVEIL_HOMEBREW",access:"SCENE_PRESENT",scene:"pit_ghaunadaur",target:"fallen_moonstone",check:"INVESTIGATION_OPTIONAL",result:"Search for Eilistraeen symbols and hidden messages"},
 {id:"env_spore_vents",kind:"ENVIRONMENT",name:"Spore Vents",source:"MOONVEIL_HOMEBREW",access:"SCENE_PRESENT",scene:"pit_ghaunadaur",target:"spore_vents",check:"DM_ADJUDICATED",result:"Study airflow and find a safer route around the vents"},
 {id:"env_ooze_pool",kind:"ENVIRONMENT",name:"Living Ooze Pool",source:"MOONVEIL_HOMEBREW",access:"SCENE_PRESENT",scene:"pit_ghaunadaur",target:"living_ooze_pool",check:"DM_ADJUDICATED",result:"Observe movement without disturbing the creature"},
 {id:"env_echo_well",kind:"ENVIRONMENT",name:"Echo Well",source:"MOONVEIL_HOMEBREW",access:"SCENE_PRESENT",scene:"pit_ghaunadaur",target:"echo_well",check:"DM_ADJUDICATED",result:"Listen for survivors beyond the cavern walls"}
].map(x=>Object.freeze({...x,version:"v1",status:"PREVIEW_ONLY",canonEra:"UNRESOLVED",drDate:null,applied:false}));
function listSceneActions(sceneId,{kind}={}){
 if(typeof sceneId!=="string"||!/^[a-z0-9_]{3,100}$/.test(sceneId)||kind!==undefined&&!["SPELL","ITEM","ENVIRONMENT"].includes(kind))throw new TypeError("INVALID_ACTION_FILTER");
 return ACTIONS.filter(x=>x.scene===sceneId&&(kind===undefined||x.kind===kind)).map(x=>({...x}));
}
function previewSceneAction(sceneId,actionId){
 if(typeof actionId!=="string"||!/^[a-z0-9_]{3,100}$/.test(actionId))throw new TypeError("INVALID_ACTION_ID");
 const action=listSceneActions(sceneId).find(x=>x.id===actionId);
 return action?{action,requiresDmApproval:true,spellCast:false,itemConsumed:false,inventoryChanged:false,worldChanged:false,rewards:[],effect:"NONE"}:null;
}
module.exports={listSceneActions,previewSceneAction};
