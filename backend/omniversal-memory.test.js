"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {createOmniversalMemory}=require("./omniversal-memory");
test("memories persist across all books and traversals without leaking private knowledge",()=>{
 const db=new Database(":memory:");
 try{
  db.exec("CREATE TABLE vtt_campaign_members(campaign_id TEXT,actor_id TEXT,role TEXT)");
  for(const [campaign,actor,role] of [["moonveil","dm","DM"],["moonveil","alice","PLAYER"],["moonveil","bob","PLAYER"],["other","dm","DM"]])db.prepare("INSERT INTO vtt_campaign_members VALUES(?,?,?)").run(campaign,actor,role);
  const memory=createOmniversalMemory(db);
  const base={campaignId:"moonveil",memoryId:"secret_001",subjectId:"alice",memoryType:"DISCOVERY",visibility:"PRIVATE",description:"Alice discovers a hidden portal on her first journey.",trilogy:1,book:1,traversal:1,sourceEventId:"event_001",actorId:"dm"};
  assert.equal(memory.record(base).duplicate,false);
  assert.equal(memory.record(base).duplicate,true);
  assert.equal(memory.recall({campaignId:"moonveil",actorId:"alice",subjectId:"alice"}).length,1);
  assert.equal(memory.recall({campaignId:"moonveil",actorId:"bob",subjectId:"alice"}).length,0);
  assert.equal(memory.recall({campaignId:"other",actorId:"dm",subjectId:"alice"}).length,0);
  memory.record({...base,memoryId:"finale",memoryType:"CONSEQUENCE",visibility:"WORLD",description:"The world remembers Alice's final return to the beginning.",trilogy:10,book:30,traversal:7,sourceEventId:"event_210"});
  assert.equal(memory.recall({campaignId:"moonveil",actorId:"bob",subjectId:"alice"}).length,1);
  assert.throws(()=>memory.record({...base,memoryId:"bad",trilogy:2}),TypeError);
  assert.throws(()=>memory.record({...base,memoryId:"bad",actorId:"alice"}),/DM_REQUIRED/);
  assert.throws(()=>memory.record({...base,description:"Changed"}),/MEMORY_CONFLICT/);
 }finally{db.close()}
});
