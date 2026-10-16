"use strict";
/** Read-only exploration dossier for Alice's Rabbit Hole demiplane.
 * Rooms are narrative previews; no portal, reward, or quest mutations.
 */
const ROOMS=Object.freeze([
 {id:"threshold",name:"The Threshold",description:"At the Pit of Ghaunadaur, Alice recognizes the same hole through which she fell.",anchor:"pit_ghaunadaur",risk:"Unstable spatial boundary",status:"ORIGIN",choices:["Observe the scar left by Ghaunadaur","Seek Eilistraee's Light","Trace Mystra's Shield","Survey the tunnel safely","Stand guard against the unknown"]},
 {id:"echo_gallery",name:"Gallery of Echoes",description:"Memories of the three gifts shimmer without promising power or altering history.",anchor:"rabbit_hole",risk:"Distorted memories",status:"LOCKED",choices:["Protect a lost echo","Offer comfort to a frightened reflection","Challenge the accusing voices","Compare the three magical signatures","Prepare a ward"]},
 {id:"void_observatory",name:"Void Observatory",description:"An aperture reveals the Far Realm's alien influence without opening a traversable portal.",anchor:"rabbit_hole",risk:"Far Realm resonance",status:"LOCKED",choices:["Shield companions from the sight","Rescue a stranded thought","Defy the whispering void","Study the impossible geometry","Close the viewing aperture"]},
 {id:"silver_azure_nexus",name:"Silver and Azure Nexus",description:"Silver moonlight and azure Weave-light mark the convergence without making Alice another goddess's Chosen.",anchor:"rabbit_hole",risk:"Conflicting planar energies",status:"LOCKED",choices:["Preserve the balance","Guide another soul to safety","Refuse the parasite's bargain","Measure the Weave disturbance","Secure the nexus"]},
 {id:"return_gate",name:"The Return Gate",description:"A sealed return threshold awaits the future sacrifice and DM-approved Eldritch Lich quest.",anchor:"rabbit_hole",risk:"Chronal paradox",status:"LOCKED",choices:["Protect those left behind","Offer a sacrifice freely","Defy the parasite's demand","Review the chronal ledger","Hold the gate against intrusion"]}
].map(x=>Object.freeze({...x,choices:Object.freeze(x.choices)})));
function listAliceDemiplaneRooms(){return ROOMS.map(x=>({...x,choices:[...x.choices],canonStatus:"MOONVEIL_HOMEBREW",access:"DM_REVIEW_REQUIRED"}));}
function getAliceDemiplaneRoom(id){return listAliceDemiplaneRooms().find(x=>x.id===id)||null;}
function previewAliceDemiplaneRoomChoice(roomId,number){
 const room=getAliceDemiplaneRoom(roomId);
 if(!room)return {allowed:false,reason:"UNKNOWN_ROOM"};
 if(!Number.isSafeInteger(number)||number<1||number>5)return {allowed:false,reason:"INVALID_CHOICE"};
 return {allowed:false,reason:"DM_ADJUDICATION_REQUIRED",roomId,choiceNumber:number,text:room.choices[number-1],effect:"NONE",rewards:[]};
}
module.exports={listAliceDemiplaneRooms,getAliceDemiplaneRoom,previewAliceDemiplaneRoomChoice};
