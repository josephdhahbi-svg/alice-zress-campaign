/* Moonveil universal travel graph — prototype, no D&D canon claim. */
(function(root){
"use strict";
const nodes=[
{id:"embercross",name:"Embercross",kind:"town",domain:"homebrew"},
{id:"starglen",name:"Starglen",kind:"village",domain:"homebrew"},
{id:"mistport",name:"Mistport",kind:"city",domain:"homebrew"},
{id:"barovia-crossing",name:"Barovia — Mist Boundary",kind:"domain-gate",domain:"Ravenloft",locked:true},
{id:"darkon-crossing",name:"Darkon — Mist Boundary",kind:"domain-gate",domain:"Ravenloft",locked:true},
{id:"lamordia-crossing",name:"Lamordia — Mist Boundary",kind:"domain-gate",domain:"Ravenloft",locked:true}
];
const routes=[
{id:"starfall",from:"embercross",to:"starglen",mode:"road",days:2,costCp:0,bidirectional:true},
{id:"saltwind",from:"embercross",to:"mistport",mode:"road",days:3,costCp:0,bidirectional:true},
{id:"cliff-trail",from:"starglen",to:"mistport",mode:"road",days:4,costCp:0,bidirectional:true},
{id:"moonrail",from:"embercross",to:"starglen",mode:"subway",days:1,costCp:85,bidirectional:true,requires:["rail-pass"],proposed:true},
{id:"sky-ferry",from:"embercross",to:"mistport",mode:"airship",days:1,costCp:250,bidirectional:true,proposed:true},
{id:"tide-schooner",from:"mistport",to:"embercross",mode:"ship",days:2,costCp:70,bidirectional:true,proposed:true},
{id:"star-gate",from:"starglen",to:"mistport",mode:"portal",days:0,costCp:100,bidirectional:true,requires:["portal-key"],proposed:true},
{id:"mists-barovia",from:"mistport",to:"barovia-crossing",mode:"mists",days:1,costCp:0,requires:["dm-domain-permit"],domainCrossing:true,proposed:true},
{id:"mists-darkon",from:"barovia-crossing",to:"darkon-crossing",mode:"mists",days:1,costCp:0,requires:["dm-domain-permit"],domainCrossing:true,proposed:true},
{id:"mists-lamordia",from:"darkon-crossing",to:"lamordia-crossing",mode:"mists",days:2,costCp:0,requires:["dm-domain-permit"],domainCrossing:true,proposed:true}
];
const nodeById=id=>nodes.find(n=>n.id===id);
function available(route,character,opts={}){
if(!route||!nodeById(route.from)||!nodeById(route.to))return {ok:false,reason:"Unknown route"};
if(route.domainCrossing&&!opts.dmApproved)return {ok:false,reason:"Ravenloft Mists require DM approval; crossings are not guaranteed."};
const items=new Set(character?.items||[]);
for(const requirement of route.requires||[]){
 if(requirement==="dm-domain-permit"){if(!opts.dmApproved)return {ok:false,reason:"DM permission required"};}
 else if(!items.has(requirement))return {ok:false,reason:"Requires "+requirement};
}
if(!Number.isSafeInteger(character?.coins)||character.coins<route.costCp)return {ok:false,reason:"Insufficient funds"};
return {ok:true};
}
function candidates(origin){return routes.flatMap(r=>r.from===origin?[{...r,destination:r.to}]:r.bidirectional&&r.to===origin?[{...r,destination:r.from}]:[]);}
function travel(character,routeId,opts={}){
const route=routes.find(r=>r.id===routeId);if(!route)return {ok:false,reason:"Unknown route"};
const from=character?.location;const next=route.from===from?route.to:(route.bidirectional&&route.to===from?route.from:null);
if(!next)return {ok:false,reason:"Not at a route endpoint"};
const check=available(route,character,opts);if(!check.ok)return check;
const updated={...character,location:next,coins:character.coins-route.costCp,day:(character.day||1)+route.days,travelLog:[...(character.travelLog||[]),{routeId,from,to:next,mode:route.mode,days:route.days,costCp:route.costCp,proposed:!!route.proposed}]};
return {ok:true,state:updated,arrival:nodeById(next)};
}
root.MoonveilTravel={nodes,routes,candidates,available,travel};
})(typeof window!=="undefined"?window:globalThis);
