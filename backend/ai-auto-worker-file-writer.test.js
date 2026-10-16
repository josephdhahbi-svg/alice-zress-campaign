"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const {AIFileWriterWorker}=require("./ai-auto-worker-file-writer");
function sandbox(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-writer-"));try{fn(root);}finally{fs.rmSync(root,{recursive:true,force:true});}}
test("requires explicit confirmation and writes only drafts in queue order",()=>sandbox(root=>{
 const w=new AIFileWriterWorker({rootDir:root});
 assert.equal(w.runNextTask("0").error,"EXPLICIT_CONFIRMATION_REQUIRED");
 assert.equal(fs.readdirSync(root).length,0);
 for(const expected of ["routes/dynamic_faction_events.js","lore/twilight_singularity_chronicles.md","quests/eclipsed_deity_pact.json"]){
  const result=w.runNextTask("1");
  assert.equal(result.fileWritten,expected);
  assert.equal(result.status,"DRAFT_WRITTEN");
  assert.ok(fs.existsSync(path.join(root,expected)));
 }
 assert.equal(w.runNextTask("1").status,"QUEUE_EMPTY");
 assert.equal(w.completedLog.length,3);
 assert.equal(JSON.parse(fs.readFileSync(path.join(root,"quests/eclipsed_deity_pact.json"),"utf8")).rewardsApproved,false);
}));
test("rejects path traversal, unapproved rewards, duplicate ids and overwrites",()=>sandbox(root=>{
 const t={id:"t",type:"CODE",filename:"routes/x.js",content:"module.exports=1;"};
 for(const bad of [{...t,filename:"routes/../server.js"},{...t,type:"QUEST",filename:"quests/x.json",content:'{"rewardsApproved":true}'}])
  assert.throws(()=>new AIFileWriterWorker({rootDir:root,taskQueue:[bad]}));
 assert.throws(()=>new AIFileWriterWorker({rootDir:root,taskQueue:[t,t]}),/DUPLICATE_TASK/);
 fs.mkdirSync(path.join(root,"routes"));
 fs.writeFileSync(path.join(root,"routes/x.js"),"original");
 const w=new AIFileWriterWorker({rootDir:root,taskQueue:[t]});
 assert.throws(()=>w.runNextTask("1"),/EEXIST/);
 assert.equal(fs.readFileSync(path.join(root,"routes/x.js"),"utf8"),"original");
 assert.equal(w.taskQueue.length,1);
}));
test("refuses symlinked output directory",()=>sandbox(root=>{
 const outside=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-outside-"));
 try{
  fs.symlinkSync(outside,path.join(root,"routes"),"dir");
  const w=new AIFileWriterWorker({rootDir:root,taskQueue:[{id:"t",type:"CODE",filename:"routes/x.js",content:"safe"}]});
  assert.throws(()=>w.runNextTask("1"),/UNSAFE_DIRECTORY/);
  assert.deepEqual(fs.readdirSync(outside),[]);
 }finally{fs.rmSync(outside,{recursive:true,force:true});}
}));
