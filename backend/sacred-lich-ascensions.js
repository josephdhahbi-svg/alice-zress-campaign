"use strict";
/** Proposed heroic lich ascension dossiers. No transformations are granted here. */
const ASCENSIONS=Object.freeze([
 {id:"moonveil_witch",name:"Moonveil Witch",patron:"Selune",sacrifice:"PROTECTION",title:"The Sacrifice of Protection",path:["LICH","ARCHLICH","CHOSEN","CELESTIAL_ASPECT"],levelGate:17,canonStatus:"HOMEBREW_PROPOSAL",approved:false,
  objectives:["Protect innocent lives from a catastrophic threat","Make an informed irreversible personal sacrifice","Survive the consequences without exploiting others","Demonstrate sustained compassion and restraint","Receive independently adjudicated divine recognition"]},
 {id:"alice_zress",name:"Alice Z'ress",patron:"Eilistraee",sacrifice:"FREEDOM",title:"The Sacrifice of Freedom",path:["ELDRITCH_LICH","ARCH_ELDRITCH_LICH","CHOSEN","CELESTIAL_ASPECT"],levelGate:17,canonStatus:"HOMEBREW_PROPOSAL",approved:false,
  objectives:["Liberate captive souls without sacrificing innocents","Choose the cost with full knowledge and free will","Reject coercion and the temptation to dominate","Protect the newly freed through lasting action","Receive independently adjudicated divine recognition"]},
 {id:"starweave_necromancer",name:"Starweave Necromancer",patron:"Mystra",sacrifice:"KNOWLEDGE",title:"The Sacrifice of Knowledge",path:["LICH","ARCHLICH","CHOSEN","CELESTIAL_ASPECT"],levelGate:17,canonStatus:"HOMEBREW_PROPOSAL",approved:false,
  objectives:["Preserve endangered knowledge of the Weave","Sacrifice personal mortality to avert catastrophe","Prevent the protected knowledge from enabling atrocities","Teach and safeguard magic for the benefit of others","Receive independently adjudicated divine recognition"]}
].map(x=>Object.freeze({...x,path:Object.freeze(x.path),objectives:Object.freeze(x.objectives)})));
function listSacredAscensions(){return ASCENSIONS.map(x=>({...x,path:[...x.path],objectives:[...x.objectives]}));}
function getSacredAscension(id){return listSacredAscensions().find(x=>x.id===id)||null;}
function evaluateSacredAscension(id,record={}){
 const path=getSacredAscension(id);
 if(!path)return {allowed:false,reason:"UNKNOWN_ASCENSION"};
 if(!record||typeof record!=="object"||Array.isArray(record))return {allowed:false,reason:"INVALID_EVIDENCE"};
 const level=record.level;
 if(!Number.isSafeInteger(level)||level<path.levelGate)return {allowed:false,reason:"LEVEL_GATE_UNMET"};
 if(record.dmApproved!==true||record.divineReviewApproved!==true)return {allowed:false,reason:"DM_AND_DIVINE_REVIEW_REQUIRED"};
 if(!Array.isArray(record.verifiedObjectives)||path.objectives.some((_,i)=>record.verifiedObjectives[i]!==true))return {allowed:false,reason:"SACRIFICE_EVIDENCE_INCOMPLETE"};
 return {allowed:false,reason:"PROPOSAL_ONLY_NO_TRANSFORMATION_ENGINE",reviewReady:true,requiredPath:path.path};
}
module.exports={listSacredAscensions,getSacredAscension,evaluateSacredAscension};
