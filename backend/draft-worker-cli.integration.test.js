"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),os=require("node:os"),path=require("node:path"),cp=require("node:child_process");
const {withDraftLock}=require("./draft-worker-lock");
const cli=path.join(__dirname,"draft-worker-cli.js");
function sandbox(fn){const root=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-cli-"));try{fn(root);}finally{fs.rmSync(root,{recursive:true,force:true});}}
const run=root=>cp.spawnSync(process.execPath,[cli,"1","--root",root],{encoding:"utf8"});
test("CLI persists progress across separate processes",()=>sandbox(root=>{
 for(let n=2;n>=0;n--){
  const result=run(root);assert.equal(result.status,0,result.stderr);
  assert.equal(JSON.parse(result.stdout).remainingQueue,n);
 }
 assert.equal(JSON.parse(run(root).stdout).status,"QUEUE_EMPTY");
 assert.equal(fs.existsSync(path.join(root,".moonveil-draft.lock")),false);
}));
test("CLI refuses active lock and does not write",()=>sandbox(root=>{
 withDraftLock(root,()=>{
  const result=run(root);
  assert.equal(result.status,1);
  assert.match(result.stderr,/WORKER_LOCKED/);
  assert.equal(fs.existsSync(path.join(root,"routes")),false);
 });
 assert.equal(run(root).status,0);
}));
test("lock is released after callback exception",()=>sandbox(root=>{
 assert.throws(()=>withDraftLock(root,()=>{throw Error("EXPECTED");}),/EXPECTED/);
 assert.equal(fs.existsSync(path.join(root,".moonveil-draft.lock")),false);
}));
test("stale lock requires explicit manual intervention",()=>sandbox(root=>{
 fs.writeFileSync(path.join(root,".moonveil-draft.lock"),'{"pid":999999,"token":"stale"}');
 assert.equal(run(root).status,1);
 assert.equal(fs.existsSync(path.join(root,"routes")),false);
}));
