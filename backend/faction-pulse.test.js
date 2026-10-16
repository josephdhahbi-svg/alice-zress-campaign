"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { CREATE_TABLES, initializeFactionPulseEngine, scheduleFactionPulse } = require("./faction-pulse");

test("schema includes idempotent pulse audit and territory foreign key", () => {
  assert.match(CREATE_TABLES, /tick_key TEXT NOT NULL UNIQUE/);
  assert.match(CREATE_TABLES, /REFERENCES factions\(faction_id\) ON DELETE SET NULL/);
  assert.match(CREATE_TABLES, /CHECK\(alignment IN \('BLUE','RED','GREEN'\)\)/);
});

function fakeDb() {
  const state = {
    factions: [{ faction_id: "eilistraee", influence_score: 80 },
               { faction_id: "lolth", influence_score: 30 }],
    territories: [{ territory_id: "pit", controlling_faction_id: "lolth" }],
    disputes: [],
    logs: new Map()
  };
  return {
    state,
    exec() {},
    transaction(fn) {
      return (...args) => {
        const before = JSON.parse(JSON.stringify({
          factions: state.factions, territories: state.territories,
          logs: [...state.logs.entries()]
        }));
        try { return fn(...args); }
        catch (error) {
          state.factions = before.factions;
          state.territories = before.territories;
          state.logs = new Map(before.logs);
          throw error;
        }
      };
    },
    prepare(sql) {
      if (sql.startsWith("SELECT faction_id")) return { all: () => state.factions.map(x => ({ ...x })) };
      if (sql.startsWith("UPDATE factions")) return { run(score, id) { state.factions.find(x=>x.faction_id===id).influence_score=score; } };
      if (sql.startsWith("SELECT 1 FROM sqlite_master")) return { get: () => ({1:1}) };
      if (sql.startsWith("SELECT territory_id FROM faction_disputes")) return { all: () => state.disputes.map(x=>({...x})) };
      if (sql.startsWith("SELECT territory_id")) return { all: () => state.territories.map(x=>({...x})) };
      if (sql.startsWith("UPDATE territory_control")) return { run(id, territory) { state.territories.find(x=>x.territory_id===territory).controlling_faction_id=id; } };
      if (sql.startsWith("INSERT INTO world_pulse")) return { run(key, timestamp, summary) { state.logs.set(key, {timestamp,summary}); } };
      if (sql.startsWith("SELECT pulse_id")) return { get(key) { return state.logs.has(key) ? { pulse_id: 1 } : undefined; } };
      throw Error("Unexpected SQL: " + sql);
    }
  };
}
test("pulse updates bounded influence, changes control, and logs once per hour", () => {
  const db = fakeDb();
  const engine = initializeFactionPulseEngine(db, {random: () => 0.5});
  const date = new Date("2026-10-15T12:01:00Z");
  const first = engine.runPulse(date);
  assert.equal(first.applied, true);
  assert.equal(first.ownership[0].to, "eilistraee");
  assert.equal(db.state.territories[0].controlling_faction_id, "eilistraee");
  assert.equal(engine.runPulse(new Date("2026-10-15T12:59:00Z")).applied, false);
  assert.equal(db.state.logs.size, 1);
});
test("active disputes prevent autonomous ownership changes",()=>{
  const db=fakeDb();
  db.state.disputes=[{territory_id:"pit"}];
  const engine=initializeFactionPulseEngine(db,{random:()=>0.5});
  const result=engine.runPulse(new Date("2026-10-15T13:01:00Z"));
  assert.equal(result.applied,true);
  assert.deepEqual(result.ownership,[]);
  assert.equal(db.state.territories[0].controlling_faction_id,"lolth");
});
test("invalid randomness rolls back transaction", () => {
  const db = fakeDb();
  const engine = initializeFactionPulseEngine(db, {random: () => 2});
  assert.throws(() => engine.runPulse(), RangeError);
  assert.equal(db.state.logs.size, 0);
  assert.equal(db.state.factions[0].influence_score, 80);
});
test("scheduler is injected and can be stopped by caller", () => {
  const engine = {runPulse() {}};
  const handle = {};
  const cron = {schedule(spec, fn, opts) {
    assert.equal(spec, "0 * * * *");
    assert.equal(opts.timezone, "Etc/UTC");
    assert.equal(typeof fn, "function");
    return handle;
  }};
  assert.equal(scheduleFactionPulse(engine, cron), handle);
});
