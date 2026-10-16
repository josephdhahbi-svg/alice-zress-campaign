"use strict";
/** SQLite schema migrations. Forward-only, transactional, and idempotent. */
const MIGRATIONS = [
  { version:1, name:"campaign access and event ledger", sql:`
CREATE TABLE IF NOT EXISTS vtt_campaigns (
 campaign_id TEXT PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS vtt_campaign_members (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 actor_id TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('DM','PLAYER','OBSERVER')),
 PRIMARY KEY(campaign_id,actor_id)
);
CREATE TABLE IF NOT EXISTS vtt_campaign_events (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 revision INTEGER NOT NULL CHECK(revision > 0), event_id TEXT NOT NULL,
 actor_id TEXT NOT NULL, event_type TEXT NOT NULL, payload_json TEXT NOT NULL,
 occurred_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,revision), UNIQUE(campaign_id,event_id)
);
CREATE INDEX IF NOT EXISTS idx_vtt_events_actor ON vtt_campaign_events(campaign_id,actor_id);
` },
  { version:2, name:"revoked actor sessions", sql:`
CREATE TABLE IF NOT EXISTS vtt_revoked_sessions (
 token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL, revoked_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_vtt_revoked_expiry ON vtt_revoked_sessions(expires_at);
` },
  { version:3, name:"candidate quest objective and reward ledger", sql:`
CREATE TABLE IF NOT EXISTS vtt_characters (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 character_id TEXT NOT NULL, owner_actor_id TEXT NOT NULL,
 PRIMARY KEY(campaign_id,character_id),
 FOREIGN KEY(campaign_id,owner_actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
CREATE TABLE IF NOT EXISTS vtt_quest_objectives (
 campaign_id TEXT NOT NULL, character_id TEXT NOT NULL, quest_id TEXT NOT NULL,
 objective_id TEXT NOT NULL, verified_event_id TEXT NOT NULL,
 PRIMARY KEY(campaign_id,character_id,quest_id,objective_id),
 FOREIGN KEY(campaign_id,character_id) REFERENCES vtt_characters(campaign_id,character_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS vtt_quest_completions (
 campaign_id TEXT NOT NULL, character_id TEXT NOT NULL, quest_id TEXT NOT NULL,
 completed_event_id TEXT NOT NULL, completed_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,character_id,quest_id),
 FOREIGN KEY(campaign_id,character_id) REFERENCES vtt_characters(campaign_id,character_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS vtt_character_artifacts (
 campaign_id TEXT NOT NULL, character_id TEXT NOT NULL, artifact_id TEXT NOT NULL,
 source_quest_id TEXT NOT NULL, awarded_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,character_id,artifact_id),
 FOREIGN KEY(campaign_id,character_id) REFERENCES vtt_characters(campaign_id,character_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_vtt_artifact_quest ON vtt_character_artifacts(campaign_id,character_id,source_quest_id);
` },
  { version:4, name:"versioned quest definitions and audit ledger", sql:`
CREATE TABLE IF NOT EXISTS vtt_quest_catalog (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 quest_id TEXT NOT NULL,
 required_objectives_json TEXT NOT NULL,
 created_by_actor_id TEXT NOT NULL,
 PRIMARY KEY(campaign_id,quest_id),
 FOREIGN KEY(campaign_id,created_by_actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
CREATE TABLE IF NOT EXISTS vtt_quest_definition_audit (
 campaign_id TEXT NOT NULL, quest_id TEXT NOT NULL,
 revision INTEGER NOT NULL CHECK(revision > 0),
 actor_id TEXT NOT NULL, event_type TEXT NOT NULL CHECK(event_type IN ('REGISTERED','APPROVED')),
 objective_snapshot_json TEXT NOT NULL, occurred_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,quest_id,revision),
 FOREIGN KEY(campaign_id,quest_id) REFERENCES vtt_quest_catalog(campaign_id,quest_id) ON DELETE CASCADE,
 FOREIGN KEY(campaign_id,actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
CREATE TABLE IF NOT EXISTS vtt_quest_approvals (
 campaign_id TEXT NOT NULL, quest_id TEXT NOT NULL,
 approved_by_actor_id TEXT NOT NULL, approved_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,quest_id),
 FOREIGN KEY(campaign_id,quest_id) REFERENCES vtt_quest_catalog(campaign_id,quest_id) ON DELETE CASCADE,
 FOREIGN KEY(campaign_id,approved_by_actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
` },
  { version:5, name:"quest status transitions and audit", sql:`
CREATE TABLE IF NOT EXISTS vtt_quest_states (
 campaign_id TEXT NOT NULL, character_id TEXT NOT NULL, quest_id TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('BLOCKED','ACTIVE','FAILED','COMPLETE')),
 revision INTEGER NOT NULL CHECK(revision > 0),
 updated_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,character_id,quest_id),
 FOREIGN KEY(campaign_id,character_id) REFERENCES vtt_characters(campaign_id,character_id) ON DELETE CASCADE,
 FOREIGN KEY(campaign_id,quest_id) REFERENCES vtt_quest_catalog(campaign_id,quest_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS vtt_quest_state_audit (
 campaign_id TEXT NOT NULL, character_id TEXT NOT NULL, quest_id TEXT NOT NULL,
 revision INTEGER NOT NULL CHECK(revision > 0),
 actor_id TEXT NOT NULL, from_status TEXT, to_status TEXT NOT NULL,
 reason TEXT NOT NULL, occurred_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,character_id,quest_id,revision),
 FOREIGN KEY(campaign_id,character_id,quest_id) REFERENCES vtt_quest_states(campaign_id,character_id,quest_id) ON DELETE CASCADE,
 FOREIGN KEY(campaign_id,actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
` },
  { version:6, name:"campaign commodity economy and audit", sql:`
CREATE TABLE IF NOT EXISTS vtt_world_economy (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 commodity_id TEXT NOT NULL, price_copper INTEGER NOT NULL CHECK(price_copper BETWEEN 1 AND 1000000000),
 revision INTEGER NOT NULL DEFAULT 0 CHECK(revision>=0),
 PRIMARY KEY(campaign_id,commodity_id)
);
CREATE TABLE IF NOT EXISTS vtt_world_economy_adjustments (
 campaign_id TEXT NOT NULL, adjustment_id TEXT NOT NULL,
 commodity_id TEXT NOT NULL, actor_id TEXT NOT NULL,
 old_price_copper INTEGER NOT NULL, new_price_copper INTEGER NOT NULL,
 reason TEXT NOT NULL, occurred_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,adjustment_id),
 FOREIGN KEY(campaign_id,commodity_id) REFERENCES vtt_world_economy(campaign_id,commodity_id),
 FOREIGN KEY(campaign_id,actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
` },
  { version:7, name:"settlement trade price baseline", sql:`
CREATE TABLE IF NOT EXISTS vtt_settlements (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 settlement_id TEXT NOT NULL, name TEXT NOT NULL,
 plane_id TEXT NOT NULL, region_id TEXT NOT NULL,
 created_by_actor_id TEXT NOT NULL,
 PRIMARY KEY(campaign_id,settlement_id),
 FOREIGN KEY(campaign_id,created_by_actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
CREATE TABLE IF NOT EXISTS vtt_settlement_markets (
 campaign_id TEXT NOT NULL, settlement_id TEXT NOT NULL, commodity_id TEXT NOT NULL,
 stock_units INTEGER NOT NULL CHECK(stock_units BETWEEN 0 AND 1000000000),
 local_price_copper INTEGER NOT NULL CHECK(local_price_copper BETWEEN 1 AND 1000000000),
 revision INTEGER NOT NULL DEFAULT 0 CHECK(revision>=0),
 PRIMARY KEY(campaign_id,settlement_id,commodity_id),
 FOREIGN KEY(campaign_id,settlement_id) REFERENCES vtt_settlements(campaign_id,settlement_id) ON DELETE CASCADE,
 FOREIGN KEY(campaign_id,commodity_id) REFERENCES vtt_world_economy(campaign_id,commodity_id)
);
CREATE TABLE IF NOT EXISTS vtt_settlement_trade_audit (
 campaign_id TEXT NOT NULL, trade_id TEXT NOT NULL,
 settlement_id TEXT NOT NULL, commodity_id TEXT NOT NULL, actor_id TEXT NOT NULL,
 units_delta INTEGER NOT NULL CHECK(units_delta BETWEEN -1000000 AND 1000000 AND units_delta != 0),
 old_stock INTEGER NOT NULL, new_stock INTEGER NOT NULL,
 reason TEXT NOT NULL, occurred_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,trade_id),
 FOREIGN KEY(campaign_id,settlement_id,commodity_id) REFERENCES vtt_settlement_markets(campaign_id,settlement_id,commodity_id),
 FOREIGN KEY(campaign_id,actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
` },
  { version:8, name:"explicit deterministic settlement market pulses", sql:`
CREATE TABLE IF NOT EXISTS vtt_settlement_market_pulses (
 campaign_id TEXT NOT NULL REFERENCES vtt_campaigns(campaign_id) ON DELETE CASCADE,
 pulse_id TEXT NOT NULL, actor_id TEXT NOT NULL,
 changes_json TEXT NOT NULL, result_json TEXT NOT NULL,
 occurred_at TEXT NOT NULL,
 PRIMARY KEY(campaign_id,pulse_id),
 FOREIGN KEY(campaign_id,actor_id) REFERENCES vtt_campaign_members(campaign_id,actor_id)
);
` }
];
function migrate(db) {
  if (!db || typeof db.exec!=="function" || typeof db.prepare!=="function" || typeof db.transaction!=="function")
    throw new TypeError("better-sqlite3 compatible database required");
  db.exec("CREATE TABLE IF NOT EXISTS vtt_schema_migrations (version INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL)");
  const apply=db.transaction(()=>{
    const current=db.prepare("SELECT version FROM vtt_schema_migrations ORDER BY version").all().map(row=>row.version);
    const known=new Set(MIGRATIONS.map(m=>m.version));
    if(current.some(v=>!known.has(v)))throw new Error("Database schema is newer than this server");
    for(const m of MIGRATIONS){
      if(current.includes(m.version))continue;
      db.exec(m.sql);
      db.prepare("INSERT INTO vtt_schema_migrations(version,name,applied_at) VALUES(?,?,?)").run(m.version,m.name,new Date().toISOString());
    }
  });
  apply();
}
module.exports={migrate,MIGRATIONS};
