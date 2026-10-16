"use strict";
/** Future planar holdings inspired by Moonveil builder intake. Lore, not unlocked locations. */
const HOLDINGS=Object.freeze([
 {id:"alice_pit_sanctuary",name:"The Primordial Pit Hole",owner:"Alice Z'ress",kind:"ELDRITCH_LICH_SANCTUARY",plane:"Underdark / Rabbit Hole",anchor:"Pit of Ghaunadaur",status:"FUTURE_LOCKED",requirement:"DM-approved Eldritch Lich quest and sacrifice",description:"Alice's eventual phylactery sanctuary is the Rabbit Hole reached through the Pit, not the entire Far Realm."},
 {id:"arcanum_prime",name:"Arcanum Prime — Infinite Spell Citadel",owner:"UNASSIGNED_ARCHWIZARD",kind:"WIZARD_FORTRESS",plane:"Astral Sea",anchor:"Sapphire Leyline Node",status:"PROPOSED",requirement:"Owner, era and construction evidence required",description:"Floating towers and spellbook sentinels surround an experimental Weave citadel."},
 {id:"maw_elder_slime",name:"The Maw of the Elder Slime",owner:"Ghaunadaur faction",kind:"ELDRITCH_LAIR",plane:"UNCONFIRMED",anchor:"Ghaunadaur's Pulsing Core Node",status:"PROPOSED",requirement:"DM-approved faction territory and chronological placement",description:"An organic lair of ooze tides, identity echoes and violet corruption mist."},
 {id:"infinite_horizon",name:"The Infinite Horizon Citadel",owner:"UNASSIGNED_PLANAR_ARCHON",kind:"PLANAR_CITADEL",plane:"Astral Eternum (homebrew)",anchor:"Platinum Astral Convergence Node",status:"PROPOSED",requirement:"DM-approved cosmology and timeline",description:"Fractal towers and astral wardens suspended above mirrored planar horizons."}
].map(x=>Object.freeze(x)));
const STATES=Object.freeze(["QUIESCENT","PULSING","HUNGRY","RESURRECTION","ASCENSION"]);
function listFuturePlanarHoldings(){return HOLDINGS.map(x=>({...x,canonStatus:"MOONVEIL_HOMEBREW",accessGranted:false,mutationAllowed:false}));}
function previewFuturePlanarHolding(id,state="QUIESCENT"){
 if(!STATES.includes(state))throw new TypeError("INVALID_STATE");
 const holding=HOLDINGS.find(x=>x.id===id);
 return holding?{holding:{...holding,canonStatus:"MOONVEIL_HOMEBREW"},requestedState:state,allowed:false,reason:"DM_QUEST_PREREQUISITES_REQUIRED",effect:"NONE",resurrection:false,mutationPoints:0,rewards:[]}:null;
}
module.exports={listFuturePlanarHoldings,previewFuturePlanarHolding};
