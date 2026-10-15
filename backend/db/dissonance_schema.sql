PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS character_dissonance_ledger (
  character_id TEXT PRIMARY KEY,
  character_name TEXT NOT NULL,
  far_realm_madness INTEGER NOT NULL DEFAULT 0 CHECK(far_realm_madness BETWEEN 0 AND 100),
  undeath_resonance INTEGER NOT NULL DEFAULT 0 CHECK(undeath_resonance BETWEEN 0 AND 100),
  divine_radiance INTEGER NOT NULL DEFAULT 0 CHECK(divine_radiance BETWEEN 0 AND 100),
  active_tri_tier TEXT NOT NULL DEFAULT 'BALANCE',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- This table is a current-state projection; authoritative changes require validated events.
