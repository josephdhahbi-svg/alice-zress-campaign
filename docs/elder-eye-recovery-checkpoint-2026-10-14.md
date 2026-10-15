# Elder Eye recovery checkpoint — 2026-10-14

Status: verified repository inventory and user-confirmed design decisions. This is a planning checkpoint, NOT a played save or proof of full implementation.

## Locked campaign architecture
- Alice Z'ress: heroic female drow Great Old One Warlock; Ghaunadaur patron, Eilistraee devotion.
- 10 trilogies x 3 books = 30 books; 10 quests per book = 300 quest slots.
- Seven complete traversals, in 3-3-1 rhythm, = 2,100 quest playthrough slots. Book 30 loops to Book 1 except after final ascension.
- Three heroic narrative routes across the same 300 quests: Lawful Good (protection/just commitments), Neutral Good (mercy/redemption), Chaotic Good (liberation/freedom). Utility and Action are scene-level choices, not additional full moral routes.
- Character creation precedes the rabbit-hole fall. The first adventure begins with that fall. Do not mark planned quests completed.
- Per comic page: four illustrated story panels (2x2), fifth full-width decision panel with five choices in order Lawful Good, Neutral Good, Chaotic Good, Utility, Action; identify recommendation and possible consequences.

## Verified existing living city (DO NOT REBUILD FROM ZERO)
- `world/city/city-manifest.md`: Moonveil Universe City Engine V9, explicitly a homebrew prototype, not a deployed mobile app.
- `world/city/city_engine.py`: witness-driven crime/heat, investigations, corruption/bribery.
- `world/city/npc_scheduler.py`: NPC work/social/home routines and overrides.
- `world/city/street_encounter_merchant.py`: district encounters and merchant haggling.
- `world/city/district-status.json`: sample district states for Waterdeep High Ward, Trades Ward, Skullport, Promenade.
- `campaigns/seralyth-promenade/world/connected-world-slice-v1.json`: proposed connected Promenade world with nine named quest hooks, merchants and consequences; explicitly NOT implemented or canon-verified.
- `campaigns/seralyth-promenade/economy/ten-regional-shops-v1.json` and `ten-tavern-economy-v1.json`: existing economy datasets.
- `docs/promenade-trilogy-integrated-story-bible-v2.md`: 21 detailed Seralyth trilogy episodes, separate from Alice's later campaign.
- `data/quests.json` currently [] (no centrally registered quests); this does not erase outlined quests elsewhere.

## Existing Alice trilogy references
- `campaigns/seralyth-promenade/characters/alice-zress-illustrated-progression-outline-v1.md` names early trilogy settings: Underdark Origins; Netheril/Netherese Legacy; Phandelver and Below. Exact complete ten-trilogy mapping remains to be recovered, not invented.
- `docs/story-roadmap.md` separately describes foundational Eilistraee prologue, Alice origin, and Abyss arc; do not conflate with Seralyth prequel.
- Canon/date/location availability gates remain mandatory for NPCs, deities, places, spells, items and events.

## Save protocol for future sessions
1. Read this checkpoint and the existing files before creating or replacing story/world records.
2. Maintain a source inventory separating verified files, user-approved design, drafts, simulations, and played outcomes.
3. After each actual played decision, write an event/checkpoint with quest ID, traversal, book, choice, roll, timestamp/sequence, location, world-state delta and consequences; verify GitHub write by re-reading.
4. Do not claim automatic continuous synchronization, a completed mobile UI, or a successful save without confirmation.
5. Never overwrite established city engine or Seralyth quests when building Alice's three routes.
