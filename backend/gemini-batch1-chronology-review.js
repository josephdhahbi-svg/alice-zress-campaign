"use strict";
const seed=require("../data/chronology/gemini-batch1-review-2026-10-16.json");
function validatePublication(record){
 if(!record||typeof record.id!=="string"||!record.id||typeof record.title!=="string"||!Number.isInteger(record.publicationYear))return {valid:false,reason:"INVALID_PUBLICATION"};
 if(record.publicationDate!==null&&record.publicationDate!==undefined){
  if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(record.publicationDate))return {valid:false,reason:"INVALID_DATE_FORMAT"};
  const d=new Date(record.publicationDate+"T00:00:00Z");
  if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==record.publicationDate)return {valid:false,reason:"INVALID_CALENDAR_DATE"};
  if(Number(record.publicationDate.slice(0,4))!==record.publicationYear)return {valid:false,reason:"YEAR_DATE_CONFLICT"};
 }
 return {valid:true,chronologySortable:record.publicationDate!==null&&record.publicationDate!==undefined&&record.sourceStatus==="VERIFIED_PRIMARY_SOURCE"};
}
function listUnverifiedSeed({edition=null}={}){return structuredClone(seed.records.filter(r=>edition===null||r.edition===edition));}
function previewHistoricalLink({publicationId,calendarId,fictionalYear,sourceVerified=false}={}){
 const publication=seed.records.find(x=>x.id===publicationId);
 if(!publication)return {allowed:false,reason:"UNKNOWN_PUBLICATION"};
 if(!calendarId||!Number.isInteger(fictionalYear))return {allowed:false,reason:"CALENDAR_AND_YEAR_REQUIRED"};
 if(!sourceVerified||publication.sourceStatus!=="VERIFIED_PRIMARY_SOURCE")return {allowed:false,reason:"PUBLICATION_AND_EVENT_SOURCE_VERIFICATION_REQUIRED"};
 return {allowed:false,reason:"NO_APPROVED_EVENT_RECORD"};
}
module.exports={validatePublication,listUnverifiedSeed,previewHistoricalLink};
