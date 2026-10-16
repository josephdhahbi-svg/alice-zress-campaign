"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const Database=require("better-sqlite3");
const {startMoonveilServer}=require("../server");
const secret="moonveil-backup-test-admin-secret-2026";
async function boot(directory){
 const instance=startMoonveilServer({port:0,dbPath:path.join(directory,"campaign.sqlite"),token:secret,schedule:false});
 if(!instance.server.listening)await new Promise(resolve=>instance.server.once("listening",resolve));
 return instance;
}
async function shutdown(instance){await new Promise(resolve=>{instance.backups?.stop();instance.wss.close();instance.server.close(()=>{instance.db.close();resolve()})})}
test("manual snapshots are admin-only, verified and audited without revealing paths",{timeout:20000},async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-admin-backup-"));
 const previous=process.env.MOONVEIL_BACKUP_DIR;
 process.env.MOONVEIL_BACKUP_DIR=path.join(dir,"snapshots");
 let instance;
 try{
  instance=await boot(dir);
  const url="http://127.0.0.1:"+instance.server.address().port+"/api/admin/backup";
  const post=async bearer=>{
   const response=await fetch(url,{method:"POST",headers:bearer?{Authorization:"Bearer "+bearer}:{}});
   return {status:response.status,body:await response.json()};
  };
  assert.equal((await post()).status,401);
  const session=await fetch("http://127.0.0.1:"+instance.server.address().port+"/api/admin/sessions",{
   method:"POST",headers:{Authorization:"Bearer "+secret,"Content-Type":"application/json"},body:JSON.stringify({actorId:"alice"})});
  assert.equal(session.status,201);
  const actor=(await session.json()).accessToken;
  assert.equal((await post(actor)).status,403);
  assert.equal(instance.db.prepare("SELECT count(*) n FROM vtt_backup_audit").get().n,0);
  const created=await post(secret);
  assert.equal(created.status,201);
  assert.deepEqual(created.body,{success:true,verified:true});
  assert.equal(JSON.stringify(created.body).includes(dir),false);
  const snapshots=fs.readdirSync(process.env.MOONVEIL_BACKUP_DIR).filter(name=>name.endsWith(".sqlite"));
  assert.equal(snapshots.length,1);
  const snapshot=new Database(path.join(process.env.MOONVEIL_BACKUP_DIR,snapshots[0]),{readonly:true,fileMustExist:true});
  try{assert.equal(snapshot.pragma("integrity_check",{simple:true}),"ok")}finally{snapshot.close()}
  assert.equal(instance.db.prepare("SELECT outcome FROM vtt_backup_audit ORDER BY audit_id DESC LIMIT 1").get().outcome,"SUCCESS");
 }finally{
  if(instance)await shutdown(instance);
  if(previous===undefined)delete process.env.MOONVEIL_BACKUP_DIR;else process.env.MOONVEIL_BACKUP_DIR=previous;
  fs.rmSync(dir,{recursive:true,force:true});
 }
});
test("manual backup returns 503 when opt-in backup directory is absent",{timeout:20000},async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-backup-disabled-"));
 const previous=process.env.MOONVEIL_BACKUP_DIR;
 delete process.env.MOONVEIL_BACKUP_DIR;
 let instance;
 try{
  instance=await boot(dir);
  const response=await fetch("http://127.0.0.1:"+instance.server.address().port+"/api/admin/backup",{method:"POST",headers:{Authorization:"Bearer "+secret}});
  assert.equal(response.status,503);
  assert.equal((await response.json()).error,"BACKUPS_NOT_CONFIGURED");
 }finally{
  if(instance)await shutdown(instance);
  if(previous!==undefined)process.env.MOONVEIL_BACKUP_DIR=previous;
  fs.rmSync(dir,{recursive:true,force:true});
 }
});
