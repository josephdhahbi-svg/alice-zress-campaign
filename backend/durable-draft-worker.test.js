"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const {DurableDraftWorker}=require("./durable-draft-worker");
function sandbox(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-durable-"));try{fn(root);}finally{fs.rmSync(root,{recursive:true,force:true});}}
test("restart preserves queue order and draft checksums",()=>sandbox(root=>{
 let w=new DurableDraftWorker({rootDir:root});
 assert.equal(w.runNextTask("no").error,"EXPLICIT_CONFIRMATION_REQUIRED");
 assert.equal(w.runNextTask("1").remainingQueue,2);
 w=new DurableDraftWorker({rootDir:root});
 assert.equal(w.remainingQueue,2);
 assert.equal(w.runNextTask("1").fileWritten,"lore/twilight_singularity_chronicles.md");
 w=new DurableDraftWorker({rootDir:root});
 assert.equal(w.runNextTask("1").fileWritten,"quests/eclipsed_deity_pact.json");
 assert.equal(new DurableDraftWorker({rootDir:root}).runNextTask("1").status,"QUEUE_EMPTY");
 assert.equal(JSON.parse(fs.readFileSync(path.join(root,".moonveil-draft-queue.json"))).completed.length,3);
}));
test("recovers draft written before manifest commit without overwriting",()=>sandbox(root=>{
 const w=new DurableDraftWorker({rootDir:root});
 const first=w.writer.runNextTask("1");
 assert.equal(first.status,"DRAFT_WRITTEN");
 const resumed=new DurableDraftWorker({rootDir:root});
 assert.equal(resumed.remainingQueue,2);
 assert.equal(resumed.runNextTask("1").fileWritten,"lore/twilight_singularity_chronicles.md");
}));
test("refuses modified draft and changed task catalog",()=>sandbox(root=>{
 const w=new DurableDraftWorker({rootDir:root});
 w.runNextTask("1");
 fs.appendFileSync(path.join(root,"routes/dynamic_faction_events.js"),"tampered");
 assert.throws(()=>new DurableDraftWorker({rootDir:root}),/DRAFT_TAMPERED/);
}));
test("refuses conflicting manifest and modified task seed",()=>sandbox(root=>{
 new DurableDraftWorker({rootDir:root});
 assert.throws(()=>new DurableDraftWorker({rootDir:root,taskQueue:[]}),/QUEUE_MANIFEST_CONFLICT/);
}));
