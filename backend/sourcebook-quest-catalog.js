"use strict";
const data=require("../data/quest-packs/alice-one-quest-per-publication.json");
const pubs=require("../data/chronology/dnd-publication-index-seed.json");
const byId=new Map(data.quests.map(q=>[q.id,q]));
if(byId.size!==data.quests.length||data.quests.length!==pubs.entries.length)throw Error("SOURCE_QUEST_INDEX_MISMATCH");
for(const pub of pubs.entries)if(!data.quests.some(q=>q.sourceId===pub.id))throw Error("MISSING_PUBLICATION_QUEST");
function listSourceQuests({book=null,sourceId=null,limit=100,offset=0}={}){
 if(book!==null&&(!Number.isInteger(book)||book<1||book>30))throw TypeError("INVALID_BOOK");
 if(!Number.isInteger(limit)||limit<1||limit>200||!Number.isInteger(offset)||offset<0)throw TypeError("INVALID_PAGINATION");
 const matched=data.quests.filter(q=>(book===null||q.moonveilBook===book)&&(sourceId===null||q.sourceId===sourceId));
 return {total:matched.length,quests:structuredClone(matched.slice(offset,offset+limit)),draft:true};
}
function getSourceQuest(id){return byId.has(id)?structuredClone(byId.get(id)):null;}
module.exports={listSourceQuests,getSourceQuest};
