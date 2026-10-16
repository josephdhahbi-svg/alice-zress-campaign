"use strict";
const fs=require("node:fs");
const path=require("node:path");
const root=path.join(__dirname,"..","data","quest-packs");
const roster=require("../data/characters/omniversal-chain-roster-100.json");
const chainPacks=[];
for(let wave=2;wave<=3;wave++)for(let chain=1;chain<=10;chain++){
 const first=(wave===2?101:201)+(chain-1)*10;
 chainPacks.push(JSON.parse(fs.readFileSync(path.join(root,`omniversal-chain-${String(chain).padStart(2,"0")}-quests-${first}-${first+9}.json`),"utf8")));
}
const byCharacter=new Map(roster.characters.map(c=>[c.id,c]));
const byQuest=new Map();
for(const pack of chainPacks)for(const q of pack.quests){
 if(byQuest.has(q.id))throw Error("DUPLICATE_QUEST_ID");
 byQuest.set(q.id,{...q,cast:pack.cast.map(c=>({id:c.id,name:c.name,role:c.role}))});
}
for(const c of roster.characters){
 if(c.questLinks.wave2.length!==10||c.questLinks.wave3.length!==10)throw Error("INVALID_LINK_COUNT");
 for(const id of [...c.questLinks.wave2,...c.questLinks.wave3]){
  const q=byQuest.get(id);
  if(!q||!q.cast.some(n=>n.id===c.id))throw Error("BROKEN_CHARACTER_QUEST_LINK");
 }
}
function listCharacters({limit=100,offset=0}={}){
 if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(offset)||offset<0)throw TypeError("INVALID_PAGINATION");
 return {total:roster.characters.length,characters:roster.characters.slice(offset,offset+limit).map(c=>({id:c.id,name:c.name,role:c.role,archetype:c.npcArchetype,questCount:20,status:c.statBlock.status}))};
}
function getCharacter(id){const c=byCharacter.get(id);return c?structuredClone(c):null;}
function getQuest(id){const q=byQuest.get(id);return q?structuredClone(q):null;}
function listQuests({limit=100,offset=0}={}){
 if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(offset)||offset<0)throw TypeError("INVALID_PAGINATION");
 return {total:byQuest.size,quests:[...byQuest.values()].slice(offset,offset+limit).map(q=>({id:q.id,title:q.title,book:q.book,chainId:q.chainId,castIds:q.cast.map(c=>c.id),previousQuestId:q.previousQuestId}))};
}
module.exports={listCharacters,getCharacter,getQuest,listQuests};
