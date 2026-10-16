"use strict";
const data=require("../data/divine/moonveil-shrines-60.json");
const cameoData=require("../data/divine/historical-cameo-gates.json");
const sites=new Map(data.sites.map(s=>[s.id,s]));
const cameos=new Map(cameoData.cameos.map(c=>[c.id,c]));
if(sites.size!==60||cameos.size!==cameoData.cameos.length)throw Error("INVALID_DIVINE_CATALOG");
for(let book=1;book<=30;book++)if(!data.sites.some(s=>s.book===book))throw Error("MISSING_SHRINE_BOOK");
function listShrines({book=null,deity=null}={}){
 if(book!==null&&(!Number.isInteger(book)||book<1||book>30))throw TypeError("INVALID_BOOK");
 return structuredClone(data.sites.filter(s=>(book===null||s.book===book)&&(deity===null||s.deity===deity)));
}
function getShrine(id){return sites.has(id)?structuredClone(sites.get(id)):null;}
function previewBlessing({shrineId,characterAffinity=0,domainMatch=false,longRestCompleted=false}){
 const shrine=getShrine(shrineId);
 if(!shrine)return {eligible:false,reason:"UNKNOWN_SHRINE"};
 if(longRestCompleted)return {eligible:false,reason:"EXPIRED_AFTER_LONG_REST"};
 return {eligible:false,reason:"DM_ATTESTATION_AND_DATE_VERIFICATION_REQUIRED",shrineId,blessing:shrine.blessing,contactTier:domainMatch&&characterAffinity>=5?"PRIEST_OR_OMEN":"OMEN_ONLY",automaticGrant:false};
}
function previewCameo({cameoId,book,region,drDate=null}){
 const cameo=cameos.get(cameoId);
 if(!cameo)return {allowed:false,reason:"UNKNOWN_CHARACTER"};
 if(!Number.isInteger(book)||book<1||book>30)return {allowed:false,reason:"INVALID_BOOK"};
 if(region!==cameo.region)return {allowed:false,reason:"LOCATION_MISMATCH",cameo:structuredClone(cameo)};
 return {allowed:false,reason:"CANON_DATE_AND_STATUS_REVIEW_REQUIRED",dateProvided:drDate!==null,cameo:structuredClone(cameo),permittedPreviewModes:structuredClone(cameo.allowedModes)};
}
module.exports={listShrines,getShrine,previewBlessing,previewCameo};
