"use strict";
/** Alice's Rabbit Hole is the demiplane itself, entered at the Pit of Ghaunadaur. */
const NODE=Object.freeze({
 id:"alice_rabbit_hole",name:"Alice's Rabbit Hole",kind:"PERSONAL_ELDRITCH_DEMIPLANE",
 entranceNode:"pit_ghaunadaur",entrancePlane:"MATERIAL",entranceRegion:"UNDERDARK",
 identity:"THE_HOLE_ITSELF",eldritchInfluence:"FAR_REALM",ownerCharacter:"alice_zress",
 origin:"GHAUNADAUR_TOUCH_AND_THREE_GIFTS",canonStatus:"MOONVEIL_HOMEBREW",
 access:"LOCKED_DM_EVIDENCE_REQUIRED",ascension:"NOT_EARNED",
 connections:Object.freeze(["pit_ghaunadaur","far_realm","astral","shadowfell","feywild","outer_planes"])
});
function getAliceDemiplane(){return {...NODE,connections:[...NODE.connections]};}
function previewAliceDemiplaneAccess({currentNode,approvedEvidence}={}){
 if(currentNode!=="pit_ghaunadaur")return {allowed:false,reason:"NOT_AT_PHYSICAL_ENTRANCE",destination:NODE.id};
 if(approvedEvidence!==true)return {allowed:false,reason:"DM_PORTAL_EVIDENCE_REQUIRED",destination:NODE.id};
 return {allowed:false,reason:"AUTHORITATIVE_TRAVEL_ENGINE_REQUIRED",destination:NODE.id};
}
module.exports={getAliceDemiplane,previewAliceDemiplaneAccess};
