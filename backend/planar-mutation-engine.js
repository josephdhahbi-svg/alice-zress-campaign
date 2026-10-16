"use strict";
/** Moonveil homebrew mutation ecology. Read-only forecasts, never character changes. */
const {listPlanarWeatherHazards}=require("./planar-weather-engine");
const IDS=/^[A-Za-z0-9:_-]{1,100}$/;
const BLOOMS=Object.freeze([
 Object.freeze({id:"bloom_elder_eye",name:"Eldritch Growth Bloom",plane:"Underdark / Pit Hole",hazardId:"haz_underdark_slime_rain",faction:"Ghaunadaur",stage:"DORMANT",description:"Bioluminescent fungal tendrils coil around ancient stone without changing any creature."}),
 Object.freeze({id:"bloom_astral_spores",name:"Astral Spore Wake",plane:"Wildspace / Spelljammer Orbit",hazardId:"haz_astral_ion_storm",faction:"UNCLAIMED",stage:"DORMANT",description:"Iridescent spores drift along ionized Weave currents."}),
 Object.freeze({id:"bloom_shadow_roots",name:"Ossuary Root Veil",plane:"Shadowfell / Barovia",hazardId:"haz_shadowfell_necrotic_fog",faction:"UNCLAIMED",stage:"DORMANT",description:"Pale roots trace abandoned crypt walls beneath the mists."})
]);
const STAGES=Object.freeze(["DORMANT","SPROUTING","BLOOMING","WITHERING"]);
function listPlanarMutationBlooms(){return BLOOMS.map(x=>({...x,canonStatus:"MOONVEIL_HOMEBREW",version:"v1",mode:"PREVIEW_ONLY"}));}
function previewPlanarMutation({bloomId,unitId,weatherHazardId,stage="SPROUTING",rounds=1}={}){
 if(typeof bloomId!=="string"||!IDS.test(bloomId)||typeof unitId!=="string"||!IDS.test(unitId)||!STAGES.includes(stage)||!Number.isSafeInteger(rounds)||rounds<1||rounds>20)
  throw new TypeError("INVALID_MUTATION_PREVIEW");
 const bloom=BLOOMS.find(x=>x.id===bloomId);
 if(!bloom)return null;
 const hazard=weatherHazardId===undefined?bloom.hazardId:weatherHazardId;
 if(hazard!==bloom.hazardId||!listPlanarWeatherHazards().some(x=>x.id===hazard&&x.plane===bloom.plane))
  throw new TypeError("WEATHER_PLANE_MISMATCH");
 const intensity={DORMANT:0,SPROUTING:1,BLOOMING:2,WITHERING:1}[stage];
 return {bloom:{...bloom,canonStatus:"MOONVEIL_HOMEBREW",version:"v1"},unitId,weatherHazardId:hazard,stage,rounds,
  narrativeIntensity:intensity,possibleQuestHook:stage==="BLOOMING"?"INVESTIGATE_BLOOM":null,
  requiresDmAdjudication:true,applied:false,mutationPoints:0,conditionsApplied:[],characterChanges:[],travelUnlocked:false,
  timelineChanged:false,eventsCreated:[],rewards:[],effect:"NONE"};
}
module.exports={listPlanarMutationBlooms,previewPlanarMutation};
