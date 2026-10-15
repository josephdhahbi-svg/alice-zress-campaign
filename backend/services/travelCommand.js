'use strict';
// Authoritative travel command. Caller derives profileId from authenticated session.
const routes=require('./modularRouteEngine');
const outbox=require('./eventOutbox');
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function id(v,name){if(typeof v!=='string'||!ID.test(v))throw new TypeError('Invalid '+name);}
function migrate(db){
 routes.migrate(db);outbox.migrate(db);
 db.exec(`CREATE TABLE IF NOT EXISTS travel_positions(profile_id TEXT NOT NULL,party_id TEXT NOT NULL,sector_id TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(profile_id,party_id));
 CREATE TABLE IF NOT EXISTS travel_commands(profile_id TEXT NOT NULL,command_id TEXT NOT NULL,party_id TEXT NOT NULL,route_id TEXT NOT NULL,revision INTEGER NOT NULL,PRIMARY KEY(profile_id,command_id));`);
}
function position(db,profileId,partyId){
 id(profileId,'profile');id(partyId,'party');
 return db.prepare('SELECT sector_id AS sectorId,revision FROM travel_positions WHERE profile_id=? AND party_id=?').get(profileId,partyId)||null;
}
function initialize(db,{profileId,partyId,sectorId}){
 [ [profileId,'profile'],[partyId,'party'],[sectorId,'sector'] ].forEach(([v,n])=>id(v,n));
 db.prepare('INSERT INTO travel_positions(profile_id,party_id,sector_id) VALUES(?,?,?) ON CONFLICT(profile_id,party_id) DO NOTHING').run(profileId,partyId,sectorId);
 return position(db,profileId,partyId);
}
function travel(db,{profileId,partyId,commandId,routeId,expectedRevision}){
 [[profileId,'profile'],[partyId,'party'],[commandId,'command'],[routeId,'route']].forEach(([v,n])=>id(v,n));
 if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)throw new RangeError('Invalid revision');
 db.exec('BEGIN IMMEDIATE');
 try{
  const previous=db.prepare('SELECT party_id,route_id,revision FROM travel_commands WHERE profile_id=? AND command_id=?').get(profileId,commandId);
  if(previous){
   if(previous.party_id!==partyId||previous.route_id!==routeId)throw new RangeError('Command reused');
   db.exec('COMMIT');return {revision:previous.revision,replayed:true};
  }
  const current=position(db,profileId,partyId);
  if(!current)throw new RangeError('Party location not initialized');
  if(current.revision!==expectedRevision)throw new RangeError('Stale location revision');
  const route=db.prepare('SELECT from_sector,to_sector,status FROM world_routes WHERE profile_id=? AND route_id=?').get(profileId,routeId);
  if(!route||route.status!=='DISCOVERED'||route.from_sector!==current.sectorId)throw new RangeError('Route unavailable');
  const next=current.revision+1;
  db.prepare('UPDATE travel_positions SET sector_id=?,revision=? WHERE profile_id=? AND party_id=?').run(route.to_sector,next,profileId,partyId);
  db.prepare('INSERT INTO travel_commands(profile_id,command_id,party_id,route_id,revision) VALUES(?,?,?,?,?)').run(profileId,commandId,partyId,routeId,next);
  outbox.enqueue(db,{eventId:'travel_'+profileId+'_'+commandId,commandId,profileId,event:{type:'PARTY_TRAVELED',partyId,routeId,fromSector:current.sectorId,toSector:route.to_sector,revision:next}});
  db.exec('COMMIT');return {sectorId:route.to_sector,revision:next,replayed:false};
 }catch(e){db.exec('ROLLBACK');throw e;}
}
module.exports={migrate,position,initialize,travel};
