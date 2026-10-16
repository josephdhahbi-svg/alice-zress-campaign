'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const Database=require('better-sqlite3');
const {migrate}=require('./migrations');

test('migration v3 is idempotent and survives database reopen',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'moonveil-migration-'));
 const file=path.join(dir,'test.sqlite');
 try{
  let db=new Database(file);
  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');
  migrate(db);migrate(db);
  assert.deepEqual(db.prepare('SELECT version FROM vtt_schema_migrations ORDER BY version').all().map(x=>x.version),[1,2,3]);
  db.prepare('INSERT INTO vtt_campaigns(campaign_id,name,created_at) VALUES(?,?,?)').run('c1','Test','2026-10-16');
  db.prepare('INSERT INTO vtt_campaign_members(campaign_id,actor_id,role) VALUES(?,?,?)').run('c1','alice','PLAYER');
  db.prepare('INSERT INTO vtt_characters(campaign_id,character_id,owner_actor_id) VALUES(?,?,?)').run('c1','alice-zress','alice');
  assert.throws(()=>db.prepare('INSERT INTO vtt_characters(campaign_id,character_id,owner_actor_id) VALUES(?,?,?)').run('c1','intruder','not-member'),/FOREIGN KEY/);
  db.prepare('INSERT INTO vtt_quest_objectives VALUES(?,?,?,?,?)').run('c1','alice-zress','Q-01-GADOR','rescue','event-1');
  db.prepare('INSERT INTO vtt_quest_completions VALUES(?,?,?,?,?)').run('c1','alice-zress','Q-01-GADOR','event-2','2026-10-16');
  db.prepare('INSERT INTO vtt_character_artifacts VALUES(?,?,?,?,?)').run('c1','alice-zress','Core Stone of Gador','Q-01-GADOR','2026-10-16');
  assert.throws(()=>db.prepare('INSERT INTO vtt_character_artifacts VALUES(?,?,?,?,?)').run('c1','alice-zress','Core Stone of Gador','Q-01-GADOR','2026-10-16'),/UNIQUE/);
  db.close();
  db=new Database(file);db.pragma('foreign_keys = ON');migrate(db);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM vtt_character_artifacts').get().n,1);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM vtt_quest_completions').get().n,1);
  db.close();
 }finally{fs.rmSync(dir,{recursive:true,force:true})}
});
