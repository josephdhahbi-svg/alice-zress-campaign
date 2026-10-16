"use strict";
/** Opt-in, campaign-scoped living world simulation. Never advances DR implicitly. */
const SCHEMA=`
CREATE TABLE IF NOT EXISTS vtt_world_factions (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 faction_id TEXT NOT NULL, name TEXT NOT NULL,
 alignment TEXT NOT NULL CHECK(alignment IN ('HERO','VILLAIN','NEUTRAL')),
 ideology_axis TEXT NOT NULL CHECK(ideology_axis IN ('NETHERESE_ORDER','MYSTRYL_CHAOS','NEUTRAL')),
 influence_score INTEGER NOT NULL DEFAULT 100 CHECK(influence_score BETWEEN 0 AND 1000000),
 PRIMARY KEY(campaign_id,faction_id)
);
CREATE TABLE IF NOT EXISTS vtt_world_territories (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 territory_id TEXT NOT NULL, name TEXT NOT NULL,
 zone_coords TEXT NOT NULL, controlling_faction_id TEXT,
 strategic_value INTEGER NOT NULL DEFAULT 10 CHECK(strategic_value BETWEEN 0 AND 1000000),
 contested_status INTEGER NOT NULL DEFAULT 0 CHECK(contested_status IN (0,1)),
 PRIMARY KEY(campaign_id,territory_id),
 FOREIGN KEY(campaign_id,controlling_faction_id) REFERENCES vtt_world_factions(campaign_id,faction_id)
);
CREATE TABLE IF NOT EXISTS vtt_world_pulses (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 pulse_id TEXT NOT NULL, actor_id TEXT NOT NULL, utc_timestamp TEXT NOT NULL,
 dr_date TEXT NOT NULL, PRIMARY KEY(campaign_id,pulse_id),
 FOREIGN KEY(campaign_id,actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
CREATE TABLE IF NOT EXISTS vtt_world_pulse_ledger (
 campaign_id TEXT NOT NULL, pulse_id TEXT NOT NULL, territory_id TEXT NOT NULL,
 old_faction_id TEXT, new_faction_id TEXT, event_type TEXT NOT NULL,
 metrics_json TEXT NOT NULL, PRIMARY KEY(campaign_id,pulse_id,territory_id),
 FOREIGN KEY(campaign_id,pulse_id) REFERENCES vtt_world_pulses(campaign_id,pulse_id),
 FOREIGN KEY(campaign_id,territory_id) REFERENCES vtt_world_territories(campaign_id,territory_id)
);
CREATE INDEX IF NOT EXISTS idx_world_territory_contested ON vtt_world_territories(campaign_id,contested_status);
`;
const ID=/^[A-Za-z0-9:_-]{1,100}$/;
function createLivingWorldEngine(db){
 if(!db||typeof db.transaction!=="function")throw new TypeError("SQLite database required");
 db.exec(SCHEMA);
 const pulse=db.transaction(({campaignId,pulseId,actorId,drDate,shifts=[],utcTimestamp=new Date().toISOString()})=>{
  if(![campaignId,pulseId,actorId].every(x=>typeof x==="string"&&ID.test(x))||
     typeof drDate!=="string"||!/^DR [0-9]{1,6}(?:[-/][A-Za-z0-9-]+)?$/.test(drDate)||
     !Array.isArray(shifts)||shifts.length>100||
     !Number.isFinite(Date.parse(utcTimestamp)))throw new TypeError("INVALID_PULSE_INPUT");
  const role=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?").get(campaignId,actorId);
  if(!role||role.role!=="DM")throw new Error("DM_REQUIRED");
  const prior=db.prepare("SELECT dr_date FROM vtt_world_pulses WHERE campaign_id=? AND pulse_id=?").get(campaignId,pulseId);
  if(prior)return {duplicate:true,mutations:0,drDate:prior.dr_date};
  const seen=new Set();
  for(const shift of shifts){
   if(!shift||!ID.test(shift.territoryId)||!ID.test(shift.newFactionId)||seen.has(shift.territoryId))throw new TypeError("INVALID_SHIFT");
   seen.add(shift.territoryId);
   const territory=db.prepare("SELECT controlling_faction_id,contested_status FROM vtt_world_territories WHERE campaign_id=? AND territory_id=?").get(campaignId,shift.territoryId);
   if(!territory||territory.contested_status!==1)throw new Error("TERRITORY_NOT_CONTESTED");
   if(!db.prepare("SELECT 1 FROM vtt_world_factions WHERE campaign_id=? AND faction_id=?").get(campaignId,shift.newFactionId))throw new Error("UNKNOWN_FACTION");
   if(territory.controlling_faction_id===shift.newFactionId)throw new Error("UNCHANGED_CONTROL");
  }
  db.prepare("INSERT INTO vtt_world_pulses(campaign_id,pulse_id,actor_id,utc_timestamp,dr_date) VALUES(?,?,?,?,?)").run(campaignId,pulseId,actorId,utcTimestamp,drDate);
  for(const shift of shifts){
   const old=db.prepare("SELECT controlling_faction_id FROM vtt_world_territories WHERE campaign_id=? AND territory_id=?").get(campaignId,shift.territoryId).controlling_faction_id;
   db.prepare("UPDATE vtt_world_territories SET controlling_faction_id=?,contested_status=0 WHERE campaign_id=? AND territory_id=?").run(shift.newFactionId,campaignId,shift.territoryId);
   db.prepare("INSERT INTO vtt_world_pulse_ledger(campaign_id,pulse_id,territory_id,old_faction_id,new_faction_id,event_type,metrics_json) VALUES(?,?,?,?,?,?,?)").run(campaignId,pulseId,shift.territoryId,old,shift.newFactionId,"TERRITORY_PULSE_SHIFT",JSON.stringify({reason:"DM-approved simulation"}));
  }
  return {duplicate:false,mutations:shifts.length,drDate};
 });
 return {executePulse:input=>pulse(input),getLedger:(campaignId,limit=50)=>{
  if(!ID.test(campaignId)||!Number.isSafeInteger(limit)||limit<1||limit>100)throw new TypeError("INVALID_QUERY");
  return db.prepare("SELECT l.*,p.utc_timestamp,p.dr_date FROM vtt_world_pulse_ledger l JOIN vtt_world_pulses p ON p.campaign_id=l.campaign_id AND p.pulse_id=l.pulse_id WHERE l.campaign_id=? ORDER BY p.utc_timestamp DESC,l.pulse_id DESC LIMIT ?").all(campaignId,limit);
 }};
}
module.exports={SCHEMA,createLivingWorldEngine};
