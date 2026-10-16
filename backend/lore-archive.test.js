"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const Database=require("better-sqlite3");
const {createLoreArchive}=require("./lore-archive");
test("FTS5 archive searches only the requested campaign",()=>{
 const db=new Database(":memory:");
 try{
  const archive=createLoreArchive(db);
  archive.put({campaignId:"a",docId:"moon",title:"Moonstone refuge",body:"A hidden silver moonstone cache awaits Alice."});
  archive.put({campaignId:"b",docId:"secret",title:"Moonstone refuge",body:"Private moonstone lore for another campaign."});
  const a=archive.search("a","moonstone");
  assert.equal(a.length,1);assert.equal(a[0].docId,"moon");
  assert.equal(archive.search("c","moonstone").length,0);
  assert.equal(archive.search("a","' OR 1=1 --").length,0);
  archive.put({campaignId:"a",docId:"moon",title:"Revised entry",body:"The portal now hums softly."});
  assert.equal(archive.search("a","moonstone").length,0);
  assert.equal(archive.search("a","portal").length,1);
  assert.throws(()=>archive.put({campaignId:"a",docId:"bad",title:"",body:"a"}),TypeError);
 }finally{db.close()}
});
