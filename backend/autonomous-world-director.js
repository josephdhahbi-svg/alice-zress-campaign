"use strict";
/** Deterministic, read-only autonomous world proposals. Never mutates campaign state. */
const taverns=require("./omniversal-tavern-catalog");
const shrines=require("./divine-shrine-catalog");
const characters=require("./omniversal-quest-character-catalog");
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
const ACTIONS=["OPEN_SHOP","POST_RUMOR","MAINTAIN_SHRINE","RESTOCK","REPAIR","PATROL","STUDY","OFFER_GUIDANCE"];
function hash(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function simulateTick({campaignId,book,traversal=1,tickKey,drYear=null,limit=12}){
 if(typeof campaignId!=="string"||!ID.test(campaignId)||typeof tickKey!=="string"||!ID.test(tickKey)||!Number.isInteger(book)||book<1||book>30||!Number.isInteger(traversal)||traversal<1||traversal>7||!Number.isInteger(limit)||limit<1||limit>50||drYear!==null&&!Number.isInteger(drYear))throw TypeError("INVALID_SIMULATION_TICK");
 const inns=taverns.listTaverns({book}).taverns;
 const holy=shrines.listShrines({book});
 const npcs=characters.listCharacters().characters;
 const seed=hash([campaignId,book,traversal,tickKey].join(":"));
 const candidates=[
 ...inns.map((t,i)=>({agentId:`innkeeper:${t.id}`,siteId:t.id,kind:"TAVERN",name:t.proprietor.name,action:ACTIONS[(seed+i)%5],description:`At ${t.name}, ${t.proprietor.name} prepares a local activity for the next watch.`,proposedEffect:"NARRATIVE_ONLY",sourceStatus:"HOMEBREW",canonCheck:"LOCATION_AND_DATE_REVIEW_REQUIRED"})),
 ...holy.map((s,i)=>({agentId:`caretaker:${s.id}`,siteId:s.id,kind:"SHRINE",name:`Caretaker of ${s.deity}`,action:i%2?"OFFER_GUIDANCE":"MAINTAIN_SHRINE",description:`The caretaker tends ${s.name}; divine intervention is not presumed.`,proposedEffect:"NARRATIVE_ONLY",sourceStatus:"HOMEBREW",canonCheck:"DEITY_MANIFESTATION_NOT_AUTHORIZED"})),
 ...npcs.slice((book-1)*3,(book-1)*3+3).map((c,i)=>({agentId:c.id,siteId:null,kind:"QUEST_NPC",name:c.name,action:i%2?"PATROL":"STUDY",description:`${c.name} prepares for the next phase of their quest chain.`,proposedEffect:"NARRATIVE_ONLY",sourceStatus:"HOMEBREW",canonCheck:"NPC_PRESENCE_NOT_VERIFIED"}))
 ];
 const proposals=candidates.slice(0,limit).map((x,i)=>({...x,proposalId:`world:${tickKey}:${i+1}`,book,traversal,drYear,requiresDmApproval:true,applied:false}));
 return {campaignId,book,traversal,tickKey,drYear,mode:"PREVIEW_ONLY",proposals,appliedCount:0,canonPolicy:"FAIL_CLOSED",note:"No scheduling, NPC movement, rewards, inventory changes, quest progress or divine manifestations are executed."};
}
module.exports={simulateTick};
