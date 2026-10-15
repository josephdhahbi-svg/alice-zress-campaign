'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {attachGameSocket}=require('./gameSocketTransport');
function setup(rows,failAt){
 const handlers={},sent=[],queries=[];let calls=0;
 const ws={readyState:1,on:(name,fn)=>handlers[name]=fn,send:v=>{calls++;if(calls===failAt)throw Error('socket failed');sent.push(JSON.parse(v))}};
 const db={prepare:()=>({all:(profile,cursor,limit)=>{queries.push({profile,cursor,limit});return rows.filter(r=>r.sequence>cursor).slice(0,limit)}})};
 return {ws,db,handlers,sent,queries};
}
const rows=[1,2,3].map(n=>({sequence:n,event_id:'EV_'+n,command_id:'CMD_'+n,event_json:JSON.stringify({type:'EVENT',n})}));
test('resume skips previously applied events',()=>{const x=setup(rows);const t=attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress',resumeAfter:2});assert.equal(t.flush(),1);assert.equal(x.sent[0].sequence,3)});
test('resume at zero replays full history',()=>{const x=setup(rows);assert.equal(attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'}).flush(),3)});
test('failed send does not advance cursor for failed event',()=>{const x=setup(rows,2);const t=attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'});assert.throws(()=>t.flush(),/socket failed/);assert.equal(t.getCursor(),1)});
test('batching preserves event order',()=>{const x=setup(rows);const t=attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress',maxBatch:2});assert.equal(t.flush(),2);assert.equal(t.flush(),1);assert.deepEqual(x.sent.map(e=>e.sequence),[1,2,3])});
test('invalid resume cursor rejected',()=>{const x=setup(rows);assert.throws(()=>attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress',resumeAfter:-1}))});
test('noninteger cursor rejected',()=>{const x=setup(rows);assert.throws(()=>attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress',resumeAfter:1.5}))});
test('client cannot submit fake resume command',()=>{const x=setup(rows);attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'});x.handlers.message('{"type":"SET_CURSOR","sequence":999}');assert.equal(x.sent.length,0)});
test('closed connection does not consume events',()=>{const x=setup(rows);x.ws.readyState=3;const t=attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'});assert.equal(t.flush(),0);assert.equal(t.getCursor(),0)});
