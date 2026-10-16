"use strict";
/** Exclusive CLI lock: stale recovery requires explicit operator action. */
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
function withDraftLock(rootDir,fn){
 const root=fs.realpathSync(rootDir),lock=path.join(root,".moonveil-draft.lock");
 const token=crypto.randomBytes(16).toString("hex");
 let fd;
 try{
  fd=fs.openSync(lock,fs.constants.O_CREAT|fs.constants.O_EXCL|fs.constants.O_WRONLY,0o600);
  fs.writeFileSync(fd,JSON.stringify({pid:process.pid,token,createdAt:new Date().toISOString()})+"\n");
  fs.fsyncSync(fd);fs.closeSync(fd);fd=null;
 }catch(error){
  if(fd!==undefined&&fd!==null)fs.closeSync(fd);
  if(error.code==="EEXIST")throw Error("WORKER_LOCKED: existing lock must be inspected and cleared manually");
  throw error;
 }
 try{return fn();}
 finally{
  try{
   const stat=fs.lstatSync(lock);
   if(!stat.isSymbolicLink()&&stat.isFile()){
    const contents=JSON.parse(fs.readFileSync(lock,"utf8"));
    if(contents.token===token&&contents.pid===process.pid)fs.unlinkSync(lock);
   }
  }catch(error){if(error.code!=="ENOENT")throw error;}
 }
}
module.exports={withDraftLock};
