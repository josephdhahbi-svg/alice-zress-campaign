"use strict";
/** Explicit, bounded, local file writer. No AI generation or automatic execution. */
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const DEFAULT_TASKS=Object.freeze([
 {id:"TASK-FILE-01",type:"CODE",filename:"routes/dynamic_faction_events.js",content:'"use strict";\n// Draft only: do not mount without signed campaign authorization.\nmodule.exports={draft:true};\n'},
 {id:"TASK-FILE-02",type:"LORE",filename:"lore/twilight_singularity_chronicles.md",content:"# Twilight Singularity — Proposed Lore\n\nUnverified alternate-era concept. Not canonical Moonveil chronology.\n"},
 {id:"TASK-FILE-03",type:"QUEST",filename:"quests/eclipsed_deity_pact.json",content:JSON.stringify({questId:"Q-ECLIPSE-09",status:"PROPOSAL_ONLY",objective:"Investigate a possible divine pact and Underdark rift.",candidateRewards:["Platinum Shield of Justice","+2 Wisdom"],rewardsApproved:false},null,2)+"\n"}
]);
const ALLOWED={CODE:"routes",LORE:"lore",QUEST:"quests"};
class AIFileWriterWorker{
 constructor({rootDir,taskQueue=DEFAULT_TASKS}={}){
  if(typeof rootDir!=="string"||!path.isAbsolute(rootDir))throw new TypeError("ABSOLUTE_ROOT_REQUIRED");
  this.rootDir=fs.realpathSync(rootDir);
  if(!fs.statSync(this.rootDir).isDirectory())throw new TypeError("ROOT_NOT_DIRECTORY");
  this.taskQueue=taskQueue.map(t=>({...t}));
  this.completedLog=[];
  this.ids=new Set(this.taskQueue.map(t=>t.id));
  if(this.ids.size!==this.taskQueue.length)throw new Error("DUPLICATE_TASK");
  this.taskQueue.forEach(t=>this.validate(t));
 }
 validate(t){
  if(!t||typeof t.id!=="string"||!/^[A-Za-z0-9_-]{1,80}$/.test(t.id)||
   !Object.hasOwn(ALLOWED,t.type)||typeof t.filename!=="string"||
   !new RegExp("^"+ALLOWED[t.type]+"/[A-Za-z0-9_-]+\\.(?:js|md|json)$").test(t.filename)||
   !t.filename.endsWith(({CODE:".js",LORE:".md",QUEST:".json"})[t.type])||
   typeof t.content!=="string"||Buffer.byteLength(t.content)>65536)
   throw new TypeError("INVALID_TASK");
  if(t.type==="QUEST"){const q=JSON.parse(t.content);if(q.rewardsApproved!==false)throw new Error("QUEST_REWARDS_MUST_REMAIN_PROPOSED");}
 }
 runNextTask(input){
  if(input!=="1")return {error:"EXPLICIT_CONFIRMATION_REQUIRED"};
  if(!this.taskQueue.length)return {status:"QUEUE_EMPTY",remainingQueue:0};
  const task=this.taskQueue[0];this.validate(task);
  const base=ALLOWED[task.type],dir=path.join(this.rootDir,base);
  if(fs.existsSync(dir)&&(!fs.lstatSync(dir).isDirectory()||fs.lstatSync(dir).isSymbolicLink()))throw new Error("UNSAFE_DIRECTORY");
  fs.mkdirSync(dir,{recursive:true});
  const filename=path.join(dir,path.basename(task.filename));
  const handle=fs.openSync(filename,fs.constants.O_WRONLY|fs.constants.O_CREAT|fs.constants.O_EXCL,0o600);
  try{fs.writeFileSync(handle,task.content,"utf8");fs.fsyncSync(handle);}
  catch(err){fs.closeSync(handle);fs.unlinkSync(filename);throw err;}
  fs.closeSync(handle);
  this.taskQueue.shift();
  const entry={id:task.id,filename:task.filename,sha256:crypto.createHash("sha256").update(task.content).digest("hex"),status:"DRAFT_WRITTEN"};
  this.completedLog.push(entry);
  return {status:"DRAFT_WRITTEN",fileWritten:task.filename,remainingQueue:this.taskQueue.length,sha256:entry.sha256};
 }
}
module.exports={AIFileWriterWorker,DEFAULT_TASKS};
