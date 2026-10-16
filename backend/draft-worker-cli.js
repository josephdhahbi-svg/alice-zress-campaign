#!/usr/bin/env node
"use strict";
/** Usage: node backend/draft-worker-cli.js 1 --root /absolute/sandbox/path */
const path=require("node:path");
const {DurableDraftWorker}=require("./durable-draft-worker");
const {withDraftLock}=require("./draft-worker-lock");
function main(args=process.argv.slice(2)){
 const [command,flag,root]=args;
 if(!["1","status"].includes(command)||flag!=="--root"||!root||!path.isAbsolute(root)){
  process.stderr.write("Usage: node backend/draft-worker-cli.js <1|status> --root <absolute-existing-directory>\n");
  return 2;
 }
 return withDraftLock(root,()=>{
  const worker=new DurableDraftWorker({rootDir:root});
  const result=command==="status"?{remainingQueue:worker.remainingQueue,mode:"DRAFT_ONLY"}:worker.runNextTask(command);
  process.stdout.write(JSON.stringify(result)+"\n");
  return 0;
 });
}
if(require.main===module){try{process.exitCode=main();}catch(error){process.stderr.write(error.message+"\n");process.exitCode=1;}}
module.exports={main};
