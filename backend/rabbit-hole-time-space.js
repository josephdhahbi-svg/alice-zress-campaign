"use strict";
/**
 * Rabbit Hole time-space itinerary planner. Plans are not movement commands.
 * No player-controlled date/plane parameter can change persisted campaign state.
 */
const {getWorldNode}=require("./multiverse-adventure-index");
const MAX_DR=100000,MIN_DR=-100000;
const eras=Object.freeze([
 Object.freeze({id:"ancient",label:"Ancient Realms",dr:null,canonStatus:"CHRONOLOGY_REVIEW"}),
 Object.freeze({id:"netheril",label:"Netherese Age",dr:null,canonStatus:"CHRONOLOGY_REVIEW"}),
 Object.freeze({id:"modern",label:"Modern Faerûn",dr:1492,canonStatus:"CAMPAIGN_PROPOSAL"}),
 Object.freeze({id:"future",label:"Possible Futures",dr:null,canonStatus:"HOMEBREW_PROPOSAL"}),
 Object.freeze({id:"timeless",label:"Outside Linear Time",dr:null,canonStatus:"HOMEBREW_PROPOSAL"})
]);
const methods=Object.freeze(["RABBIT_HOLE","PLANAR_PORTAL","SPELLJAMMER","MISTS","SIGIL_DOOR","CHRONAL_GATE"]);
const validId=v=>typeof v==="string"&&/^[a-z0-9_]{1,80}$/.test(v);
function planTimeSpaceJourney({from="pit_ghaunadaur",to,departureDr=null,arrivalDr=null,method="RABBIT_HOLE",portalEvidence=null}={}){
 if(!validId(from)||!validId(to)||!getWorldNode(from)||!getWorldNode(to))
  return {allowed:false,reason:"UNKNOWN_LOCATION"};
 if(!methods.includes(method))return {allowed:false,reason:"UNKNOWN_TRAVEL_METHOD"};
 for(const year of [departureDr,arrivalDr])
  if(year!==null&&(!Number.isSafeInteger(year)||year<MIN_DR||year>MAX_DR))
   return {allowed:false,reason:"INVALID_DR_DATE"};
 const target=getWorldNode(to),origin=getWorldNode(from);
 const crossEra=departureDr!==null&&arrivalDr!==null&&departureDr!==arrivalDr;
 const crossPlane=origin.plane!==target.plane;
 const requiresApproval=target.status==="LOCKED"||target.status==="CONDITIONAL"||target.status==="OPTIONAL_HOMEBREW"||crossEra||crossPlane;
 return {
  allowed:false,reason:"DM_AUTHORIZATION_AND_CANON_REVIEW_REQUIRED",
  preview:{from,to,method,departureDr,arrivalDr,crossEra,crossPlane,requiresApproval,
   targetStatus:target.status,canonStatus:target.canonStatus,
   requirements:["Verified route discovery","Era-specific source and character existence checks","DM approval","Server-owned travel event and revision","Paradox and causality review"],
   portalEvidenceSupplied:typeof portalEvidence==="string"&&portalEvidence.length>0},
  sideEffects:"NONE"
 };
}
function listTimeSpaceEras(){return eras;}
function listTravelMethods(){return methods;}
module.exports={planTimeSpaceJourney,listTimeSpaceEras,listTravelMethods};
