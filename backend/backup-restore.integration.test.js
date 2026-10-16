"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createBackupService}=require("./backup-service");
test("WAL online backup restores campaign events and migrations",async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-restore-"));
 const original=path.join(directory,"original.sqlite");
 const db=new Database(original);
 let restored;
 try{
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  db.prepare("INSERT INTO vtt_campaigns(campaign_id,name,created_at) VALUES(?,?,?)")
    .run("alice","Alice Z'ress","2026-10-15T00:00:00Z");
  db.prepare("INSERT INTO vtt_campaign_members(campaign_id,actor_id,role) VALUES(?,?,?)")
    .run("alice","alice-dm","DM");
  db.prepare("INSERT INTO vtt_campaign_events(campaign_id,revision,event_id,actor_id,event_type,payload_json,occurred_at) VALUES(?,?,?,?,?,?,?)")
    .run("alice",1,"evt-1","alice-dm","CHOICE_RESOLVED",JSON.stringify({kind:"lawful_good"}),"2026-10-15T00:00:01Z");
  const backups=createBackupService(db,{directory:path.join(directory,"backups"),logger:{info(){},error(){}}});
  const snapshot=await backups.backupNow();
  assert.equal(snapshot.skipped,false);
  assert.equal(fs.existsSync(snapshot.path),true);
  restored=new Database(snapshot.path,{readonly:true,fileMustExist:true});
  assert.equal(restored.pragma("integrity_check",{simple:true}),"ok");
  const event=restored.prepare("SELECT revision,event_type,payload_json FROM vtt_campaign_events WHERE campaign_id=?").get("alice");
  assert.equal(event.revision,1);
  assert.equal(event.event_type,"CHOICE_RESOLVED");
  assert.deepEqual(JSON.parse(event.payload_json),{kind:"lawful_good"});
  assert.equal(restored.prepare("SELECT COUNT(*) AS n FROM vtt_schema_migrations").get().n,2);
  assert.equal(restored.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=?").get("alice").role,"DM");
  assert.equal(db.pragma("journal_mode",{simple:true}).toLowerCase(),"wal");
 }finally{
  restored?.close();db.close();fs.rmSync(directory,{recursive:true,force:true});
 }
});
