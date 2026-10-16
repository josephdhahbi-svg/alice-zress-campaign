"use strict";
/** Deterministic, read-only encounter proposals. Never mutate combat, inventory, XP or time. */
const {listAtlasMaps}=require("./chronological-map-atlas");
const TABLES=Object.freeze({
 pit_ghaunadaur:[["mimic_chest","Mimic disguised as a treasure chest","MIMIC","Moonstone ledge","rusted key; loose copper coins"],["mimic_statue","Mimic disguised as a shrine statue","MIMIC","Echo well","moonlit shard; old inscription"],["ooze_patrol","Hungry cavern ooze","MONSTER","Ooze pool","alchemical residue; salvaged glass vial"],["spore_stalker","Spore-stalked crawler","MONSTER","Spore vents","glowing spores; fungus samples"]],
 moonstone_refuge:[["mimic_book","Mimic disguised as a prayer book","MIMIC","Sanctuary","sealed page; silver thread"],["shadow_raider","Shadow raider","MONSTER","Sealed door","worn clasp; salvage"]],
 spore_bridge:[["mimic_crate","Mimic disguised as a supply crate","MIMIC","Bridge","rope hook; travel supplies"],["fungal_hunter","Fungal hunter","MONSTER","Spore vents","spore pod; mushroom sample"]],
 sword_coast_refuge:[["mimic_coffer","Mimic disguised as a merchant coffer","MIMIC","Market","trade token; small coins"],["road_bandits","Road bandit ambush","MONSTER","Gate","abandoned equipment; travel rations"]],
 dragon_council:[["mimic_pedestal","Mimic disguised as a display pedestal","MIMIC","Records","decorative gem fragment; scroll case"],["cult_scouts","Cult scouts","MONSTER","Sentinels","coded note; insignia"]],
 avernus_embassy:[["mimic_contract","Mimic disguised as a contract chest","MIMIC","Contract archive","infernal ink vial; scorched seal"],["infernal_patrol","Infernal patrol","MONSTER","Guard","broken insignia; infernal scrap"]],
 wildspace_relay:[["mimic_console","Mimic disguised as a storage console","MIMIC","Relay","relay coil; astral dust"],["void_scavenger","Void scavenger","MONSTER","Dock","salvage component; crystal splinter"]],
 sigil_concordance:[["mimic_keybox","Mimic disguised as a keybox","MIMIC","Key archive","portal chalk; brass token"],["portal_rogues","Portal rogues","MONSTER","Portal","stolen map scrap; trade token"]],
 ravenloft_moonfall:[["mimic_coffin","Mimic disguised as a ceremonial coffin","MIMIC","Gatehouse","weathered ring; funerary charm"],["mist_stalker","Mist stalker","MONSTER","Mists","silvered scrap; mist crystal"]]
});
function hash(seed){let h=2166136261;for(const c of seed){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0}
function previewRandomEncounter({mapId,visitSequence=1,seed="moonveil",level=1,era="ORIGIN"}={}){
 if(typeof mapId!=="string"||!listAtlasMaps().some(m=>m.id===mapId)||!Number.isSafeInteger(visitSequence)||visitSequence<1||visitSequence>100000||typeof seed!=="string"||seed.length<1||seed.length>100||!Number.isSafeInteger(level)||level<1||level>30||!["ORIGIN","REVISIT","LATER_ERA","ENDGAME"].includes(era))throw new TypeError("INVALID_ENCOUNTER_PREVIEW");
 const options=TABLES[mapId],roll=hash([mapId,visitSequence,seed,era].join(":"))%100;
 const pick=options[hash([seed,mapId,visitSequence,"selection"].join(":"))%options.length];
 const encounter=roll<20?null:{id:pick[0],name:pick[1],kind:pick[2],location:pick[3],sourceStatus:"MOONVEIL_HOMEBREW_ENCOUNTER",levelGuidance:level,lootCandidates:pick[4].split("; "),mimicDisguise:pick[2]==="MIMIC",requiresDmApproval:true};
 return {mapId,visitSequence,era,roll,encounter,encounterTriggered:false,combatStarted:false,lootGranted:false,xpGranted:0,inventoryChanged:false,worldChanged:false,dmApprovalRequired:true,warning:"Loot candidates are not guaranteed drops. DM validates encounter balance, item ownership and chronology."};
}
module.exports={previewRandomEncounter};
