"use strict";
/** Moonveil homebrew environmental hazards. Previews only: no HP, conditions or round mutation. */
const HAZARDS=Object.freeze([
 {id:"haz_underdark_slime_rain",name:"Bioluminescent Slime Downpour",plane:"Underdark / Pit Hole",dice:"2d6",damageType:"acid",visibilityPenaltyFeet:20,condition:"POISONED"},
 {id:"haz_astral_ion_storm",name:"Wildspace Ion Storm",plane:"Wildspace / Spelljammer Orbit",dice:"3d6",damageType:"lightning",visibilityPenaltyFeet:40,condition:"BLINDED"},
 {id:"haz_shadowfell_necrotic_fog",name:"Weeping Ossuary Necrotic Mist",plane:"Shadowfell / Barovia",dice:"1d10",damageType:"necrotic",visibilityPenaltyFeet:10,condition:"EXHAUSTED"}
].map(x=>Object.freeze(x)));
const IDS=/^[A-Za-z0-9:_-]{1,100}$/;
function listPlanarWeatherHazards(){return HAZARDS.map(h=>({...h,canonStatus:"MOONVEIL_HOMEBREW",mode:"PREVIEW_ONLY"}));}
function previewPlanarWeatherHazard(hazardId,unitId,rounds=5){
 if(typeof unitId!=="string"||!IDS.test(unitId)||!Number.isSafeInteger(rounds)||rounds<1||rounds>20)throw new TypeError("INVALID_INPUT");
 const hazard=HAZARDS.find(x=>x.id===hazardId);
 if(!hazard)return null;
 const [,count,faces]=/^(\d+)d(\d+)$/.exec(hazard.dice);
 const low=Number(count),high=low*Number(faces);
 return {hazard:{...hazard,canonStatus:"MOONVEIL_HOMEBREW"},unitId,rounds,
  damagePerRound:{min:low,max:high,damageType:hazard.damageType},
  totalPotentialDamage:{min:low*rounds,max:high*rounds},
  conditionProposed:hazard.condition,visibilityPenaltyFeet:hazard.visibilityPenaltyFeet,
  requiresDmAdjudication:true,applied:false,effect:"NONE",rewards:[]};
}
module.exports={listPlanarWeatherHazards,previewPlanarWeatherHazard};
