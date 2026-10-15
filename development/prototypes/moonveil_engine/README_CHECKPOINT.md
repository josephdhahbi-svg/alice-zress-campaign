# First runnable Moonveil engine Lego — 2026-10-15
Status: LOCAL PROTOTYPE TESTED; NOT YET INTEGRATED INTO FLUTTER OR DEPLOYED.
Full source archive: moonveil_playable_prototype.zip, produced in active development workspace.

## Built
- engine.py: Python standard-library SQLite scene-choice engine with profiles, commands, immutable event ledger, memories, revision guard, idempotent command IDs and world ticks.
- test_engine.py: ten unittest cases, run locally and passed.
- QUEST_CHAIN_NETWORK.json: existing 18-quest network copied into runnable prototype.
- LIVING_WORLD.json: existing living-world source data copied for future integration.

## First playable design slice
U01 'The Silver Courier': four story panels; five ordered choices (Lawful Good, Neutral Good, Chaotic Good, Utility, Action). Each choice writes one local test event and memory, advances a local test world tick, and returns a snapshot. No combat rolls or real campaign advancement.
Event payload explicitly canonical=false; prototype saves are sandboxed and NOT authoritative campaign state.

## Verified test output
Ran 10 tests in 0.021 seconds: OK.
Tests: five choices; all branch outcomes; conflicting command ID rejected; idempotency; stale revision rejected; invalid input rejected; immutable events; SQLite save/reopen; unearned items and Level-3 companion locked; existing quest network compatible.

## Known limitations
Python is a validation prototype, not the target Node.js/Flutter production engine. No Flutter UI, WebSocket service, live NPC tick integration, d20 combat, authentication, sourcebook chronology or real campaign saves yet. Current demo engine hardcodes Alice Level 1, as intended for safe tests. Do not merge with live campaign save until user approves.

## Next Lego assembly
1. Port deterministic command contract to Node.js and add tests.
2. Implement SQL migrations with rollback/idempotency and inventory provenance.
3. Add Flutter clickable 4+1 comic scene.
4. Connect NPC routines, trade and rumor consequences.
5. Build a proper offline-first save/restore flow.
