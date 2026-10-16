"use strict";
const fs=require("node:fs"),path=require("node:path");
const root=path.join(__dirname,"..","data","taverns");
const taverns=[];
for(let i=1;i<=10;i++){
 const pack=JSON.parse(fs.readFileSync(path.join(root,`moonveil-taverns-${String(i).padStart(2,"0")}.json`),"utf8"));
 if(pack.taverns.length!==10)throw Error("INVALID_TAVERN_PACK");
 taverns.push(...pack.taverns);
}
const byId=new Map(taverns.map(t=>[t.id,t]));
if(byId.size!==100)throw Error("DUPLICATE_TAVERN_ID");
for(let book=1;book<=30;book++)if(!taverns.some(t=>t.book===book))throw Error("BOOK_WITHOUT_TAVERN");
function listTaverns({book=null,region=null,limit=100,offset=0}={}){
 if(book!==null&&(!Number.isInteger(book)||book<1||book>30))throw TypeError("INVALID_BOOK");
 if(region!==null&&typeof region!=="string")throw TypeError("INVALID_REGION");
 if(!Number.isInteger(limit)||limit<1||limit>100||!Number.isInteger(offset)||offset<0)throw TypeError("INVALID_PAGINATION");
 const matching=taverns.filter(t=>(book===null||t.book===book)&&(region===null||t.region===region));
 return {total:matching.length,taverns:structuredClone(matching.slice(offset,offset+limit))};
}
function getTavern(id){return byId.has(id)?structuredClone(byId.get(id)):null;}
module.exports={listTaverns,getTavern};
