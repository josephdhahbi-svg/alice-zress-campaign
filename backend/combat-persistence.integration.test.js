"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const Database=require("better-sqlite3");
const {migrate}=require("./migrations");
const {createCombatEngine}=require("./combat-engine");

test("combat WAL restart persistence, concurrent writer conflict, and idempotent retry",()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-combat-restart-"));
 const file=path.join(dir,"combat.sqlite");
 let first,second;
 try{
  first=new Database(file);
  first.pragma("journal_mode=WAL");
  first.pragma("foreign_keys=ON");
  first.pragma("busy_timeout=1000");
  migrate(first);
  first.prepare("INSERT INTO vtt_campaigns VALUES(?,?,?)").run("alpha","Alpha","now");
  first.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,'DM')").run("alpha","dm");
  const a=createCombatEngine(first);
  a.createEncounter({campaignId:"alpha",encounterId:"e1",actorId:"dm",combatants:[
   {combatantId:"alice",initiative:18,hp:5,maxHp:9},
   {combatantId:"enemy",initiative:9,hp:10,maxHp:10}
  ]});
  const action={campaignId:"alpha",encounterId:"e1",actorId:"dm",actionId:"hit1",kind:"DAMAGE",targetId:"enemy",amount:4};
  assert.equal(a.applyAction(action).combatants[1].hp,6);
  second=new Database(file);
  second.pragma("foreign_keys=ON");
  second.pragma("busy_timeout=1000");
  migrate(second);
  const b=createCombatEngine(second);
  assert.equal(b.getEncounter("alpha","e1").combatants[1].hp,6);
  assert.equal(b.applyAction(action).duplicate,true);
  assert.equal(b.getEncounter("alpha","e1").combatants[1].hp,6);
  assert.throws(()=>b.applyAction({...action,amount:5}),/IDEMPOTENCY_CONFLICT/);
  // Two independent SQLite connections submit the same logical action.
  const concurrent={...action,actionId:"hit2",amount:2};
  assert.equal(a.applyAction(concurrent).duplicate,false);
  assert.equal(b.applyAction(concurrent).duplicate,true);
  assert.equal(a.getEncounter("alpha","e1").combatants[1].hp,4);
  assert.equal(first.prepare("SELECT COUNT(*) AS n FROM vtt_combat_actions WHERE campaign_id='alpha'").get().n,2);
  assert.equal(first.pragma("journal_mode",{simple:true}).toLowerCase(),"wal");
  second.close();second=null;
  first.close();first=null;
  const reopened=new Database(file);
  try{
   reopened.pragma("foreign_keys=ON");
   migrate(reopened);
   const recovered=createCombatEngine(reopened).getEncounter("alpha","e1");
   assert.equal(recovered.combatants[1].hp,4);
   assert.equal(recovered.round,1);
  }finally{reopened.close();}
 }finally{
  second?.close();first?.close();
  fs.rmSync(dir,{recursive:true,force:true});
 }
});
