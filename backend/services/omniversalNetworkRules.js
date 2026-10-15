'use strict';
// Deterministic read-model and validation for a future transactional world engine.
const MODES=Object.freeze({
 telecom_ley_line:{name:'Ley-Line Resonance Comm-Array',kind:'COMMUNICATION',energyCost:5,durationTicks:0,requiresSignal:true},
 portal_non_euclidean:{name:'Far Realm Non-Euclidean Portal',kind:'TRAVEL',energyCost:25,durationTicks:1,requiresSignal:false},
 transit_doom_buggy:{name:'Underdark Doom Buggy Rail',kind:'PHYSICAL_TRANSIT',energyCost:0,durationTicks:3,requiresSignal:false},
 telecom_dream_whisper:{name:'Wonderland Dream-Weave Echo',kind:'COMMUNICATION',energyCost:10,durationTicks:1,requiresSignal:false}
});
const SEVERITIES=Object.freeze(['LOW','MEDIUM','HIGH','CRITICAL']);
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function validateDispatch({characterId,originSectorId,destinationSectorId,transitModeKey,energyAvailable,unlockedModes=[],jammers=[]}={}){
 for(const id of [characterId,originSectorId,destinationSectorId])if(typeof id!=='string'||!ID.test(id))throw new TypeError('Invalid ID');
 if(!Object.hasOwn(MODES,transitModeKey))throw new RangeError('Unknown transit mode');
 const mode=MODES[transitModeKey];
 if(!unlockedModes.includes(transitModeKey))return {allowed:false,reason:'LOCKED',mode};
 if(!Number.isSafeInteger(energyAvailable)||energyAvailable<0)throw new RangeError('Invalid energy');
 if(energyAvailable<mode.energyCost)return {allowed:false,reason:'INSUFFICIENT_ENERGY',mode};
 if(mode.kind!=='COMMUNICATION'&&originSectorId===destinationSectorId)return {allowed:false,reason:'SAME_SECTOR',mode};
 if(mode.requiresSignal&&jammers.some(j=>j.sectorId===originSectorId&&j.status==='ACTIVE'&&['HIGH','CRITICAL'].includes(j.severity)))
  return {allowed:false,reason:'SIGNAL_JAMMED',mode};
 return {allowed:true,reason:null,mode};
}
function projectJammer(state,event){
 if(!event||!ID.test(event.sectorId||''))throw new TypeError('Invalid sector');
 if(!['JAMMER_DEPLOYED','JAMMER_CLEARED'].includes(event.type))throw new RangeError('Invalid jammer event');
 if(event.type==='JAMMER_DEPLOYED'&&!SEVERITIES.includes(event.severity))throw new RangeError('Invalid severity');
 const next={...state};
 if(event.type==='JAMMER_DEPLOYED')next[event.sectorId]={sectorId:event.sectorId,severity:event.severity,status:'ACTIVE',sourceEntity:event.sourceEntity||'UNKNOWN'};
 else if(next[event.sectorId])next[event.sectorId]={...next[event.sectorId],status:'CLEARED'};
 return next;
}
function geopoliticalTicker({regionName,rulingHouse,politicalClimate,environmentalHazard}={}){
 return {regionName:regionName||'Unknown region',rulingHouse:rulingHouse||'Unknown governance',
 politicalClimate:politicalClimate||'Unreported',environmentalHazard:environmentalHazard||'No confirmed report',source:'WORLD_STATE_PROJECTION'};
}
module.exports={MODES,SEVERITIES,validateDispatch,projectJammer,geopoliticalTicker};
