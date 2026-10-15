PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS game_profiles (
  profile_id TEXT PRIMARY KEY,
  character_name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK(level BETWEEN 1 AND 99),
  world_tick INTEGER NOT NULL DEFAULT 0 CHECK(world_tick >= 0),
  schema_version TEXT NOT NULL DEFAULT 'Omni-Engine V8.0'
);
CREATE TABLE IF NOT EXISTS game_commands (
  command_id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES game_profiles(profile_id),
  command_type TEXT NOT NULL,
  request_json TEXT NOT NULL,
  result_event_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS event_ledger (
  event_id TEXT PRIMARY KEY,
  command_id TEXT NOT NULL UNIQUE REFERENCES game_commands(command_id),
  profile_id TEXT NOT NULL REFERENCES game_profiles(profile_id),
  event_type TEXT NOT NULL,
  event_json TEXT NOT NULL,
  world_tick INTEGER NOT NULL CHECK(world_tick >= 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER IF NOT EXISTS event_ledger_no_update
BEFORE UPDATE ON event_ledger BEGIN SELECT RAISE(ABORT, 'immutable event ledger'); END;
CREATE TRIGGER IF NOT EXISTS event_ledger_no_delete
BEFORE DELETE ON event_ledger BEGIN SELECT RAISE(ABORT, 'immutable event ledger'); END;
CREATE TABLE IF NOT EXISTS quest_state (
  profile_id TEXT NOT NULL REFERENCES game_profiles(profile_id),
  quest_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'LOCKED' CHECK(status IN ('LOCKED','AVAILABLE','ACTIVE','COMPLETED','FAILED')),
  PRIMARY KEY(profile_id,quest_id)
);
CREATE TABLE IF NOT EXISTS item_catalog (
  item_id TEXT PRIMARY KEY,
  item_name TEXT NOT NULL,
  library_id TEXT NOT NULL,
  rarity TEXT NOT NULL,
  source_status TEXT NOT NULL DEFAULT 'HOMEBREW'
);
CREATE TABLE IF NOT EXISTS inventory_ownership (
  profile_id TEXT NOT NULL REFERENCES game_profiles(profile_id),
  item_id TEXT NOT NULL REFERENCES item_catalog(item_id),
  acquired_event_id TEXT NOT NULL REFERENCES event_ledger(event_id),
  PRIMARY KEY(profile_id,item_id)
);
INSERT INTO game_profiles(profile_id, character_name, level)
VALUES ('alice-zress', 'Alice Z\u0027ress', 1)
ON CONFLICT(profile_id) DO NOTHING;
