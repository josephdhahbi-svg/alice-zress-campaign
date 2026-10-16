"use strict";
const review=require("../data/chronology/gemini-history-audit-v2-2026-10-16.json");
const knownCodes=new Map([["Advanced Dungeons & Dragons - Player's Handbook","TSR2010"],["Advanced Dungeons & Dragons - Dungeon Master's Guide","TSR2011"]]);
function auditRecord(record){
 const issues=[];
 if(!record||typeof record!=="object")return {approved:false,issues:["INVALID_RECORD"]};
 if(!Number.isInteger(record.year)||record.year<1974)issues.push("INVALID_YEAR");
 if(record.exactPublicationDate!==null&&record.exactPublicationDate!==undefined){
  const d=record.exactPublicationDate;
  if(typeof d!=="string"||!/^\\d{4}-\\d{2}-\\d{2}$/.test(d)||!Number.isFinite(Date.parse(d+"T00:00:00Z"))||new Date(d+"T00:00:00Z").toISOString().slice(0,10)!==d)issues.push("INVALID_EXACT_DATE");
 }
 if(record.sourceStatus!=="VERIFIED_PRIMARY_SOURCE")issues.push("SOURCE_NOT_VERIFIED");
 const code=knownCodes.get(record.title);
 if(code&&record.submittedCode!==code)issues.push("PRODUCT_CODE_CONFLICT");
 return {approved:issues.length===0,issues};
}
function auditBatch(){return {complete:false,received:review.entries.length,scope:review.claimedScope,results:review.entries.map(x=>({code:x.submittedCode,...auditRecord(x)}))};}
function createQueries(db){
 if(!db||typeof db.prepare!=="function")throw new TypeError("INJECTED_DB_REQUIRED");
 return {getByEdition(edition){if(typeof edition!=="string"||!edition.trim())throw new TypeError("EDITION_REQUIRED");return db.prepare("SELECT * FROM dnd_publications WHERE edition = ? COLLATE NOCASE ORDER BY publication_date ASC").all(edition);}};
}
module.exports={auditRecord,auditBatch,createQueries};
