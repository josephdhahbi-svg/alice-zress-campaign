"use strict";
/** Connected world navigation catalog: read-only planning, no teleport or time advancement. */
const {listAscensionPaths}=require("./ascension-path-catalog");
const places=[
 {id:"rabbit_hole",name:"The Rabbit Hole",plane:"TRANSITION",era:"UNRESOLVED",status:"ORIGIN",from:[],route:"Alice's initial fall",risk:"Time-space instability"},
 {id:"pit_ghaunadaur",name:"Pit of Ghaunadaur",plane:"MATERIAL",region:"Underdark",era:"UNRESOLVED",status:"START",from:["rabbit_hole"],route:"Fall through the Rabbit Hole",risk:"Ghaunadaur's influence"},
 {id:"underdark",name:"Underdark",plane:"MATERIAL",region:"Faerûn",era:"UNRESOLVED",status:"DISCOVERABLE",from:["pit_ghaunadaur"],route:"Explore caverns",risk:"Unknown tunnels"},
 {id:"promenade",name:"Promenade of the Dark Maiden",plane:"MATERIAL",region:"Underdark",era:"CHRONOLOGY_REVIEW",status:"CONDITIONAL",from:["underdark"],route:"Find Eilistraeen guides; validate era",risk:"Canon availability"},
 {id:"abyss",name:"The Abyss",plane:"ABYSS",era:"UNRESOLVED",status:"LOCKED",from:["underdark"],route:"Earn or discover a safe planar passage",risk:"Demon lords"},
 {id:"avernus",name:"Avernus",plane:"NINE_HELLS",era:"UNRESOLVED",status:"LOCKED",from:["abyss"],route:"Unlock a verified planar route",risk:"Infernal bargains"},
 {id:"faerun",name:"Faerûn Surface",plane:"MATERIAL",era:"UNRESOLVED",status:"DISCOVERABLE",from:["underdark"],route:"Locate a surface passage",risk:"Faction conflict"},
 {id:"spelljammer",name:"Wildspace and Astral Sea",plane:"ASTRAL",era:"UNRESOLVED",status:"LOCKED",from:["faerun"],route:"Secure a spelljamming vessel",risk:"Void navigation"},
 {id:"ravenloft",name:"Domains of Dread",plane:"SHADOWFELL",era:"UNRESOLVED",status:"LOCKED",from:["faerun"],route:"Discover a mist passage",risk:"Domain borders"},
 {id:"sigil",name:"Sigil, City of Doors",plane:"OUTLANDS",era:"UNRESOLVED",status:"LOCKED",from:["spelljammer","ravenloft"],route:"Find an authenticated portal key",risk:"Portal restrictions"},
 {id:"nhalruun",name:"Nhal'Ruun Grove",plane:"UNVERIFIED",era:"1492 DR PROPOSED",status:"OPTIONAL_HOMEBREW",from:["faerun"],route:"DM-approved side adventure only",risk:"Location and chronology unverified"}
];
const worlds=Object.freeze(places.map(p=>Object.freeze({...p,from:Object.freeze(p.from),canonStatus:p.status==="OPTIONAL_HOMEBREW"?"HOMEBREW_PROPOSAL":"CHRONOLOGY_REVIEW"})));
function listWorldRoutes(){return worlds;}
function availableRouteLeads(from){return worlds.filter(p=>p.from.includes(from)).map(p=>({id:p.id,name:p.name,status:p.status,route:p.route,risk:p.risk}));}
function getWorldNode(id){return worlds.find(p=>p.id===id)||null;}
function getMultiverseAdventureIndex(){return {origin:"rabbit_hole",startingLocation:"pit_ghaunadaur",characterId:"alice_zress",trilogies:10,books:30,traversals:7,paths:listAscensionPaths().map(p=>({id:p.id,faction:p.faction,approval:p.canonStatus})),nodes:worlds};}
module.exports={listWorldRoutes,availableRouteLeads,getWorldNode,getMultiverseAdventureIndex};
