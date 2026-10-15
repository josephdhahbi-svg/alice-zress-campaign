# Living City Integration — tested 2026-10-15
Status: NONCANONICAL Python prototype. No live campaign changes.

## Tested new source files
- development/prototypes/moonveil_engine/living_city.py
- development/prototypes/moonveil_engine/test_living_city.py

## Existing Lego connections
The original engine.py supplies SQLite save, idempotent scene commands, immutable event ledger and five heroic choices. The new living_city.py reads the existing LIVING_WORLD.json and QUEST_CHAIN_NETWORK.json. Each choice applies a bounded settlement metric and NPC trust consequence and appends an immutable city event.
Indexed by ID: places, NPCs, quests, rumors. Image manifest creates nine portrait prompts but no actual images, downloads, copyright claims or fake asset URLs. d20(seed,modifier) uses SHA-256 rejection sampling for deterministic test replay; it is explicitly NONAUTHORITATIVE simulation dice, not production server RNG.
Scene remains U01 Silver Courier, Alice Level 1, no Wish spent, no items awarded, no companion unlocked.

## Verified execution
Command: python -m unittest discover -v
Result: 21 tests passed in 0.054s (10 prior engine tests + 11 new living-city tests).
Checks include cross-reference integrity, five choices, command idempotency, stale revision rollback, immutable city events, locked rewards, index lookups, unsourced artwork, deterministic dice and SQLite reopen/persistence.

## Honest limitations and next work
This is not the deployed Flutter UI, not a complete NPC AI, not multiplayer, not real world clock scheduling and not canonical campaign progression. World day/phase is a simple tick projection. Dice use caller seed and must not be trusted for multiplayer. Art prompts are not images. Next: connect trade link propagation, daily NPC schedules and rumor causality; port command engine to Node/Flutter; add real local assets and indexes; test snapshot replay and concurrency.
