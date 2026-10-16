"use strict";
/** Opt-in local development server. Never expose publicly without TLS, auth and deployment hardening. */
const express = require("express");
const http = require("node:http");
const path = require("node:path");
const { WebSocketServer, WebSocket } = require("ws");
const Database = require("better-sqlite3");
const { initializeFactionPulseEngine, scheduleFactionPulse } = require("./backend/faction-pulse");
const crypto = require("node:crypto");
const { migrate } = require("./backend/migrations");
const { createSessionAuth } = require("./backend/session-auth");
const { createBackupService } = require("./backend/backup-service");
const { resolveD20 } = require("./backend/dice-rules");
const { createFactionDisputeEngine } = require("./backend/faction-dispute-engine");
const { createLivingWorldEngine } = require("./backend/living-world-pulse");
const { createWorldEconomyEngine } = require("./backend/world-economy");
const { createSettlementTradeEngine } = require("./backend/settlement-trade-engine");
const { createSettlementMarketPulseEngine } = require("./backend/settlement-market-pulse");
const { createCombatEngine } = require("./backend/combat-engine");
const { createQuestEvidenceEngine } = require("./backend/quest-evidence-engine");
const { listAscensionPaths, getAscensionPath } = require("./backend/ascension-path-catalog");
const { getMultiverseAdventureIndex, availableRouteLeads } = require("./backend/multiverse-adventure-index");
const { planTimeSpaceJourney, listTimeSpaceEras, listTravelMethods } = require("./backend/rabbit-hole-time-space");
const { createChronalTravelEngine } = require("./backend/chronal-travel-engine");
const { getDialogueScene, getDialogueChoices, previewDialogueChoice } = require("./backend/dialogue-engine");
const { listSacredAscensions, getSacredAscension, evaluateSacredAscension } = require("./backend/sacred-lich-ascensions");
const { getAliceDemiplane, previewAliceDemiplaneAccess } = require("./backend/alice-demiplane-catalog");
const { listAliceDemiplaneRooms, getAliceDemiplaneRoom, previewAliceDemiplaneRoomChoice } = require("./backend/alice-demiplane-rooms");
const { createAliceExplorationJournal } = require("./backend/alice-exploration-journal");
const { listPlanarWeatherHazards, previewPlanarWeatherHazard } = require("./backend/planar-weather-engine");
const { listFuturePlanarHoldings, previewFuturePlanarHolding } = require("./backend/future-planar-holdings");
const { listEpicQuestCandidates, previewEpicQuestCandidate } = require("./backend/epic-quest-candidates");
const { listLichdomRitualVariants, previewLichdomRitualVariant } = require("./backend/lichdom-ritual-variants");
const { getEpicQuestTemplate } = require("./backend/epic-quest-templates");
const { listChronosAnomalies, previewChronosStabilization } = require("./backend/chronos-anomaly-catalog");
const { createChronosReviewEngine } = require("./backend/chronos-review-engine");
const { askMoonveilAi, validateAiRequest } = require("./backend/moonveil-ai-director");

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
  // Create faction base tables before disputes, then initialize pulse queries.
  db.exec(require("./backend/faction-pulse").CREATE_TABLES);
  const disputes = createFactionDisputeEngine(db);
  const livingWorld = createLivingWorldEngine(db);
  const worldEconomy = createWorldEconomyEngine(db);
  const settlementTrade = createSettlementTradeEngine(db);
  const settlementMarketPulse = createSettlementMarketPulseEngine(db);
  const combat = createCombatEngine(db);
  const questEvidence = createQuestEvidenceEngine(db);
  const chronalTravel = createChronalTravelEngine(db);
  const aliceJournal = createAliceExplorationJournal(db);
  const chronosReviews = createChronosReviewEngine(db);
  const pulse = initializeFactionPulseEngine(db);
  const sessions=createSessionAuth(token);
  const hashSession=value=>crypto.createHash("sha256").update(value).digest("hex");
  const isRevoked=db.prepare("SELECT 1 FROM vtt_revoked_sessions WHERE token_hash=?");
  const revokeSession=db.prepare("INSERT OR IGNORE INTO vtt_revoked_sessions(token_hash,expires_at,revoked_at) VALUES(?,?,?)");
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));
  // Explicit local public-asset allowlist; no directories or user-controlled paths.
  // Only the HTML/CSS shell is public; every campaign API remains signed and member-scoped.
  const prototypeDir=path.join(__dirname,"prototype");
  const publicPages=new Map([
    ["/play/alice",["alice-room-atlas.html","text/html; charset=utf-8"]],
    ["/play/moonveil-theme.css",["moonveil-theme.css","text/css; charset=utf-8"]],
    ["/play/alice-room-atlas.js",["alice-room-atlas.js","text/javascript; charset=utf-8"]]
  ]);
  app.get(["/play/alice","/play/moonveil-theme.css","/play/alice-room-atlas.js"],(req,res)=>{
    const asset=publicPages.get(req.path);
    if(!asset)return res.status(404).end();
    res.set("Cache-Control","no-store");
    res.set("X-Content-Type-Options","nosniff");
    res.set("Content-Security-Policy","default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; object-src 'none'; form-action 'self'; frame-ancestors 'none'");
    return res.type(asset[1]).sendFile(path.join(prototypeDir,asset[0]));
  });
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
  // Explicit DM-authorized travel only. Character ownership is enforced on reads.
  app.get("/api/campaigns/:campaignId/characters/:characterId/location",(req,res)=>{
    const {campaignId,characterId}=req.params,actorId=req.auth.actorId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!id(characterId)||!memberRole.get(campaignId,actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const owner=db.prepare("SELECT owner_actor_id FROM vtt_characters WHERE campaign_id=? AND character_id=?").get(campaignId,characterId);
    if(!owner||(memberRole.get(campaignId,actorId).role!=="DM"&&owner.owner_actor_id!==actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,location:chronalTravel.getLocation(campaignId,characterId)});
  });
  for(const [suffix,method] of [["initialize","initializeLocation"],["travel","executeTravel"]]){
    app.post("/api/campaigns/:campaignId/characters/:characterId/"+suffix,(req,res)=>{
      const {campaignId,characterId}=req.params,actorId=req.auth.actorId;
      if(req.auth.kind!=="actor"||!id(campaignId)||!id(characterId)||memberRole.get(campaignId,actorId)?.role!=="DM")
        return res.status(403).json({success:false,error:"DM_REQUIRED"});
      try{
        const result=chronalTravel[method]({...req.body,campaignId,characterId,actorId});
        return res.status(result.duplicate?200:201).json({success:true,...result});
      }catch(error){
        return res.status(error instanceof TypeError?400:409).json({success:false,error:error.message});
      }
    });
  }
  // Time-space itinerary preview is member-only and never commits movement or rewards.
  app.get("/api/campaigns/:campaignId/world/time-space",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,eras:listTimeSpaceEras(),methods:listTravelMethods(),origin:"pit_ghaunadaur"});
  });
  app.post("/api/campaigns/:campaignId/world/time-space/plan",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const plan=planTimeSpaceJourney(req.body||{});
    return res.status(plan.reason==="INVALID_DR_DATE"||plan.reason==="UNKNOWN_LOCATION"||plan.reason==="UNKNOWN_TRAVEL_METHOD"?400:200)
      .json({success:true,...plan});
  });
  // Explicit DM planning step: register a candidate's objectives in the existing evidence ledger.
  app.get("/api/campaigns/:campaignId/world/epic-quest-candidates/:questId/template",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const template=getEpicQuestTemplate(req.params.questId);
    return template?res.json({success:true,template,mode:"PLANNING_ONLY"}):res.status(404).json({success:false,error:"NOT_FOUND"});
  });
  app.post("/api/campaigns/:campaignId/world/epic-quest-candidates/:questId/register-template",(req,res)=>{
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    if(req.auth.kind!=="actor"||!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")
      return res.status(403).json({success:false,error:"DM_REQUIRED"});
    const template=getEpicQuestTemplate(req.params.questId);
    if(!template)return res.status(404).json({success:false,error:"NOT_FOUND"});
    if(!template.registrationAllowed)return res.status(409).json({success:false,error:"FUTURE_QUEST_LOCKED"});
    try{
      const result=questEvidence.registerQuest({campaignId,questId:req.params.questId,actorId,requiredObjectiveIds:template.requiredObjectiveIds});
      return res.status(result.duplicate?200:201).json({success:true,...result,questId:req.params.questId,requiredObjectiveIds:template.requiredObjectiveIds,approved:false,rewards:[],reputationGranted:0});
    }catch(error){return res.status(error instanceof TypeError?400:409).json({success:false,error:error instanceof TypeError?"INVALID_INPUT":"QUEST_DEFINITION_CONFLICT"});}
  });
  app.post("/api/campaigns/:campaignId/chronos/reviews",(req,res)=>{
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    if(req.auth.kind!=="actor"||!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const result=chronosReviews.review({...(req.body||{}),campaignId,actorId});
      return res.status(result.duplicate?200:201).json({success:true,...result,timelineMutated:false,rewards:[]});
    }catch(error){return res.status(error instanceof TypeError?400:409).json({success:false,error:error instanceof TypeError?"INVALID_REVIEW":"REVIEW_CONFLICT"});}
  });
  app.get("/api/campaigns/:campaignId/chronos/reviews",(req,res)=>{
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    if(req.auth.kind!=="actor"||!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    return res.json({success:true,reviews:chronosReviews.list(campaignId,actorId),mode:"ADJUDICATION_ONLY"});
  });
  app.get("/api/campaigns/:campaignId/chronos/anomalies",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,anomalies:listChronosAnomalies(),mode:"READ_ONLY"});
  });
  app.post("/api/campaigns/:campaignId/chronos/preview",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))return res.status(403).json({success:false,error:"FORBIDDEN"});
    try{
      const preview=previewChronosStabilization(req.body||{});
      return preview?res.json({success:true,preview}):res.status(404).json({success:false,error:"UNKNOWN_ANOMALY"});
    }catch(error){return res.status(400).json({success:false,error:"INVALID_CHRONOS_INPUT"});}
  });
  app.get("/api/campaigns/:campaignId/ai/status",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,configured:Boolean(process.env.OPENAI_API_KEY),role:"ADVISORY_STORY_GUIDE",gameMutation:false});
  });
  app.post("/api/campaigns/:campaignId/ai/chat",async(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))return res.status(403).json({success:false,error:"FORBIDDEN"});
    try{
      const request=validateAiRequest(req.body||{});
      if(request.mode==="DM_PREP"&&memberRole.get(campaignId,req.auth.actorId)?.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
      const result=await askMoonveilAi(request);
      return res.status(result.available?200:503).json({success:result.available,...result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_AI_INPUT"});
      return res.status(502).json({success:false,error:"AI_PROVIDER_UNAVAILABLE"});
    }
  });
  // Proposed quest and ritual LEGOs are inspectable but cannot grant progression.
  app.get("/api/campaigns/:campaignId/world/epic-quest-candidates",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,quests:listEpicQuestCandidates(),mode:"READ_ONLY"});
  });
  app.get("/api/campaigns/:campaignId/world/epic-quest-candidates/:questId",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const preview=previewEpicQuestCandidate(req.params.questId);
    return preview?res.json({success:true,preview}):res.status(404).json({success:false,error:"NOT_FOUND"});
  });
  app.get("/api/campaigns/:campaignId/world/lichdom-ritual-variants",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,variants:listLichdomRitualVariants(),mode:"READ_ONLY"});
  });
  app.get("/api/campaigns/:campaignId/world/lichdom-ritual-variants/:number",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const number=Number(req.params.number);
    if(!Number.isInteger(number)||number<1||number>11)return res.status(400).json({success:false,error:"INVALID_PATH_NUMBER"});
    const preview=previewLichdomRitualVariant(number);
    return preview?res.json({success:true,preview}):res.status(404).json({success:false,error:"NOT_FOUND"});
  });
  // Future demiplane holdings are lore previews, never a travel or resurrection grant.
  app.get("/api/campaigns/:campaignId/world/future-holdings",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,holdings:listFuturePlanarHoldings(),mode:"READ_ONLY"});
  });
  app.post("/api/campaigns/:campaignId/world/future-holdings/:holdingId/preview",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    try{
      const preview=previewFuturePlanarHolding(req.params.holdingId,(req.body||{}).state||"QUIESCENT");
      return preview?res.json({success:true,preview}):res.status(404).json({success:false,error:"NOT_FOUND"});
    }catch(error){return res.status(400).json({success:false,error:"INVALID_STATE"});}
  });
  // Planar weather is a DM-reviewed preview, never automatic damage or conditions.
  app.get("/api/campaigns/:campaignId/weather/hazards",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,hazards:listPlanarWeatherHazards(),mode:"PREVIEW_ONLY"});
  });
  app.post("/api/campaigns/:campaignId/weather/preview",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const {hazardId,unitId,rounds=5}=req.body||{};
    try{
      const preview=previewPlanarWeatherHazard(hazardId,unitId,rounds);
      return preview?res.json({success:true,preview}):res.status(404).json({success:false,error:"UNKNOWN_HAZARD"});
    }catch(error){return res.status(400).json({success:false,error:"INVALID_INPUT"});}
  });
  // Durable narrative proposals only; no travel, ascension, rewards or HP changes.
  app.get("/api/campaigns/:campaignId/world/alice-demiplane/journal",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))return res.status(403).json({success:false,error:"FORBIDDEN"});
    const limit=req.query.limit===undefined?50:Number(req.query.limit);
    if(!Number.isSafeInteger(limit)||limit<1||limit>100)return res.status(400).json({success:false,error:"INVALID_LIMIT"});
    const role=memberRole.get(campaignId,req.auth.actorId).role;
    const entries=aliceJournal.list(campaignId,limit).filter(x=>role==="DM"||x.actor_id===req.auth.actorId);
    return res.json({success:true,entries,mode:"NARRATIVE_ONLY"});
  });
  app.post("/api/campaigns/:campaignId/world/alice-demiplane/journal",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))return res.status(403).json({success:false,error:"FORBIDDEN"});
    try{
      const {entryId,roomId,choiceNumber}=req.body||{};
      const entry=aliceJournal.submit({campaignId,entryId,roomId,choiceNumber,actorId:req.auth.actorId});
      return res.status(entry.duplicate?200:201).json({success:true,entry,effect:"NONE",rewards:[]});
    }catch(error){return res.status(error instanceof TypeError?400:409).json({success:false,error:error.message==="ROOM_LOCKED"?"ROOM_LOCKED":error instanceof TypeError?"INVALID_INPUT":"ENTRY_CONFLICT"});}
  });
  app.post("/api/campaigns/:campaignId/world/alice-demiplane/journal/:entryId/review",(req,res)=>{
    const {campaignId,entryId}=req.params;
    if(req.auth.kind!=="actor"||!id(campaignId)||!id(entryId))return res.status(403).json({success:false,error:"FORBIDDEN"});
    const membership=memberRole.get(campaignId,req.auth.actorId);
    if(!membership||membership.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const {status,note}=req.body||{};
      const entry=aliceJournal.review({campaignId,entryId,dmActorId:req.auth.actorId,status,note});
      return res.json({success:true,entry,effect:"NONE",rewards:[]});
    }catch(error){return res.status(error instanceof TypeError?400:error.message==="NOT_FOUND"?404:409).json({success:false,error:error instanceof TypeError?"INVALID_INPUT":error.message});}
  });
  // Authenticated room and choice previews. No entry, movement or rewards.
  app.get("/api/campaigns/:campaignId/world/alice-demiplane/rooms",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,rooms:listAliceDemiplaneRooms(),mode:"READ_ONLY"});
  });
  app.get("/api/campaigns/:campaignId/world/alice-demiplane/rooms/:roomId",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const room=getAliceDemiplaneRoom(req.params.roomId);
    if(!room)return res.status(404).json({success:false,error:"UNKNOWN_ROOM"});
    return res.json({success:true,room,mode:"READ_ONLY"});
  });
  app.post("/api/campaigns/:campaignId/world/alice-demiplane/rooms/:roomId/preview",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const preview=previewAliceDemiplaneRoomChoice(req.params.roomId,req.body?.choiceNumber);
    return res.status(preview.reason==="UNKNOWN_ROOM"?404:preview.reason==="INVALID_CHOICE"?400:200).json({success:true,...preview});
  });
  // Campaign-scoped, read-only Rabbit Hole geography. No warp or reward action.
  app.get("/api/campaigns/:campaignId/world/alice-demiplane",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,demiplane:getAliceDemiplane(),access:previewAliceDemiplaneAccess({})});
  });
  // Sacred lich dossiers are read-only proposals, never state-changing rewards.
  app.get("/api/campaigns/:campaignId/ascensions/sacred",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,paths:listSacredAscensions(),status:"PROPOSED_NO_REWARDS"});
  });
  app.get("/api/campaigns/:campaignId/ascensions/sacred/:pathId",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const path=getSacredAscension(req.params.pathId);
    if(!path)return res.status(404).json({success:false,error:"UNKNOWN_ASCENSION"});
    return res.json({success:true,path});
  });
  // Read-only authored dialogue, with actor membership and no character mutation.
  app.get("/api/campaigns/:campaignId/dialogue/:nodeId",(req,res)=>{
    const {campaignId,nodeId}=req.params;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const scene=getDialogueScene(nodeId);
    if(!scene)return res.status(404).json({success:false,error:"UNKNOWN_SCENE"});
    return res.json({success:true,scene:{id:scene.id,name:scene.name,plane:scene.plane,region:scene.region,drYear:scene.drYear,sourceStatus:scene.sourceStatus},choices:getDialogueChoices(nodeId)});
  });
  app.post("/api/campaigns/:campaignId/dialogue/:nodeId/preview",(req,res)=>{
    const {campaignId,nodeId}=req.params;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const preview=previewDialogueChoice(nodeId,req.body?.choiceType);
    return res.status(preview.reason==="UNKNOWN_SCENE"?404:preview.reason==="INVALID_CHOICE"?400:200).json({success:true,...preview});
  });
  // Discoverable routes only: no implicit teleport, date progression or character mutation.
  app.get("/api/campaigns/:campaignId/world/adventures",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,...getMultiverseAdventureIndex()});
  });
  app.get("/api/campaigns/:campaignId/world/adventures/:nodeId/leads",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const nodeId=req.params.nodeId;
    if(!id(nodeId)||!getMultiverseAdventureIndex().nodes.some(n=>n.id===nodeId))
      return res.status(404).json({success:false,error:"UNKNOWN_LOCATION"});
    return res.json({success:true,nodeId,leads:availableRouteLeads(nodeId)});
  });
  // Read-only proposal catalog; membership required. No ritual/reward mutation endpoint.
  app.get("/api/campaigns/:campaignId/ascension/paths",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,paths:listAscensionPaths(),rewardApproved:false});
  });
  app.get("/api/campaigns/:campaignId/ascension/paths/:pathId",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    const path=getAscensionPath(req.params.pathId);
    if(!path)return res.status(404).json({success:false,error:"UNKNOWN_PATH"});
    return res.json({success:true,path,rewardApproved:false});
  });
  // Opt-in economy only: never auto-advance DR or mutate markets from cron.
  app.get("/api/campaigns/:campaignId/world/economy",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,commodities:worldEconomy.getPrices(campaignId)});
  });
  app.post("/api/campaigns/:campaignId/world/economy/commodities",(req,res)=>{
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    if(req.auth.kind!=="actor"||!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")
      return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const {commodityId,priceCopper}=req.body||{};
      const result=worldEconomy.defineCommodity({campaignId,actorId,commodityId,priceCopper});
      return res.status(result.duplicate?200:201).json({success:true,...result});
    }catch(error){
      return res.status(error instanceof TypeError?400:409).json({success:false,error:"COMMODITY_CONFLICT"});
    }
  });
  app.post("/api/campaigns/:campaignId/world/economy/adjustments",(req,res)=>{
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    if(req.auth.kind!=="actor"||!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")
      return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const {adjustmentId,commodityId,expectedRevision,changeBasisPoints,reason}=req.body||{};
      const result=worldEconomy.adjustPrice({campaignId,actorId,adjustmentId,commodityId,expectedRevision,changeBasisPoints,reason});
      return res.status(result.duplicate?200:201).json({success:true,...result});
    }catch(error){
      return res.status(error instanceof TypeError?400:409).json({success:false,error:"PRICE_CONFLICT"});
    }
  });
  // Explicit settlement trade operations; no cron, player wallet or item grants.
  app.get("/api/campaigns/:campaignId/world/settlements",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor"||!id(campaignId)||!memberRole.get(campaignId,req.auth.actorId))
      return res.status(403).json({success:false,error:"FORBIDDEN"});
    return res.json({success:true,markets:settlementTrade.getMarkets(campaignId)});
  });
  const settlementPost=(route,method)=>{
    app.post("/api/campaigns/:campaignId/world/settlements/"+route,(req,res)=>{
      const campaignId=req.params.campaignId,actorId=req.auth.actorId;
      if(req.auth.kind!=="actor"||!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")
        return res.status(403).json({success:false,error:"DM_REQUIRED"});
      try{
        const result=settlementTrade[method]({...req.body,campaignId,actorId});
        return res.status(result.duplicate?200:201).json({success:true,...result});
      }catch(error){
        return res.status(error instanceof TypeError?400:409).json({success:false,error:"SETTLEMENT_CONFLICT"});
      }
    });
  };
  settlementPost("create","createSettlement");
  settlementPost("markets","defineMarket");
  settlementPost("trades","recordTrade");
  app.post("/api/campaigns/:campaignId/world/settlements/pulses",(req,res)=>{
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    if(req.auth.kind!=="actor"||!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")
      return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const {pulseId,changes}=req.body||{};
      const result=settlementMarketPulse.executePulse({campaignId,actorId,pulseId,changes});
      return res.status(result.duplicate?200:201).json({success:true,...result});
    }catch(error){
      return res.status(error instanceof TypeError?400:409).json({success:false,error:"MARKET_PULSE_CONFLICT"});
    }
  });
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
  // Local development DM token only. Never accept self-asserted player roles.
  app.post("/api/war-table/dispute",adminOnly,(req,res)=>{
    const {territoryId,aggressorFactionId}=req.body||{};
    if(!id(territoryId)||!id(aggressorFactionId))return res.status(400).json({success:false,error:"INVALID_INPUT"});
    try{return res.json({success:true,...disputes.triggerDispute(territoryId,aggressorFactionId)});}
    catch(error){return res.status(409).json({success:false,error:"DISPUTE_CONFLICT"});}
  });
  app.post("/api/war-table/resolve",adminOnly,(req,res)=>{
    const {disputeId,winningFactionId}=req.body||{};
    if(!id(disputeId)||!id(winningFactionId))return res.status(400).json({success:false,error:"INVALID_INPUT"});
    try{return res.json({success:true,...disputes.resolveDispute(disputeId,winningFactionId)});}
    catch(error){return res.status(409).json({success:false,error:"DISPUTE_CONFLICT"});}
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
    if((eventType==="QUEST_OBJECTIVE_VERIFIED"||eventType==="QUEST_COMPLETION_APPROVED")&&member.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
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
  app.post("/api/campaigns/:campaignId/quests/catalog",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    if(!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const {questId,requiredObjectiveIds}=req.body||{};
      const result=questEvidence.registerQuest({campaignId,questId,actorId,requiredObjectiveIds});
      return res.status(result.duplicate?200:201).json({success:true,...result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_INPUT"});
      return res.status(409).json({success:false,error:"QUEST_DEFINITION_CONFLICT"});
    }
  });
  app.post("/api/campaigns/:campaignId/quests/catalog/:questId/approve",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const campaignId=req.params.campaignId,questId=req.params.questId,actorId=req.auth.actorId;
    if(!id(campaignId)||!id(questId)||memberRole.get(campaignId,actorId)?.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const result=questEvidence.approveQuest({campaignId,questId,actorId});
      return res.status(result.duplicate?200:201).json({success:true,...result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_INPUT"});
      return res.status(409).json({success:false,error:"QUEST_APPROVAL_CONFLICT"});
    }
  });
  app.post("/api/campaigns/:campaignId/quests/:questId/state",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const campaignId=req.params.campaignId,questId=req.params.questId,actorId=req.auth.actorId;
    if(!id(campaignId)||!id(questId)||memberRole.get(campaignId,actorId)?.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const {characterId,toStatus,reason,expectedRevision}=req.body||{};
      const result=questEvidence.transitionQuest({campaignId,characterId,questId,actorId,toStatus,reason,expectedRevision});
      return res.status(201).json({success:true,...result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_INPUT"});
      if(error.message==="NOT_AUTHORIZED"||error.message==="DM_REQUIRED")return res.status(403).json({success:false,error:"FORBIDDEN"});
      return res.status(409).json({success:false,error:"STATE_CONFLICT"});
    }
  });
  // Quest evidence is derived only from campaign journal events authored by a DM.
  // No candidate artifacts are automatically awarded.
  app.post("/api/campaigns/:campaignId/quests/objectives/verify",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    try{
      const {characterId,questId,objectiveId,eventId}=req.body||{};
      const result=questEvidence.verifyObjective({campaignId,characterId,actorId,questId,objectiveId,eventId});
      return res.status(result.duplicate?200:201).json({success:true,...result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_INPUT"});
      if(error.message==="NOT_AUTHORIZED")return res.status(403).json({success:false,error:"FORBIDDEN"});
      return res.status(409).json({success:false,error:"EVIDENCE_CONFLICT"});
    }
  });
  app.post("/api/campaigns/:campaignId/quests/complete",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    try{
      const {characterId,questId,completionEventId,requiredObjectiveIds}=req.body||{};
      const result=questEvidence.completeQuest({campaignId,characterId,actorId,questId,completionEventId,requiredObjectiveIds});
      return res.status(result.duplicate?200:201).json({success:true,...result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_INPUT"});
      if(error.message==="NOT_AUTHORIZED")return res.status(403).json({success:false,error:"FORBIDDEN"});
      return res.status(409).json({success:false,error:"QUEST_CONFLICT"});
    }
  });
  // Combat is DM-authoritative. Signed actor sessions are required; client actor IDs are ignored.
  app.post("/api/campaigns/:campaignId/combat/encounters",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const campaignId=req.params.campaignId,actorId=req.auth.actorId;
    if(!id(campaignId)||memberRole.get(campaignId,actorId)?.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const {encounterId,combatants}=req.body||{};
      const result=combat.createEncounter({campaignId,encounterId,actorId,combatants});
      return res.status(201).json({success:true,encounter:result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_INPUT"});
      return res.status(409).json({success:false,error:"ENCOUNTER_CONFLICT"});
    }
  });
  app.post("/api/campaigns/:campaignId/combat/encounters/:encounterId/actions",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const campaignId=req.params.campaignId,encounterId=req.params.encounterId,actorId=req.auth.actorId;
    if(!id(campaignId)||!id(encounterId)||memberRole.get(campaignId,actorId)?.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    try{
      const {actionId,kind,targetId,amount,condition,attackBonus,armorClass,damageCount,damageSides,damageBonus}=req.body||{};
      const result=combat.applyAction({campaignId,encounterId,actorId,actionId,kind,targetId,amount,condition,attackBonus,armorClass,damageCount,damageSides,damageBonus});
      return res.status(result.duplicate?200:201).json({success:true,encounter:result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_INPUT"});
      return res.status(409).json({success:false,error:"COMBAT_CONFLICT"});
    }
  });
  app.get("/api/campaigns/:campaignId/combat/encounters/:encounterId",(req,res)=>{
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    const campaignId=req.params.campaignId,encounterId=req.params.encounterId;
    if(!id(campaignId)||!id(encounterId))return res.status(400).json({success:false,error:"INVALID_INPUT"});
    if(!memberRole.get(campaignId,req.auth.actorId))return res.status(403).json({success:false,error:"NOT_A_MEMBER"});
    const encounter=combat.getEncounter(campaignId,encounterId);
    if(!encounter)return res.status(404).json({success:false,error:"NOT_FOUND"});
    return res.json({success:true,encounter});
  });
  // Living World endpoints: signed DM actor identity only; never trust a supplied actor ID.
  // No cron or automatic DR advancement. World factions/territories must be provisioned separately.
  app.post("/api/campaigns/:campaignId/world/pulses",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    if(!id(campaignId))return res.status(400).json({success:false,error:"INVALID_INPUT"});
    const membership=memberRole.get(campaignId,req.auth.actorId);
    if(!membership||membership.role!=="DM")return res.status(403).json({success:false,error:"DM_REQUIRED"});
    const {pulseId,drDate,shifts}=req.body||{};
    if(!id(pulseId)||typeof drDate!=="string"||!Array.isArray(shifts)||shifts.length>100||
       shifts.some(x=>!x||!id(x.territoryId)||!id(x.newFactionId)))
      return res.status(400).json({success:false,error:"INVALID_INPUT"});
    try{
      const result=livingWorld.executePulse({campaignId,pulseId,actorId:req.auth.actorId,drDate,shifts});
      return res.status(result.duplicate?200:201).json({success:true,campaignId,...result});
    }catch(error){
      if(error instanceof TypeError)return res.status(400).json({success:false,error:"INVALID_INPUT"});
      if(error.message==="DM_REQUIRED")return res.status(403).json({success:false,error:"DM_REQUIRED"});
      return res.status(409).json({success:false,error:"PULSE_CONFLICT"});
    }
  });
  app.get("/api/campaigns/:campaignId/world/ledger",(req,res)=>{
    const campaignId=req.params.campaignId;
    if(req.auth.kind!=="actor")return res.status(403).json({success:false,error:"ACTOR_SESSION_REQUIRED"});
    if(!id(campaignId))return res.status(400).json({success:false,error:"INVALID_INPUT"});
    if(!memberRole.get(campaignId,req.auth.actorId))return res.status(403).json({success:false,error:"NOT_A_MEMBER"});
    const limit=req.query.limit===undefined?50:Number(req.query.limit);
    if(!Number.isSafeInteger(limit)||limit<1||limit>100)return res.status(400).json({success:false,error:"INVALID_LIMIT"});
    return res.json({success:true,campaignId,events:livingWorld.getLedger(campaignId,limit)});
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
