"use strict";
/**
 * Moonveil Faction Territory Pulse Engine.
 * Adapter: better-sqlite3 compatible db (exec, prepare, transaction).
 * No scheduler or database package is installed by this module.
 * A single authorized server worker should own the hourly scheduler.
 * Faction alignments are story classifications, not dice-choice alignments.
 */
const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS factions (
  faction_id TEXT PRIMARY KEY,
  faction_name TEXT NOT NULL,
  alignment TEXT NOT NULL CHECK(alignment IN ('BLUE','RED','GREEN')),
  influence_score INTEGER NOT NULL DEFAULT 50 CHECK(influence_score BETWEEN 0 AND 100)
);
CREATE TABLE IF NOT EXISTS territory_control (
  territory_id TEXT PRIMARY KEY,
  territory_name TEXT NOT NULL,
  cosmological_sector TEXT NOT NULL,
  controlling_faction_id TEXT REFERENCES factions(faction_id) ON DELETE SET NULL,
  strategic_value INTEGER NOT NULL DEFAULT 10 CHECK(strategic_value >= 1)
);
CREATE TABLE IF NOT EXISTS world_pulse_audit_log (
  pulse_id INTEGER PRIMARY KEY AUTOINCREMENT,
  tick_key TEXT NOT NULL UNIQUE,
  timestamp TEXT NOT NULL,
  event_summary TEXT NOT NULL
);
`;

function initializeFactionPulseEngine(db, { random = Math.random } = {}) {
  if (!db || typeof db.exec !== "function" || typeof db.prepare !== "function" ||
      typeof db.transaction !== "function") throw new TypeError("SQLite adapter required");
  if (typeof random !== "function") throw new TypeError("random must be a function");
  db.exec(CREATE_TABLES);
  const getFactions = db.prepare("SELECT faction_id, influence_score FROM factions ORDER BY faction_id");
  const setInfluence = db.prepare("UPDATE factions SET influence_score = ? WHERE faction_id = ?");
  const territories = db.prepare("SELECT territory_id, controlling_faction_id FROM territory_control ORDER BY territory_id");
  const setOwner = db.prepare("UPDATE territory_control SET controlling_faction_id = ? WHERE territory_id = ?");
  // Keep autonomous pulses from overriding DM-managed contested territories.
  // Prepare lazily: legacy callers may initialize the pulse before dispute tables.
  const insertLog = db.prepare("INSERT INTO world_pulse_audit_log(tick_key,timestamp,event_summary) VALUES(?,?,?)");
  const priorLog = db.prepare("SELECT pulse_id FROM world_pulse_audit_log WHERE tick_key = ?");
  const pulse = db.transaction((tickKey, timestamp) => {
    // Idempotency prevents two workers from applying the same hourly pulse twice.
    if (priorLog.get(tickKey)) return { applied: false, tickKey, reason: "already_applied" };
    const updated = [];
    const influence = new Map();
    for (const faction of getFactions.all()) {
      const value = random();
      if (!Number.isFinite(value) || value < 0 || value >= 1) throw new RangeError("random must return [0,1)");
      const delta = Math.floor(value * 11) - 5;
      const score = Math.max(0, Math.min(100, faction.influence_score + delta));
      setInfluence.run(score, faction.faction_id);
      influence.set(faction.faction_id, score);
      updated.push({ factionId: faction.faction_id, delta, score });
    }
    // Territory ownership only changes when a challenger has a clear advantage.
    // This is a provisional homebrew mechanic, not official D&D canon.
    const ownership = [];
    const contenders = [...influence.entries()].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]));
    const hasDisputes = db.prepare("SELECT 1 FROM sqlite_master WHERE type=\'table\' AND name=\'faction_disputes\'").get();
    const disputed = new Set(hasDisputes ? db.prepare("SELECT territory_id FROM faction_disputes WHERE status IN (\'PENDING\',\'ESCALATED\')").all().map(row=>row.territory_id) : []);
    for (const territory of territories.all()) {
      if (disputed.has(territory.territory_id)) continue;
      const leader = contenders[0];
      if (!leader) break;
      const owner = territory.controlling_faction_id;
      const ownerScore = owner === null ? 0 : (influence.get(owner) ?? 0);
      if (leader[0] !== owner && leader[1] >= ownerScore + 20 && leader[1] >= 65) {
        setOwner.run(leader[0], territory.territory_id);
        ownership.push({ territoryId: territory.territory_id, from: owner, to: leader[0] });
      }
    }
    const result = { applied: true, tickKey, updated, ownership };
    insertLog.run(tickKey, timestamp, JSON.stringify(result));
    return result;
  });
  function runPulse(date = new Date()) {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new TypeError("Valid date required");
    const tickKey = date.toISOString().slice(0,13); // UTC hour
    return pulse(tickKey, date.toISOString());
  }
  return { runPulse };
}

/** Optional scheduler: pass node-cron explicitly from an installed server dependency. */
function scheduleFactionPulse(engine, cron) {
  if (!engine || typeof engine.runPulse !== "function" || !cron || typeof cron.schedule !== "function")
    throw new TypeError("Engine and cron scheduler required");
  return cron.schedule("0 * * * *", () => engine.runPulse(), { timezone: "Etc/UTC" });
}

module.exports = { CREATE_TABLES, initializeFactionPulseEngine, scheduleFactionPulse };
