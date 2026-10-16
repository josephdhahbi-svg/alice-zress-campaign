"use strict";
const catalog=require("../data/classes/wonderland-divine-125-paths.json");
const byId=new Map(catalog.paths.map(p=>[p.id,p]));
function listDivinePaths({deity=null,baseClass=null}={}){
 return structuredClone(catalog.paths.filter(p=>(!deity||p.deity===deity)&&(!baseClass||p.baseClass===baseClass)));
}
function previewDivinePath(id,{eraVerified=false,dmApproved=false}={}){
 const p=byId.get(id);
 if(!p)return {found:false,reason:"UNKNOWN_DIVINE_PATH"};
 return {found:true,path:structuredClone(p),playable:false,reason:!eraVerified?"ERA_UNVERIFIED":!dmApproved?"DM_APPROVAL_REQUIRED":"PROTOTYPE_REQUIRES_BALANCE_AND_RULES_REVIEW"};
}
module.exports={listDivinePaths,previewDivinePath};
