"use strict";
/** Restart-safe, explicit draft queue. No autonomous generation or code execution. */
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const {AIFileWriterWorker,DEFAULT_TASKS}=require("./ai-auto-worker-file-writer");
const sha=x=>crypto.createHash("sha256").update(x).digest("hex");
class DurableDraftWorker{
 constructor({rootDir,taskQueue=DEFAULT_TASKS}={}){
  this.writer=new AIFileWriterWorker({rootDir,taskQueue});
  this.root=this.writer.rootDir;
  this.manifest=path.join(this.root,".moonveil-draft-queue.json");
  this.initial=taskQueue.map(t=>({...t}));
  if(fs.existsSync(this.manifest)){
   if(fs.lstatSync(this.manifest).isSymbolicLink())throw Error("UNSAFE_MANIFEST");
   const m=JSON.parse(fs.readFileSync(this.manifest,"utf8"));
   if(m.version!==1||!Array.isArray(m.completed)||m.seedHash!==sha(JSON.stringify(this.initial)))throw Error("QUEUE_MANIFEST_CONFLICT");
   const ids=new Set();
   for(const record of m.completed){
    if(!record||typeof record.id!=="string"||ids.has(record.id))throw Error("CORRUPT_MANIFEST");
    ids.add(record.id);
    const task=this.initial.find(t=>t.id===record.id);
    if(!task||task.filename!==record.filename||sha(task.content)!==record.sha256)throw Error("CORRUPT_MANIFEST");
    const file=path.join(this.root,task.filename);
    if(!fs.existsSync(file)||fs.lstatSync(file).isSymbolicLink()||sha(fs.readFileSync(file))!==record.sha256)throw Error("DRAFT_TAMPERED");
   }
   if(!this.initial.slice(0,m.completed.length).every((t,i)=>t.id===m.completed[i].id))throw Error("QUEUE_ORDER_CONFLICT");
   const recovered=[...m.completed];
   for(const task of this.initial.slice(recovered.length)){
    const file=path.join(this.root,task.filename);
    if(!fs.existsSync(file))break;
    if(fs.lstatSync(file).isSymbolicLink()||sha(fs.readFileSync(file))!==sha(task.content))throw Error("UNTRACKED_DRAFT_CONFLICT");
    recovered.push({id:task.id,filename:task.filename,sha256:sha(task.content),status:"DRAFT_WRITTEN"});
   }
   if(this.initial.slice(recovered.length).some(t=>fs.existsSync(path.join(this.root,t.filename))))throw Error("QUEUE_ORDER_CONFLICT");
   this.writer.taskQueue=this.initial.slice(recovered.length);
   this.writer.completedLog=recovered;
   if(recovered.length!==m.completed.length)this.persist();
  }else{
   // Recover after a crash between the draft write and manifest commit.
   const recovered=[];
   for(const task of this.initial){
    const file=path.join(this.root,task.filename);
    if(!fs.existsSync(file))break;
    if(fs.lstatSync(file).isSymbolicLink()||sha(fs.readFileSync(file))!==sha(task.content))throw Error("UNTRACKED_DRAFT_CONFLICT");
    recovered.push({id:task.id,filename:task.filename,sha256:sha(task.content),status:"DRAFT_WRITTEN"});
   }
   if(this.initial.slice(recovered.length).some(t=>fs.existsSync(path.join(this.root,t.filename))))throw Error("QUEUE_ORDER_CONFLICT");
   this.writer.taskQueue=this.initial.slice(recovered.length);
   this.writer.completedLog=recovered;
   this.persist();
  }
 }
 persist(){
  const data=JSON.stringify({version:1,seedHash:sha(JSON.stringify(this.initial)),completed:this.writer.completedLog},null,2)+"\n";
  const tmp=this.manifest+".tmp-"+process.pid+"-"+crypto.randomBytes(8).toString("hex");
  let fd;
  try{
   fd=fs.openSync(tmp,fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_WRONLY,0o600);
   fs.writeFileSync(fd,data);fs.fsyncSync(fd);fs.closeSync(fd);fd=null;
   fs.renameSync(tmp,this.manifest);
  }finally{if(fd!==undefined&&fd!==null)fs.closeSync(fd);if(fs.existsSync(tmp))fs.unlinkSync(tmp);}
 }
 runNextTask(input){
  if(input!=="1")return {error:"EXPLICIT_CONFIRMATION_REQUIRED"};
  const result=this.writer.runNextTask(input);
  if(result.status==="DRAFT_WRITTEN")this.persist();
  return result;
 }
 get remainingQueue(){return this.writer.taskQueue.length;}
}
module.exports={DurableDraftWorker};
