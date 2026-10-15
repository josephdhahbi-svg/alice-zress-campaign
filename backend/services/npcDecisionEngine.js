'use strict';
// Pure NPC decision planner. Outputs proposals, never commits actions.
const {beliefsAt}=require('./knowledgeBeliefEngine');
const ACTIONS=Object.freeze(['WORK','TRADE','INVESTIGATE','TRAVEL','SOCIALIZE','REST']);
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,127}$/;
const cap=x=>Math.max(0,Math.min(100,x));
function planNpc(npc,context){
 if(!npc||!ID.test(npc.id||'')||!Number.isSafeInteger(context?.hour)||context.hour<0)throw new TypeError('Invalid NPC or clock');
 if(!context.beliefs||!Array.isArray(context.jobs))throw new TypeError('Missing world projections');
 const needs=npc.needs||{},goals=npc.goals||{};
 for(const k of ['hunger','fatigue','funds'])if(!Number.isFinite(needs[k])||needs[k]<0||needs[k]>100)throw new RangeError('Invalid need '+k);
 const known=beliefsAt(context.beliefs,npc.id,context.hour);
 const credible=known.filter(b=>b.confidence>=50);
 const job=context.jobs.filter(j=>j.npcRole===npc.role);
 const scores={
  WORK:20+(goals.immediate==='WORK'?30:0)+(goals.shortTerm==='OPEN_SHOP'?15:0),
  TRADE:10+(needs.hunger>60?30:0)+(needs.funds>40?10:0),
  INVESTIGATE:5+(credible.length?20:0)+(job.some(j=>j.activity==='DIAGNOSE_SIGNAL'||j.activity==='VERIFY_RUMORS')?65:0),
  TRAVEL:5+(job.some(j=>j.activity==='DELIVER_MESSAGE_PHYSICALLY'||j.activity==='REROUTE_ESSENTIAL_SUPPLIES')?65:0),
  SOCIALIZE:10+(goals.immediate==='SOCIALIZE'?25:0),
  REST:5+Math.round(needs.fatigue*0.75)
 };
 if(needs.hunger>=90)scores.TRADE+=35;
 if(needs.fatigue>=90)scores.REST+=50;
 const ranked=ACTIONS.map(action=>({action,score:cap(scores[action])})).sort((a,b)=>b.score-a.score||ACTIONS.indexOf(a.action)-ACTIONS.indexOf(b.action));
 return {npcId:npc.id,hour:context.hour,proposedAction:ranked[0].action,ranked,knowledgeEventIds:[...new Set(credible.map(b=>b.eventId))].sort(),status:'PROPOSAL_ONLY'};
}
module.exports={ACTIONS,planNpc};
