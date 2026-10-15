'use strict';
// Pure, deterministic city projection for validated, ledger-committed world incidents.
// Call only after event validation; persistence belongs to the transaction engine.
const {projectJammer}=require('./omniversalNetworkRules');
const ID=/^[A-Za-z0-9_-]{1,128}$/;
const clamp=n=>Math.max(0,Math.min(100,n));
function initialCityNetwork(){return {revision:0,tradeReliability:70,publicTrust:50,rumorPressure:20,jammers:{},history:[]};}
function applyCityIncident(state,event){
 if(!state||!event||!ID.test(event.eventId||'')||!ID.test(event.commandId||'')||!ID.test(event.sectorId||''))throw new TypeError('Invalid incident identifiers');
 if(!Number.isSafeInteger(event.revision)||event.revision!==state.revision+1)throw new RangeError('Incident revision mismatch');
 if(state.history.some(h=>h.eventId===event.eventId||h.commandId===event.commandId))throw new RangeError('Duplicate incident');
 if(!['JAMMER_DEPLOYED','JAMMER_CLEARED'].includes(event.type))throw new RangeError('Unsupported incident');
 if(event.type==='JAMMER_DEPLOYED'&&state.jammers[event.sectorId]?.status==='ACTIVE')throw new RangeError('Jammer already active');
 if(event.type==='JAMMER_CLEARED'&&state.jammers[event.sectorId]?.status!=='ACTIVE')throw new RangeError('No active jammer to clear');
 const nextJammers=projectJammer(state.jammers,event);
 const delta=event.type==='JAMMER_DEPLOYED'?-1:1;
 const strength=event.type==='JAMMER_DEPLOYED'?
  ({LOW:1,MEDIUM:3,HIGH:6,CRITICAL:10}[event.severity]):3;
 if(!Number.isInteger(strength))throw new RangeError('Invalid severity');
 return {
  ...state,revision:event.revision,jammers:nextJammers,
  tradeReliability:clamp(state.tradeReliability+delta*strength),
  publicTrust:clamp(state.publicTrust+delta*Math.ceil(strength/2)),
  rumorPressure:clamp(state.rumorPressure-delta*strength),
  history:[...state.history,{eventId:event.eventId,commandId:event.commandId,sectorId:event.sectorId,type:event.type}]
 };
}
function replayCityIncidents(events){return events.reduce(applyCityIncident,initialCityNetwork());}
module.exports={initialCityNetwork,applyCityIncident,replayCityIncidents};
