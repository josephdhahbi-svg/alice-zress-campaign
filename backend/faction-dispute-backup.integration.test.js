"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {initializeFactionPulseEngine}=require("./faction-pulse");
const {createFactionDisputeEngine}=require("./faction-dispute-engine");
const {createBackupService}=require("./backup-service");
test("WAL backup restores contested territory, audit, and campaign journal",async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-dispute-restore-"));
 const db=new Database(path.join(dir,"source.sqlite"));let restored;
 try{
  db.pragma("journal_mode=WAL");db.pragma("foreign_keys=ON");
  migrate(db);
  const pulse=initializeFactionPulseEngine(db,{random:()=>0.5});
  const disputes=createFactionDisputeEngine(db);
  db.prepare("INSERT INTO factions(faction_id,faction_name,alignment,influence_score) VALUES(?,?,?,?)").run("eilistraee","Sword Dancers","BLUE",85);
  db.prepare("INSERT INTO factions(faction_id,faction_name,alignment,influence_score) VALUES(?,?,?,?)").run("lolth","Lolth Cult","RED",20);
  db.prepare("INSERT INTO territory_control(territory_id,territory_name,cosmological_sector,controlling_faction_id) VALUES(?,?,?,?)").run("pit","Pit of Ghaunadaur","Underdark","lolth");
  db.prepare("INSERT INTO vtt_campaigns(campaign_id,name,created_at) VALUES(?,?,?)").run("alice","Alice Z'ress","2026-10-15T00:00:00Z");
  db.prepare("INSERT INTO vtt_campaign_members(campaign_id,actor_id,role) VALUES(?,?,?)").run("alice","dm","DM");
  db.prepare("INSERT INTO vtt_campaign_events(campaign_id,revision,event_id,actor_id,event_type,payload_json,occurred_at) VALUES(?,?,?,?,?,?,?)").run("alice",1,"choice-1","dm","CHOICE_RESOLVED",JSON.stringify({kind:"lawful_good"}),"2026-10-15T00:00:01Z");
  const dispute=disputes.triggerDispute("pit","eilistraee");
  const tick=pulse.runPulse(new Date("2026-10-15T13:00:00Z"));
  assert.deepEqual(tick.ownership,[]);
  assert.equal(db.prepare("SELECT controlling_faction_id FROM territory_control WHERE territory_id='pit'").get().controlling_faction_id,"lolth");
  const backup=createBackupService(db,{directory:path.join(dir,"backups"),logger:{info(){},error(){}}});
  const result=await backup.backupNow();assert.equal(result.skipped,false);
  restored=new Database(result.path,{readonly:true,fileMustExist:true});
  assert.equal(restored.pragma("integrity_check",{simple:true}),"ok");
  assert.equal(restored.prepare("PRAGMA foreign_key_check").all().length,0);
  assert.equal(restored.prepare("SELECT controlling_faction_id FROM territory_control WHERE territory_id='pit'").get().controlling_faction_id,"lolth");
  assert.equal(restored.prepare("SELECT status FROM faction_disputes WHERE dispute_id=?").get(dispute.disputeId).status,"PENDING");
  assert.deepEqual(restored.prepare("SELECT action FROM faction_dispute_audit WHERE dispute_id=?").all(dispute.disputeId).map(x=>x.action),["CREATED"]);
  assert.equal(restored.prepare("SELECT event_type FROM vtt_campaign_events WHERE campaign_id='alice'").get().event_type,"CHOICE_RESOLVED");
  assert.equal(restored.prepare("SELECT count(*) n FROM world_pulse_audit_log").get().n,1);
 }finally{restored?.close();db.close();fs.rmSync(dir,{recursive:true,force:true});}
});
