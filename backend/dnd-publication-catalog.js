"use strict";
const data=require("../data/chronology/dnd-publication-index-seed.json");
const titles=data.entries;
if(!titles.length)throw Error("EMPTY_BIBLIOGRAPHY");
for(let i=1;i<titles.length;i++)if(titles[i-1].publicationDate>titles[i].publicationDate)throw Error("UNSORTED_PUBLICATIONS");
if(new Set(titles.map(x=>x.id)).size!==titles.length)throw Error("DUPLICATE_PUBLICATION_ID");
function listPublications({fromYear=null,toYear=null,setting=null,edition=null,limit=100,offset=0}={}){
 if(!Number.isInteger(limit)||limit<1||limit>200||!Number.isInteger(offset)||offset<0)throw TypeError("INVALID_PAGINATION");
 if(fromYear!==null&&(!Number.isInteger(fromYear)||fromYear<1974))throw TypeError("INVALID_FROM_YEAR");
 if(toYear!==null&&(!Number.isInteger(toYear)||toYear<1974))throw TypeError("INVALID_TO_YEAR");
 const matched=titles.filter(x=>(fromYear===null||Number(x.publicationDate.slice(0,4))>=fromYear)&&(toYear===null||Number(x.publicationDate.slice(0,4))<=toYear)&&(setting===null||x.setting===setting)&&(edition===null||x.edition===edition));
 return {total:matched.length,asOf:data.asOf,complete:false,entries:structuredClone(matched.slice(offset,offset+limit))};
}
function getPublication(id){const item=titles.find(x=>x.id===id);return item?structuredClone(item):null;}
function getCoverage(){return {indexed:titles.length,first:titles[0].publicationDate,last:titles.at(-1).publicationDate,complete:false,scope:data.scope,missingKinds:data.excluded};}
module.exports={listPublications,getPublication,getCoverage};
