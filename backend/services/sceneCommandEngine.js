'use strict';
// A single authoritative transaction connects the five-choice contract,
// event ledger, deterministic world replay and reconnect-safe outbox.
const {randomUUID}=require('node:crypto');
const {validateChoiceCommand}=require('./heroicSceneContract');
const {initialWorld,reduceWorld,replay}=require('./worldReducer');
const {enqueue,since,migrate}=require('./eventOutbox');
function init(db){
 migrate(db);
 db.exec(`CREATE TABLE IF NOT EXISTS scene_snapshots (
 profile_id TEXT PRIMARY KEY,
 revision INTEGER NOT NULL CHECK(revision>=0),
 snapshot_json TEXT NOT NULL
 );`);
}
function snapshot(db,profileId){
 const row=db.prepare('SELECT snapshot_json FROM scene_snapshots WHERE profile_id=?').get(profileId);
 return row?JSON.parse(row.snapshot_json):initialWorld();
}
function resolve(db,input){
 const cmd=validateChoiceCommand(input);
 const run=db.transaction(()=>{
  const old=db.prepare('SELECT request_json,result_event_id FROM game_commands WHERE command_id=?').get(cmd.commandId);
  if(old){
   if(old.request_json!==JSON.stringify(cmd))throw new Error('Command ID reused with different payload');
   return {duplicate:true,world:snapshot(db,cmd.profileId),eventId:old.result_event_id};
  }
  const profile=db.prepare('SELECT profile_id,level,world_tick FROM game_profiles WHERE profile_id=?').get(cmd.profileId);
  if(!profile||profile.level!==1)throw new Error('Level-1 scene unavailable');
  const before=snapshot(db,cmd.profileId);
  if(before.revision!==cmd.expectedRevision)throw new Error('Stale world revision');
  const eventId='ev_'+randomUUID().replace(/-/g,'');
  const event={type:'HEROIC_CHOICE_COMMITTED',sceneId:cmd.sceneId,choiceId:cmd.choiceId,
    revision:before.revision+1,eventId,commandId:cmd.commandId};
  const after=reduceWorld(before,event);
  db.prepare('INSERT INTO game_commands(command_id,profile_id,command_type,request_json,result_event_id) VALUES(?,?,?,?,?)')
    .run(cmd.commandId,cmd.profileId,'HEROIC_CHOICE',JSON.stringify(cmd),eventId);
  db.prepare('INSERT INTO event_ledger(event_id,command_id,profile_id,event_type,event_json,world_tick) VALUES(?,?,?,?,?,?)')
    .run(eventId,cmd.commandId,cmd.profileId,event.type,JSON.stringify(event),after.worldTick);
  db.prepare('INSERT INTO scene_snapshots(profile_id,revision,snapshot_json) VALUES(?,?,?) ON CONFLICT(profile_id) DO UPDATE SET revision=excluded.revision,snapshot_json=excluded.snapshot_json')
    .run(cmd.profileId,after.revision,JSON.stringify(after));
  db.prepare('UPDATE game_profiles SET world_tick=? WHERE profile_id=?').run(after.worldTick,cmd.profileId);
  enqueue(db,{eventId,commandId:cmd.commandId,profileId:cmd.profileId,event});
  return {duplicate:false,world:after,eventId};
 });
 return run();
}
function audit(db,profileId){
 const events=db.prepare('SELECT event_json FROM event_ledger WHERE profile_id=? AND event_type=? ORDER BY world_tick ASC').all(profileId,'HEROIC_CHOICE_COMMITTED').map(r=>JSON.parse(r.event_json));
 const rebuilt=replay(events),stored=snapshot(db,profileId);
 return {valid:JSON.stringify(rebuilt)===JSON.stringify(stored),events:events.length,rebuilt,stored};
}
module.exports={init,resolve,snapshot,audit,since};
