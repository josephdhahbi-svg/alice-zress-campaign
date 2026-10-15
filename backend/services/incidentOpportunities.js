'use strict';
// Pure read-model: incident consequences create NPC work and heroic quest hooks.
// No inventory, XP or quest completion is granted here.
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function incidentOpportunities(city){
 if(!city||!Number.isInteger(city.tradeReliability)||!Number.isInteger(city.publicTrust)||!Number.isInteger(city.rumorPressure)||!city.jammers)throw new TypeError('Invalid city snapshot');
 const active=Object.values(city.jammers).filter(j=>j.status==='ACTIVE').sort((a,b)=>a.sectorId.localeCompare(b.sectorId));
 const jobs=[],quests=[],rumors=[];
 for(const jammer of active){
  if(!ID.test(jammer.sectorId))throw new TypeError('Invalid sector');
  jobs.push({npcRole:'ENGINEER',sectorId:jammer.sectorId,activity:'DIAGNOSE_SIGNAL',priority:jammer.severity==='CRITICAL'?3:2});
  jobs.push({npcRole:'COURIER',sectorId:jammer.sectorId,activity:'DELIVER_MESSAGE_PHYSICALLY',priority:2});
  quests.push({id:'Q_RESTORE_'+jammer.sectorId,sectorId:jammer.sectorId,status:'AVAILABLE',heroic:true,
   objective:'Investigate and restore the disrupted ley-line without harming civilians'});
  rumors.push({id:'R_BLACKOUT_'+jammer.sectorId,sectorId:jammer.sectorId,claim:'Ley-line communications have failed',verified:true});
 }
 if(city.tradeReliability<65)jobs.push({npcRole:'MERCHANT',sectorId:null,activity:'REROUTE_ESSENTIAL_SUPPLIES',priority:3});
 if(city.rumorPressure>25)jobs.push({npcRole:'SCHOLAR',sectorId:null,activity:'VERIFY_RUMORS',priority:2});
 return {jobs,quests,rumors};
}
module.exports={incidentOpportunities};
