"use strict";
const data=require("../data/chronology/moonveil-three-eras-30-books.json");
const eras=new Map(data.eras.map(e=>[e.id,e]));
const books=new Map(data.books.map(b=>[b.book,b]));
function eraAtDR(year){
 if(!Number.isInteger(year))return null;
 if(year< -339)return eras.get("ERA_1_MYSTRYL");
 if(year<1358)return eras.get("ERA_2_MYSTRA");
 return eras.get("ERA_3_MIDNIGHT_MYSTRA");
}
function divineStatusAtDR(year){
 const era=eraAtDR(year);
 if(!era)return {verified:false,reason:"DATE_REQUIRED"};
 if(year>=1385&&year<1487)return {verified:false,eraId:era.id,reason:"SPELLPLAGUE_RESTORATION_TRANSITION_REQUIRES_EXACT_SOURCE"};
 return {verified:false,eraId:era.id,reason:"PRIMARY_SOURCE_AND_LOCATION_REVIEW_REQUIRED"};
}
function getBook(book){return books.has(book)?structuredClone(books.get(book)):null;}
function previewPlacement({book,drYear,plane,sourceId=null}){
 if(!books.has(book))return {allowed:false,reason:"INVALID_BOOK"};
 if(!Number.isInteger(drYear))return {allowed:false,reason:"DATE_REQUIRED"};
 if(typeof plane!=="string"||!plane.trim())return {allowed:false,reason:"PLANE_REQUIRED"};
 const era=eraAtDR(drYear);
 return {allowed:false,reason:"SOURCE_AND_GEOGRAPHY_REVIEW_REQUIRED",book,drYear,plane,eraId:era.id,sourceProvided:!!sourceId,canonicalPlacement:false};
}
function getTracker(){return {eras:structuredClone(data.eras),events:structuredClone(data.events),books:data.books.length,eraSlots:data.books.reduce((n,b)=>n+b.eraWindows.length,0),traversalSlots:data.books.reduce((n,b)=>n+b.traversals.length,0),sourceRegistryStatus:data.sourceRegistry.catalogStatus};}
module.exports={eraAtDR,divineStatusAtDR,getBook,previewPlacement,getTracker};
