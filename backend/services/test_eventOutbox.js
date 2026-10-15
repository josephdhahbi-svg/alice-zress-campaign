'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {migrate,enqueue,since}=require('./eventOutbox');
let Database;
try { Database=require('better-sqlite3'); } catch (_) { Database=null; }
const run=Database?test:test.skip;
run('outbox preserves order and supports reconnect cursor',()=>{
 const db=new Database(':memory:');migrate(db);
 enqueue(db,{eventId:'e1',commandId:'c1',profileId:'alice-zress',event:{type:'QUEST_EVENT'}});
 enqueue(db,{eventId:'e2',commandId:'c2',profileId:'alice-zress',event:{type:'PLANAR_SHIFT_EVENT'}});
 const first=since(db,'alice-zress',0,1);assert.equal(first.length,1);
 assert.equal(since(db,'alice-zress',first[0].sequence).length,1);db.close();
});
run('duplicate event is not delivered twice',()=>{
 const db=new Database(':memory:');migrate(db);
 const e={eventId:'e1',commandId:'c1',profileId:'alice-zress',event:{type:'QUEST_EVENT'}};
 enqueue(db,e);enqueue(db,e);assert.equal(since(db,'alice-zress').length,1);db.close();
});
run('rolled-back event is not delivered',()=>{
 const db=new Database(':memory:');migrate(db);
 assert.throws(()=>db.transaction(()=>{enqueue(db,{eventId:'e1',commandId:'c1',profileId:'alice-zress',event:{type:'QUEST_EVENT'}});throw Error('abort')})());
 assert.equal(since(db,'alice-zress').length,0);db.close();
});
test('cursor validation rejects invalid input',()=>assert.throws(()=>since({},'alice-zress',-1)));
