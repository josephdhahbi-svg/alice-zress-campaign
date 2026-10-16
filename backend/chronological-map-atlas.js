"use strict";
const definitions=[
 ["pit_ghaunadaur","Pit of Ghaunadaur","Underdark","Material Plane","########|#E.M.S.#|#.##...#|#O.W.C.#|########","E:Rabbit-hole entrance;M:Moonstone;S:Spore vents;O:Ooze pool;W:Echo well;C:Captive"],
 ["moonstone_refuge","Moonstone Refuge","Underdark","Material Plane","########|#E.M...#|#.C.S..#|#...D..#|########","E:Entry;M:Moonstone;C:Captives;S:Sanctuary;D:Sealed door"],
 ["spore_bridge","Spore Bridge","Underdark","Material Plane","########|#E.S...#|#..BB..#|#W..X..#|########","E:Entry;S:Spores;B:Bridge;W:Well;X:Exit"],
 ["sword_coast_refuge","Sword Coast Refuge","Sword Coast","Material Plane","########|#E.T...#|#H.C.M.#|#...D..#|########","E:Gate;T:Tavern;H:Shelter;C:Council;M:Market;D:Docks"],
 ["dragon_council","Dragon Council Approach","Faerun","Material Plane","########|#E.S...#|#C.R.H.#|#...X..#|########","E:Entry;S:Sentinels;C:Council;R:Records;H:Hatchlings;X:Exit"],
 ["avernus_embassy","Avernus Embassy","Avernus","Nine Hells","########|#E.G...#|#C.F.R.#|#...X..#|########","E:Entry;G:Guard;C:Contracts;F:Witness;R:Redemption;X:Exit"],
 ["wildspace_relay","Wildspace Moonbridge Relay","Wildspace","Wildspace","########|#E.N...#|#R.I.S.#|#...X..#|########","E:Dock;N:Navigation;R:Relay;I:Ion monitor;S:Safety;X:Exit"],
 ["sigil_concordance","Sigil Concordance Hall","Sigil","Outlands / Sigil","########|#E.P...#|#C.K.W.#|#...X..#|########","E:Entry;P:Portal;C:Concordance;K:Keys;W:Wayfarers;X:Exit"],
 ["ravenloft_moonfall","Castle Ravenloft Approach","Barovia","Domains of Dread","########|#E.M...#|#G.A.C.#|#...X..#|########","E:Entry;M:Mists;G:Gatehouse;A:Abbey signal;C:Castle;X:Exit"]
];
const maps=definitions.map(([id,name,region,plane,tiles,legend])=>({id,name,region,plane,grid:tiles.split("|"),legend:Object.fromEntries(legend.split(";").map(x=>x.split(":"))),scale:"SCHEMATIC",sourceStatus:"HOMEBREW",drDate:"UNVERIFIED"}));
function listAtlasMaps(){return maps.map(m=>({...m,grid:[...m.grid],legend:{...m.legend}}));}
function previewAtlasVisit(id,{era="ORIGIN",level=1,drDate=null,visitSequence=1,availableFlags=[]}={}){
 if(!/^[a-z0-9_]{3,100}$/.test(id)||!["ORIGIN","REVISIT","LATER_ERA","ENDGAME"].includes(era)||!Number.isInteger(level)||level<1||level>30||!Number.isInteger(visitSequence)||visitSequence<1||visitSequence>100000||drDate!==null&&!/^[0-9]{1,5} DR$/.test(drDate)||!Array.isArray(availableFlags)||availableFlags.length>100||availableFlags.some(x=>typeof x!=="string"||!/^[A-Z0-9_]{1,100}$/.test(x)))throw new TypeError("INVALID_MAP_VISIT");
 if(!maps.some(m=>m.id===id))return null;
 const hooks=[["inspect","Survey the site",[]],["dialogue","Revisit conversations",["DIALOGUE_UNLOCKED"]],["item","Return with quest item",["QUEST_ITEM_VERIFIED"]],["spell","Try newly learned spell",["SPELL_KNOWN_VERIFIED"]],["history","Investigate alternate era",["CHRONOS_DM_APPROVED"]]].map(([key,label,requires])=>({key,label,requires,ready:requires.every(f=>availableFlags.includes(f)),applied:false}));
 return {mapId:id,era,level,drDate,visitSequence,hooks,levelGateMet:level>=({ORIGIN:1,REVISIT:1,LATER_ERA:10,ENDGAME:28}[era]),dateVerified:false,returnAllowed:"DM_REVIEW_REQUIRED",travelPerformed:false,worldChanged:false,timelineChanged:false,rewards:[]};
}
module.exports={listAtlasMaps,previewAtlasVisit};
