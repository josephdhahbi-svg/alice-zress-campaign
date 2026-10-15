'use strict';
const {createPartyRoster}=require('./partyRoster');
const {migrate: migrateOutbox,enqueue}=require('./eventOutbox');
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function valid(value,label){if(typeof value!=='string'||!ID.test(value))throw new TypeError('Invalid '+label);}
function migrate(db){
 db.exec(`CREATE TABLE IF NOT EXISTS party_rosters (
 profile_id TEXT NOT NULL, party_id TEXT NOT NULL, revision INTEGER NOT NULL,
 roster_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(profile_id,party_id));
 CREATE TABLE IF NOT EXISTS party_commands (
 profile_id TEXT NOT NULL, command_id TEXT NOT NULL, party_id TEXT NOT NULL,
 revision INTEGER NOT NULL, PRIMARY KEY(profile_id,command_id));`);
 migrateOutbox(db);
}
function load(db,profileId,partyId){
 valid(profileId,'profile');valid(partyId,'party');
 const row=db.prepare('SELECT revision,roster_json FROM party_rosters WHERE profile_id=? AND party_id=?').get(profileId,partyId);
 return row?{revision:row.revision,roster:JSON.parse(row.roster_json)}:null;
}
function save(db,{profileId,commandId,expectedRevision,roster}){
 valid(profileId,'profile');valid(commandId,'command');
 if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)throw new RangeError('Invalid expected revision');
 const normalized=createPartyRoster(roster);
 const partyId=normalized.partyId;
 db.exec('BEGIN IMMEDIATE');
 try{
  const previous=db.prepare('SELECT party_id,revision FROM party_commands WHERE profile_id=? AND command_id=?').get(profileId,commandId);
  if(previous){
   if(previous.party_id!==partyId)throw new RangeError('Command ID reused for another party');
   db.exec('COMMIT');return {revision:previous.revision,replayed:true};
  }
  const existing=db.prepare('SELECT revision FROM party_rosters WHERE profile_id=? AND party_id=?').get(profileId,partyId);
  const revision=existing?existing.revision:0;
  if(revision!==expectedRevision)throw new RangeError('Stale party revision');
  const next=revision+1;
  db.prepare(`INSERT INTO party_rosters(profile_id,party_id,revision,roster_json)
   VALUES(?,?,?,?) ON CONFLICT(profile_id,party_id) DO UPDATE SET
   revision=excluded.revision,roster_json=excluded.roster_json,updated_at=CURRENT_TIMESTAMP`)
   .run(profileId,partyId,next,JSON.stringify(normalized));
  db.prepare('INSERT INTO party_commands(profile_id,command_id,party_id,revision) VALUES(?,?,?,?)').run(profileId,commandId,partyId,next);
  enqueue(db,{eventId:'party_'+profileId+'_'+commandId,commandId,profileId,
   event:{type:'PARTY_ROSTER_SAVED',partyId,revision:next}});
  db.exec('COMMIT');return {revision:next,replayed:false};
 }catch(error){db.exec('ROLLBACK');throw error;}
}
module.exports={migrate,load,save};
