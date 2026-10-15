'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {attachGameSocket}=require('./gameSocketTransport');
function setup(rows=[]){
 const handlers={},sent=[],queries=[];
 const ws={readyState:1,on:(name,fn)=>handlers[name]=fn,send:value=>sent.push(JSON.parse(value))};
 const db={prepare:sql=>({all:(profile,cursor,limit)=>{queries.push({profile,cursor,limit});return rows.filter(r=>r.sequence>cursor).slice(0,limit)}})};
 return {ws,db,handlers,sent,queries};
}
const row={sequence:1,event_id:'EV_1',command_id:'CMD_1',event_json:JSON.stringify({type:'HEROIC_CHOICE_COMMITTED',choiceId:'UTILITY'})};
test('requires authenticated profile',()=>{const x=setup();assert.throws(()=>attachGameSocket(x.ws,{db:x.db}))});
test('delivers durable event',()=>{const x=setup([row]);const t=attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'});assert.equal(t.flush(),1);assert.equal(x.sent[0].type,'SERVER_EVENT')});
test('advances cursor after delivery',()=>{const x=setup([row]);const t=attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'});t.flush();assert.equal(t.getCursor(),1);assert.equal(t.flush(),0)});
test('queries only bound profile',()=>{const x=setup([row]);attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'}).flush();assert.equal(x.queries[0].profile,'alice-zress')});
test('rejects client world mutation',()=>{const x=setup();attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'});x.handlers.message('{"type":"LEVEL_UP"}');assert.equal(x.sent.length,0)});
test('responds to heartbeat',()=>{const x=setup();attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'});x.handlers.message('{"type":"PING_HEARTBEAT","nonce":"test"}');assert.equal(x.sent[0].type,'PONG_HEARTBEAT')});
test('no events while socket closed',()=>{const x=setup([row]);x.ws.readyState=3;assert.equal(attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress'}).flush(),0)});
test('invalid batch rejected',()=>{const x=setup();assert.throws(()=>attachGameSocket(x.ws,{db:x.db,profileId:'alice-zress',maxBatch:999}))});
