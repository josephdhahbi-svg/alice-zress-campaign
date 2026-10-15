# Moonveil Living City Network v2 — 2026-10-15

## Executed and verified locally
The downloadable archive `moonveil_living_city_network_v2.zip` contains the complete Python prototype: original engine, living_city module, quest and world data, new `city_network.py`, new `test_city_network.py`, README and prior tests.

`python -m unittest discover -q`: **29 tests passed** in 0.044 seconds.

## New functioning LEGO connections
- Persistent SQLite `trade_status` projection keyed by origin/destination; links to existing LIVING_WORLD.json trade routes.
- Persistent `rumor_status` with known and credibility values; links to R01.
- Append-only `network_reactions` table with immutable triggers and unique command IDs.
- `apply_committed_choice(db, command_id)` checks a committed scene command, its ledger event and city event; rejects uncommitted/fabricated commands; idempotent replay.
- Each of five heroic choices has a distinct network consequence.
- `npc_locations(db)` provides deterministic hour/phase projection and NPC home/activity.
- `quick_lookup(db,query)` searches local place/NPC/faction/rumor data without network access.

## Tested safeguards
All five choices, idempotency, immutable reaction records, rumor credibility, medicine trade route, NPC phase, local search, rejection of missing events, SQLite persistence after reopening. Alice remains L1, artifacts unowned, no Wishes spent. Simulation is noncanonical.

## Integration gap and next repair
The prototype calls `city_choice` and `apply_committed_choice` in separate transactions; a crash between them can leave pending propagation. Production must use a single transaction or transactional outbox with replay of pending reactions. Current NPC schedules display hour/phase but do not yet move NPCs between locations. The local search scans small in-memory JSON rather than an FTS index. The dice prototype is deterministic for tests, not multiplayer-authoritative. No Flutter or Node server is deployed. GitHub stores this checkpoint; the full new Python source is in the downloadable archive and is **not claimed committed**.
