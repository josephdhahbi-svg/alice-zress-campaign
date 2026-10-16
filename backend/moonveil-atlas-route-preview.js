"use strict";
const catalog=require("../data/maps/gemini-batch3-atlas-staging.json");
const byId=new Map(catalog.locations.map(x=>[x.id,x]));
function listLocations({setting=null}={}){return structuredClone(catalog.locations.filter(x=>setting===null||x.setting===setting));}
function getLocation(id){return byId.has(id)?structuredClone(byId.get(id)):null;}
function previewRoute({from,to,eraId,allowProposed=false}={}){
 if(!byId.has(from)||!byId.has(to))return {reachable:false,reason:"UNKNOWN_LOCATION"};
 if(!catalog.eraIds.includes(eraId))return {reachable:false,reason:"INVALID_OR_MISSING_ERA"};
 if(from===to)return {reachable:true,path:[from],segments:[],distanceMiles:0,travelDays:0,verified:true};
 const adj=new Map(catalog.locations.map(x=>[x.id,[]]));
 for(const r of catalog.routes){
  if(!r.eraIds.includes(eraId)||(!r.traversable&&!allowProposed))continue;
  adj.get(r.from)?.push(r);
 }
 const q=[{at:from,path:[from],segments:[]}];const visited=new Set([from]);
 while(q.length){
  const curr=q.shift();
  for(const r of adj.get(curr.at)||[]){
   if(visited.has(r.to))continue;
   const next={at:r.to,path:[...curr.path,r.to],segments:[...curr.segments,r]};
   if(r.to===to){
    const known=next.segments.every(s=>s.distanceMiles!==null&&s.travelDays!==null&&s.status==="VERIFIED");
    return {reachable:true,path:next.path,segments:structuredClone(next.segments),distanceMiles:known?next.segments.reduce((n,s)=>n+s.distanceMiles,0):null,travelDays:known?next.segments.reduce((n,s)=>n+s.travelDays,0):null,verified:known,reason:known?"VERIFIED_ROUTE":"PROPOSED_ROUTE_UNVERIFIED"};
   }
   visited.add(r.to);q.push(next);
  }
 }
 return {reachable:false,reason:"NO_ERA_VERIFIED_ROUTE",proposedRouteAvailable:catalog.routes.some(r=>r.from===from&&r.to===to)};
}
module.exports={listLocations,getLocation,previewRoute};
