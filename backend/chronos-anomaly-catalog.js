"use strict";
/** Chronos LEGO intake: proposed anomalies only; no timeline writes or artifact grants. */
const ANOMALIES=Object.freeze([
 {id:"anomaly_bhaalspawn_rupture",title:"The Bhaalspawn Crisis Time Loop",era:"1368 DR Baldur's Gate Era",severity:8,stabilizer:"item_tardis_chronometer",collapseRiskPercent:75,plane:"Toril / Baldur's Gate",chronology:"UNVERIFIED"},
 {id:"anomaly_spellplague_fracture",title:"The Blue Fire Spellplague Rift",era:"1385 DR Spellplague Era",severity:9,stabilizer:"item_mystra_azure_shard",collapseRiskPercent:85,plane:"Toril / Weave",chronology:"PROPOSED"},
 {id:"anomaly_strahd_eternal_night",title:"Barovian Endless Twilight Loop",era:"Curse of Strahd Gothic Era",severity:6,stabilizer:"item_blood_iron_crown",collapseRiskPercent:60,plane:"Barovia / Domains of Dread",chronology:"UNVERIFIED"},
 {id:"anomaly_modron_march_glitch",title:"The Great Modron Discrepancy",era:"Mechanus Clockwork Epoch",severity:5,stabilizer:"item_modron_chrono_gear",collapseRiskPercent:45,plane:"Mechanus",chronology:"UNVERIFIED"}
].map(x=>Object.freeze(x)));
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
function listChronosAnomalies(){return ANOMALIES.map(a=>({...a,canonStatus:"HOMEBREW_PROPOSAL",status:"UNRESOLVED",timelineMutated:false}));}
function previewChronosStabilization({anomalyId,characterId,chronoBonus=0,d20Roll=10}={}){
 if(typeof anomalyId!=="string"||!ID.test(anomalyId)||typeof characterId!=="string"||!ID.test(characterId)||!Number.isSafeInteger(chronoBonus)||chronoBonus < -20||chronoBonus>40||!Number.isSafeInteger(d20Roll)||d20Roll<1||d20Roll>20)throw new TypeError("INVALID_CHRONOS_INPUT");
 const anomaly=ANOMALIES.find(a=>a.id===anomalyId);
 if(!anomaly)return null;
 const targetDC=10+anomaly.severity;
 return {anomaly:{...anomaly,canonStatus:"HOMEBREW_PROPOSAL"},characterId,d20Roll,chronoBonus,totalCheck:d20Roll+chronoBonus,targetDC,checkWouldSucceed:d20Roll+chronoBonus>=targetDC,requiresDmApproval:true,stabilizerOwnershipVerified:false,chronologyVerified:false,allowed:false,applied:false,timelineMutated:false,rewards:[],effect:"NONE"};
}
module.exports={listChronosAnomalies,previewChronosStabilization};
