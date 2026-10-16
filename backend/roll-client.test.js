"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {createRollClient}=require("../game/roll-client");
test("roll client sends one authenticated request with stable idempotency key",async()=>{
 let calls=0;
 const client=createRollClient({baseUrl:"http://127.0.0.1:3000/",campaignId:"alice",accessToken:"signed-test",fetchImpl:async(url,opts)=>{
  calls++;assert.equal(url,"http://127.0.0.1:3000/api/campaigns/alice/rolls");
  assert.equal(opts.headers.Authorization,"Bearer signed-test");
  assert.equal(opts.cache,"no-store");assert.equal(opts.redirect,"error");
  assert.deepEqual(JSON.parse(opts.body),{eventId:"roll-1",expectedRevision:2,modifier:3,dc:16});
  return {ok:true,json:async()=>({success:true,revision:3,roll:{rawRoll:12,total:15,success:false}})};
 }});
 assert.equal((await client.roll({eventId:"roll-1",expectedRevision:2,modifier:3,dc:16})).revision,3);
 assert.equal(calls,1);
});
test("roll client blocks unsafe origins and malformed roll requests",async()=>{
 assert.throws(()=>createRollClient({baseUrl:"http://example.com",campaignId:"alice",accessToken:"token"}),/Only HTTPS/);
 assert.throws(()=>createRollClient({baseUrl:"https://example.com",campaignId:"bad/path",accessToken:"token"}),/campaign/);
 const client=createRollClient({baseUrl:"https://example.com",campaignId:"alice",accessToken:"token",fetchImpl:()=>{throw Error("should not fetch");}});
 await assert.rejects(client.roll({eventId:"bad/id",expectedRevision:0}),/event ID/);
 await assert.rejects(client.roll({eventId:"roll",expectedRevision:-1}),/revision/);
 await assert.rejects(client.roll({eventId:"roll",expectedRevision:0,dc:41}),/DC/);
});
test("roll client reports revision conflicts without automatic reroll",async()=>{
 let calls=0;
 const client=createRollClient({baseUrl:"https://example.com",campaignId:"alice",accessToken:"token",fetchImpl:async()=>{
  calls++;return {ok:false,status:409,json:async()=>({success:false,error:"REVISION_CONFLICT",revision:8})};
 }});
 await assert.rejects(client.roll({eventId:"roll-2",expectedRevision:3}),e=>e.code==="REVISION_CONFLICT"&&e.revision===8);
 assert.equal(calls,1);
});
