"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {spawn}=require("node:child_process");
const net=require("node:net"),fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const Database=require("better-sqlite3");
const {CREATE_TABLES}=require("./faction-pulse");
const token="test-only-local-token-with-at-least-24-characters";
async function port(){const s=net.createServer();await new Promise(r=>s.listen(0,"127.0.0.1",r));const p=s.address().port;await new Promise(r=>s.close(r));return p;}
async function ready(child,url,headers){for(let i=0;i<80;i++){if(child.exitCode!==null)throw Error("Server exited "+child.exitCode);try{if((await fetch(url+"/api/health",{headers})).ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}throw Error("Server readiness timeout");}
test("DM dispute lifecycle over HTTP preserves ownership and audit", {timeout:20000},async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),"moonveil-http-dispute-")),file=path.join(dir,"db.sqlite");
 const seed=new Database(file);seed.pragma("foreign_keys=ON");seed.exec(CREATE_TABLES);
 seed.prepare("INSERT INTO factions(faction_id,faction_name,alignment) VALUES(?,?,?)").run("hero","Heroes","BLUE");
 seed.prepare("INSERT INTO factions(faction_id,faction_name,alignment) VALUES(?,?,?)").run("villain","Villains","RED");
 seed.prepare("INSERT INTO factions(faction_id,faction_name,alignment) VALUES(?,?,?)").run("outsider","Other","GREEN");
 seed.prepare("INSERT INTO territory_control(territory_id,territory_name,cosmological_sector,controlling_faction_id) VALUES(?,?,?,?)").run("pit","Pit","Underdark","villain");seed.close();
 const p=await port(),url="http://127.0.0.1:"+p;
 const child=spawn(process.execPath,["server.js"],{cwd:path.resolve(__dirname,".."),env:{...process.env,PORT:String(p),MOONVEIL_DEV_TOKEN:token,MOONVEIL_DB_PATH:file,MOONVEIL_ENABLE_CRON:"0"},stdio:"ignore"});
 const headers={Authorization:"Bearer "+token,"Content-Type":"application/json"};
 const post=(route,data,h=headers)=>fetch(url+route,{method:"POST",headers:h,body:JSON.stringify(data)});
 try{
  await ready(child,url,headers);
  const denied=await post("/api/war-table/dispute",{territoryId:"pit",aggressorFactionId:"hero"},{"Content-Type":"application/json"});assert.equal(denied.status,401);
  const first=await post("/api/war-table/dispute",{territoryId:"pit",aggressorFactionId:"hero"});assert.equal(first.status,200);const d=await first.json();assert.equal(d.status,"PENDING");assert.equal(d.escalationScore,10);
  const contested=await post("/api/war-table/dispute",{territoryId:"pit",aggressorFactionId:"outsider"});assert.equal(contested.status,409);
  let last;for(let i=0;i<4;i++){const response=await post("/api/war-table/dispute",{territoryId:"pit",aggressorFactionId:"hero"});assert.equal(response.status,200);last=await response.json();}
  assert.equal(last.status,"ESCALATED");assert.equal(last.escalationScore,100);assert.equal(last.disputeId,d.disputeId);
  const outsider=await post("/api/war-table/resolve",{disputeId:d.disputeId,winningFactionId:"outsider"});assert.equal(outsider.status,409);
  const resolved=await post("/api/war-table/resolve",{disputeId:d.disputeId,winningFactionId:"hero"});assert.equal(resolved.status,200);assert.equal((await resolved.json()).status,"RESOLVED");
  const repeated=await post("/api/war-table/resolve",{disputeId:d.disputeId,winningFactionId:"hero"});assert.equal(repeated.status,409);
 }finally{
  child.kill();await new Promise(r=>{if(child.exitCode!==null||child.signalCode!==null)r();else child.once("exit",r);});
  const db=new Database(file,{readonly:true});
  try{
   assert.equal(db.prepare("SELECT controlling_faction_id FROM territory_control WHERE territory_id='pit'").get().controlling_faction_id,"hero");
   assert.deepEqual(db.prepare("SELECT action FROM faction_dispute_audit ORDER BY audit_id").all().map(x=>x.action),["CREATED","ESCALATED","ESCALATED","ESCALATED","ESCALATED","RESOLVED"]);
   assert.equal(db.pragma("integrity_check",{simple:true}),"ok");
  }finally{db.close();fs.rmSync(dir,{recursive:true,force:true});}
 }
});
