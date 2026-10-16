"use strict";
/** Opt-in local development server. Never expose publicly without TLS, auth and deployment hardening. */
const express = require("express");
const http = require("node:http");
const { WebSocketServer, WebSocket } = require("ws");
const Database = require("better-sqlite3");
const { initializeFactionPulseEngine, scheduleFactionPulse } = require("./backend/faction-pulse");
const crypto = require("node:crypto");
const { migrate } = require("./backend/migrations");
const { createSessionAuth } = require("./backend/session-auth");
const { createBackupService } = require("./backend/backup-service");
const { resolveD20 } = require("./backend/dice-rules");

function startMoonveilServer({ port = Number(process.env.PORT || 3000),
  dbPath = process.env.MOONVEIL_DB_PATH || "moonveil_vtt.db",
  token = process.env.MOONVEIL_DEV_TOKEN, schedule = false } = {}) {
  if (!token || token.length < 24) throw new Error("Set MOONVEIL_DEV_TOKEN to a random secret of at least 24 characters");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.exec(`
CREATE TABLE IF NOT EXISTS inventory_items_extended (
 item_id TEXT PRIMARY KEY, item_name TEXT NOT NULL, rarity TEXT NOT NULL DEFAULT 'COMMON',
 item_type TEXT NOT NULL, bonus_stats TEXT NOT NULL DEFAULT '{}',
 secrets_lore TEXT NOT NULL DEFAULT '', extras TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS entity_equipment (
 entity_id TEXT NOT NULL, slot TEXT NOT NULL, item_id TEXT NOT NULL REFERENCES inventory_items_extended(item_id),
 PRIMARY KEY(entity_id,slot)
);
CREATE TABLE IF NOT EXISTS companion_relationships (
 entity_id TEXT NOT NULL, companion_name TEXT NOT NULL,
 approval_score INTEGER NOT NULL DEFAULT 0 CHECK(approval_score BETWEEN -100 AND 100),
 relationship_status TEXT NOT NULL DEFAULT 'NEUTRAL', romance_active INTEGER NOT NULL DEFAULT 0,
 PRIMARY KEY(entity_id,companion_name)
);
CREATE TABLE IF NOT EXISTS war_territories (
 territory_id TEXT PRIMARY KEY, book_id TEXT NOT NULL, territory_name TEXT NOT NULL,
 controlling_faction TEXT NOT NULL, garrison_power INTEGER NOT NULL DEFAULT 100,
 status TEXT NOT NULL DEFAULT 'STABLE'
);
CREATE TABLE IF NOT EXISTS character_deity_attunements (
 entity_id TEXT PRIMARY KEY, deity_id TEXT NOT NULL, shrine_id TEXT NOT NULL, attuned_at TEXT NOT NULL
);
`);
  migrate(db);
  const pulse = initializeFactionPulseEngine(db);
  const sessions=createSessionAuth(token);
  const hashSession=value=>crypto.createHash("sha256").update(value).digest("hex");
  const isRevoked=db.prepare("SELECT 1 FROM vtt_revoked_sessions WHERE token_hash=?");
  const revokeSession=db.prepare("INSERT OR IGNORE INTO vtt_revoked_sessions(token_hash,expires_at,revoked_at) VALUES(?,?,?)");
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));
  app.use((req,res,next) => {
    res.set("Cache-Control", "no-store");
    const supplied = req.get("Authorization") || "";
    const expected = "Bearer " + token;
    const a = Buffer.from(supplied), b = Buffer.from(expected);
    if (a.length===b.length && crypto.timingSafeEqual(a,b)) {
      req.auth={kind:"admin"};
    } else if(supplied.startsWith("Bearer ")) {
      const session=sessions.verify(supplied.slice(7));
      if(!session||isRevoked.get(hashSession(supplied.slice(7))))return res.status(401).json({success:false,error:"UNAUTHORIZED"});
      req.auth={kind:"actor",actorId:session.actorId};
    } else return res.status(401).json({success:false,error:"UNAUTHORIZED"});
    next();
  });
  const server = http.createServer(app);
  const id = value => typeof value==="string" && /^[a-zA-Z0-9:_-]{1,100}$/.test(value);
  const memberRole=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
  // Campaign-scoped sockets use signed actor sessions, never the shared admin token.
  // The URL carries no token; browsers pass it via WebSocket subprotocol.
  const wss = new WebSocketServer({noServer:true});
  server.on("upgrade",(req,socket,head)=>{
    let url;
    try{url=new URL(req.url,"http://localhost");}catch{socket.destroy();return;}
    if(url.pathname!=="/events"){socket.destroy();return;}
    const campaignId=url.searchParams.get("campaignId");
    const rawCursor=url.searchParams.get("after")??"0";
    const after=/^(0|[1-9][0-9]*)$/.test(rawCursor)?Number(rawCursor):NaN;
    const offered=(req.headers["sec-websocket-protocol"]||"").split(",").map(x=>x.trim());
    const encoded=offered.find(x=>x.startsWith("moonveil."));
    const accessToken=encoded?.slice("moonveil.".length);
    const session=accessToken?sessions.verify(accessToken):null;
    if(!id(campaignId)||!Number.isSafeInteger(after)||!session||isRevoked.get(hashSession(accessToken))||
       !memberRole.get(campaignId,session.actorId)){
      socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n");
      socket.destroy();return;
    }
    wss.handleUpgrade(req,socket,head,client=>{
      client.campaignId=campaignId;
      client.actorId=session.actorId;
      client.accessToken=accessToken;
      client.expiresAt=session.expiresAt;
      wss.emit("connection",client,req);
      const current=db.prepare("SELECT COALESCE(MAX(revision),0) AS revision FROM vtt_campaign_events WHERE campaign_id=?").get(campaignId).revision;
      client.send(JSON.stringify({type:"CONNECTED",campaignId,actorId:session.actorId,revision:current,replayAfter:after}));
      // Reconnect clients recover complete event payloads via the authenticated,
      // cursor-paginated HTTP journal; WebSocket is notification-only.
      if(current>after)client.send(JSON.stringify({type:"CATCH_UP_REQUIRED",campaignId,after,revision:current}));
    });
  });
  function broadcastCampaign(campaignId,event) {
    const message=JSON.stringify(event);
    for(const client of wss.clients){
      if(client.readyState!==WebSocket.OPEN||client.campaignId!==campaignId)continue;
      if(client.expiresAt<=Math.floor(Date.now()/1000)||
         isRevoked.get(hashSession(client.accessToken))||
         !memberRole.get(campaignId,client.actorId)){
        client.close(1008,"Session no longer authorized");continue;
      }
      client.send(message);
    }
  }
  // Legacy global notifications are disabled; they are not campaign-scoped.
  function broadcast(_event) {}
  const adminOnly=(req,res,next)=>req.auth.kind==="admin"?next():res.status(403).json({success:false,error:"ADMIN_REQUIRED"});
  const actorFor=req=>req.auth.kind==="actor"?req.auth.actorId:req.get("X-Moonveil-Actor");
  // Signed campaign member rolls are server-generated and recorded in the journal.
  // This is a development API, not a cryptographic fairness protocol.
  app.post("/api/campaigns/:campaignId/rolls", (req,res)=>{
    const campaignId=req.params.campaignId,actorId=actorFor(req);
    if(!id(campaignId)||!id(actorId))return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const membership=memberRole.get(campaignId,actorId);
    if(!membership)return res.status(403).json({success:false,error:"FORBIDDEN"});
    if(membership.role==="OBSERVER")return res.status(403).json({success:false,error:"FORBIDDEN"});
    const {eventId,expectedRevision,modifier=0,dc=15}=req.body||{};
    if(!id(eventId)||!Number.isSafeInteger(expectedRevision)||expectedRevision<0||
       !Number.isSafeInteger(modifier)||modifier< -10||modifier>20||
       !Number.isSafeInteger(dc)||dc<1||dc>40)
      return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const type="D20_ROLLED";
    const result=db.transaction(()=>{
      const prior=db.prepare("SELECT revision,actor_id,event_type,payload_json FROM vtt_campaign_events WHERE campaign_id=? AND event_id=?").get(campaignId,eventId);
      if(prior){
        if(prior.actor_id!==actorId||prior.event_type!==type)return {status:409,error:"IDEMPOTENCY_CONFLICT"};
        const payload=JSON.parse(prior.payload_json);
        if(payload.modifier!==modifier||payload.dc!==dc)return {status:409,error:"IDEMPOTENCY_CONFLICT"};
        return {status:200,revision:prior.revision,duplicate:true,roll:payload};
      }
      const current=db.prepare("SELECT COALESCE(MAX(revision),0) AS revision FROM vtt_campaign_events WHERE campaign_id=?").get(campaignId).revision;
      if(current!==expectedRevision)return {status:409,error:"REVISION_CONFLICT",revision:current};
      const rawRoll=crypto.randomInt(1,21);
      const roll=resolveD20({rawRoll,modifier,dc});
      db.prepare("INSERT INTO vtt_campaign_events(campaign_id,revision,event_id,actor_id,event_type,payload_json,occurred_at) VALUES(?,?,?,?,?,?,?)")
        .run(campaignId,current+1,eventId,actorId,type,JSON.stringify(roll),new Date().toISOString());
      return {status:201,revision:current+1,duplicate:false,roll};
    })();
    if(result.error)return res.status(result.status).json({success:false,...result});
    if(!result.duplicate)broadcastCampaign(campaignId,{type:"CAMPAIGN_EVENT",campaignId,revision:result.revision,eventType:type});
    res.status(result.status).json({success:true,campaignId,...result});
  });
  app.post("/api/admin/sessions",adminOnly,(req,res)=>{
    const {actorId,ttlSeconds}=req.body||{};
    if(!id(actorId)||ttlSeconds!==undefined&&(!Number.isSafeInteger(ttlSeconds)||ttlSeconds<60||ttlSeconds>86400))
      return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const expiresIn=ttlSeconds??3600;
    res.status(201).json({success:true,actorId,expiresIn,accessToken:sessions.issue(actorId,expiresIn)});
  });
  app.post("/api/admin/sessions/revoke",adminOnly,(req,res)=>{
    const accessToken=req.body?.accessToken;
    if(typeof accessToken!=="string"||accessToken.length>2048)
      return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const claims=sessions.verify(accessToken);
    if(!claims)return res.status(400).json({success:false,error:"INVALID_SESSION"});
    revokeSession.run(hashSession(accessToken),claims.expiresAt,new Date().toISOString());
    res.json({success:true,revoked:true});
  });
  app.post("/api/sessions/logout",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const accessToken=req.get("Authorization").slice(7);
    const claims=sessions.verify(accessToken);
    if(!claims)return res.status(401).json({success:false,error:"UNAUTHORIZED"});
    revokeSession.run(hashSession(accessToken),claims.expiresAt,new Date().toISOString());
    res.json({success:true,revoked:true});
  });
  app.get("/api/health",(_req,res)=>res.json({success:true,status:"Moonveil VTT local core",wal:true}));
  app.get("/api/war-table/overview/:bookId",adminOnly,(req,res)=>{
    if(!id(req.params.bookId))return res.status(400).json({success:false,error:"INVALID_BOOK"});
    const territories=db.prepare("SELECT * FROM war_territories WHERE book_id=? ORDER BY territory_id").all(req.params.bookId);
    res.json({success:true,territories});
  });
  app.get("/api/factions",adminOnly,(_req,res)=>{
    const factions=db.prepare("SELECT * FROM factions ORDER BY faction_id").all();
    const territories=db.prepare("SELECT * FROM territory_control ORDER BY territory_id").all();
    res.json({success:true,factions,territories});
  });
  app.post("/api/items/equip-advanced",adminOnly,(req,res)=>{
    const {entityId,itemId,slot}=req.body||{};
    if(!id(entityId)||!id(itemId)||!id(slot))return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const item=db.prepare("SELECT * FROM inventory_items_extended WHERE item_id=?").get(itemId);
    if(!item)return res.status(404).json({success:false,error:"ITEM_NOT_FOUND"});
    db.prepare("INSERT INTO entity_equipment(entity_id,slot,item_id) VALUES(?,?,?) ON CONFLICT(entity_id,slot) DO UPDATE SET item_id=excluded.item_id").run(entityId,slot,itemId);
    broadcast({type:"EQUIPMENT_CHANGED",entityId,slot,itemId});
    res.json({success:true,equippedItem:item.item_name,bonuses:JSON.parse(item.bonus_stats)});
  });
  app.post("/api/romance/approval",adminOnly,(req,res)=>{
    const {entityId,companionName,delta}=req.body||{};
    if(!id(entityId)||typeof companionName!=="string"||companionName.length<1||companionName.length>100||
      !Number.isInteger(delta)||delta< -20||delta>20)
      return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const update=db.transaction(()=>{
      db.prepare(`INSERT INTO companion_relationships(entity_id,companion_name,approval_score)
        VALUES(?,?,?) ON CONFLICT(entity_id,companion_name)
        DO UPDATE SET approval_score=MAX(-100,MIN(100,approval_score+excluded.approval_score))`)
        .run(entityId,companionName,delta);
      return db.prepare("SELECT approval_score,relationship_status,romance_active FROM companion_relationships WHERE entity_id=? AND companion_name=?").get(entityId,companionName);
    });
    const relationship=update();
    broadcast({type:"APPROVAL_CHANGED",entityId,companionName,approval:relationship.approval_score});
    res.json({success:true,relationship});
  });
  // The shared development token grants a DM-level local role. Per-user identity
  // is intentionally not claimed; this route is not suitable for public hosting.
  app.post("/api/campaigns",adminOnly,(req,res)=>{
    const {campaignId,name,actorId}=req.body||{};
    if(!id(campaignId)||!id(actorId)||typeof name!=="string"||name.trim().length<1||name.length>120)
      return res.status(400).json({success:false,error:"INVALID_INPUT"});
    try{
      db.transaction(()=>{
        db.prepare("INSERT INTO vtt_campaigns(campaign_id,name,created_at) VALUES(?,?,?)")
          .run(campaignId,name.trim(),new Date().toISOString());
        db.prepare("INSERT INTO vtt_campaign_members(campaign_id,actor_id,role) VALUES(?,?,'DM')")
          .run(campaignId,actorId);
      })();
      res.status(201).json({success:true,campaignId,revision:0});
    }catch(err){
      if(err.code?.startsWith("SQLITE_CONSTRAINT"))return res.status(409).json({success:false,error:"CAMPAIGN_EXISTS"});
      throw err;
    }
  });
  app.get("/api/campaigns/:campaignId/events",(req,res)=>{
    const campaignId=req.params.campaignId,actorId=actorFor(req);
    if(!id(campaignId)||!id(actorId))return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?").get(campaignId,actorId);
    if(!member)return res.status(403).json({success:false,error:"NOT_A_MEMBER"});
    const after=Number(req.query.after ?? 0);
    if(!Number.isSafeInteger(after)||after<0)return res.status(400).json({success:false,error:"INVALID_CURSOR"});
    const events=db.prepare("SELECT revision,event_id,actor_id,event_type,payload_json,occurred_at FROM vtt_campaign_events WHERE campaign_id=? AND revision>? ORDER BY revision LIMIT 100").all(campaignId,after);
    res.json({success:true,campaignId,nextCursor:events.length?events[events.length-1].revision:after,hasMore:events.length===100,events:events.map(e=>({...e,payload:JSON.parse(e.payload_json),payload_json:undefined}))});
  });
  app.post("/api/campaigns/:campaignId/events",(req,res)=>{
    const campaignId=req.params.campaignId,actorId=actorFor(req);
    const {eventId,expectedRevision,eventType,payload}=req.body||{};
    if(!id(campaignId)||!id(actorId)||!id(eventId)||!id(eventType)||
      !Number.isSafeInteger(expectedRevision)||expectedRevision<0||
      !payload||typeof payload!=="object"||Array.isArray(payload)||
      JSON.stringify(payload).length>16000)
      return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?").get(campaignId,actorId);
    if(!member||member.role==="OBSERVER")return res.status(403).json({success:false,error:"FORBIDDEN"});
    const append=db.transaction(()=>{
      const prior=db.prepare("SELECT revision,actor_id,event_type,payload_json FROM vtt_campaign_events WHERE campaign_id=? AND event_id=?").get(campaignId,eventId);
      const encoded=JSON.stringify(payload);
      if(prior){
        if(prior.actor_id!==actorId||prior.event_type!==eventType||prior.payload_json!==encoded)return {status:409,error:"IDEMPOTENCY_CONFLICT"};
        return {status:200,revision:prior.revision,duplicate:true};
      }
      const current=db.prepare("SELECT COALESCE(MAX(revision),0) AS revision FROM vtt_campaign_events WHERE campaign_id=?").get(campaignId).revision;
      if(current!==expectedRevision)return {status:409,error:"REVISION_CONFLICT",revision:current};
      db.prepare("INSERT INTO vtt_campaign_events(campaign_id,revision,event_id,actor_id,event_type,payload_json,occurred_at) VALUES(?,?,?,?,?,?,?)")
        .run(campaignId,current+1,eventId,actorId,eventType,encoded,new Date().toISOString());
      return {status:201,revision:current+1,duplicate:false};
    });
    const result=append();
    if(result.error)return res.status(result.status).json({success:false,...result});
    if(!result.duplicate)broadcastCampaign(campaignId,{type:"CAMPAIGN_EVENT",campaignId,revision:result.revision,eventType});
    res.status(result.status).json({success:true,campaignId,...result});
  });
  app.post("/api/admin/world-pulse",adminOnly,(req,res)=>{
    const result=pulse.runPulse();
    if(result.applied)broadcast({type:"FACTION_PULSE",result});
    res.json({success:true,...result});
  });
  const backups=process.env.MOONVEIL_BACKUP_DIR
    ?createBackupService(db,{directory:process.env.MOONVEIL_BACKUP_DIR,
       retain:Number(process.env.MOONVEIL_BACKUP_RETAIN||14)}):null;
  if(backups)backups.start();
  let job;
  if(schedule) {
    const cron=require("node-cron");
    job=scheduleFactionPulse({runPulse:()=>{const result=pulse.runPulse();if(result.applied)broadcast({type:"FACTION_PULSE",result});return result;}},cron);
  }
  // Loopback only by default. Reverse proxies must supply their own security.
  server.listen(port,"127.0.0.1",()=>console.log("Moonveil local server on http://127.0.0.1:"+port));
  return {app,server,db,wss,backups,close:()=>{if(job)job.stop();backups?.stop();wss.close();server.close(()=>db.close());}};
}
if(require.main===module)startMoonveilServer({schedule:process.env.MOONVEIL_ENABLE_CRON==="1"});
module.exports={startMoonveilServer};
