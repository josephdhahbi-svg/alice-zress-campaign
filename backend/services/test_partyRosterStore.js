'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');
const store=require('./partyRosterStore');
const {since}=require('./eventOutbox');
function fixture(){const db=new DatabaseSync(':memory:');store.migrate(db);return db;}
function roster(){return {partyId:'moonveil_party',leaderId:'Alice_Zress',members:[{characterId:'Alice_Zress',status:'ACTIVE',moralRole:'BLUE'},{characterId:'Little_Gonnador',status:'LOCKED'}],questRefs:['U01_SILVER_COURIER']};}
test('create and load roster',()=>{const db=fixture();assert.equal(store.save(db,{profileId:'alice',commandId:'cmd1',expectedRevision:0,roster:roster()}).revision,1);assert.equal(store.load(db,'alice','moonveil_party').roster.members[1].status,'LOCKED');db.close()});
test('replay command does not duplicate revision',()=>{const db=fixture(),args={profileId:'alice',commandId:'cmd1',expectedRevision:0,roster:roster()};store.save(db,args);assert.equal(store.save(db,args).replayed,true);assert.equal(store.load(db,'alice','moonveil_party').revision,1);db.close()});
test('stale revision rejected',()=>{const db=fixture(),args={profileId:'alice',commandId:'cmd1',expectedRevision:0,roster:roster()};store.save(db,args);assert.throws(()=>store.save(db,{...args,commandId:'cmd2'}),/Stale/);db.close()});
test('profiles isolated',()=>{const db=fixture();store.save(db,{profileId:'alice',commandId:'cmd1',expectedRevision:0,roster:roster()});assert.equal(store.load(db,'bob','moonveil_party'),null);db.close()});
test('outbox records successful save only',()=>{const db=fixture(),args={profileId:'alice',commandId:'cmd1',expectedRevision:0,roster:roster()};store.save(db,args);assert.equal(since(db,'alice').length,1);assert.throws(()=>store.save(db,{...args,commandId:'cmd2'}));assert.equal(since(db,'alice').length,1);db.close()});
test('invalid roster does not save',()=>{const db=fixture(),r=roster();r.members[1].status='ACTIVE_WRONG';assert.throws(()=>store.save(db,{profileId:'alice',commandId:'cmd1',expectedRevision:0,roster:r}));assert.equal(store.load(db,'alice','moonveil_party'),null);db.close()});
test('revision update preserves locked companion',()=>{const db=fixture(),args={profileId:'alice',commandId:'cmd1',expectedRevision:0,roster:roster()};store.save(db,args);store.save(db,{...args,commandId:'cmd2',expectedRevision:1});assert.equal(store.load(db,'alice','moonveil_party').roster.members[1].status,'LOCKED');db.close()});
test('command reuse across parties rejected',()=>{const db=fixture(),args={profileId:'alice',commandId:'cmd1',expectedRevision:0,roster:roster()};store.save(db,args);const r=roster();r.partyId='other_party';assert.throws(()=>store.save(db,{...args,roster:r}),/reused/);db.close()});
