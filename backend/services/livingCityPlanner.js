'use strict';
// Deterministic read-only bridge between incident projections and NPC decisions.
const {planNpc}=require('./npcDecisionEngine');
const {incidentOpportunities}=require('./incidentOpportunities');
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,127}$/;
function planCityTurn({city,npcs,beliefs,hour}){
 if(!Number.isSafeInteger(hour)||hour<0||!Array.isArray(npcs)||!beliefs)throw new TypeError('Invalid turn');
 const ids=new Set();
 for(const npc of npcs){if(!npc||!ID.test(npc.id||'')||ids.has(npc.id))throw new TypeError('Invalid or duplicate NPC ID');ids.add(npc.id);}
 const opportunities=incidentOpportunities(city);
 const proposals=[...npcs].sort((a,b)=>a.id.localeCompare(b.id)).map(npc=>planNpc(npc,{hour,beliefs,jobs:opportunities.jobs}));
 return {status:'PROPOSALS_ONLY',cityRevision:city.revision??null,hour,proposals,questHooks:opportunities.quests,rumors:opportunities.rumors};
}
module.exports={planCityTurn};
