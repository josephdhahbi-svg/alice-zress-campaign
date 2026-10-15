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

## User-locked immediate play sequence (2026-10-14, latest)
- Fast-forward pre-Pit travel without treating skipped material as played quests or earned rewards.
- Play in this exact order: Pit of Ghaunadaur -> Rabbit Hole (adventure starts) -> Hall of Infinite Doors -> Door of Ghaunadaur -> Eye of Infinite Mazes labyrinth trial -> emerge/ooze out -> Netherese storyline begins.
- Netherese arc occurs AFTER the Eye of Infinite Mazes, not before. Preserve the sequence and do not insert a different trilogy between them.
- Before the fall, Alice remains in character-creation/prologue state; first playable level begins with the rabbit-hole fall. No unearned advancement or loot.

## Rabbit-hole cinematic and level 1-4 opening (user direction, 2026-10-14)
- Alice possesses the **Skilled** feat before reaching/falling into the rabbit hole (user-confirmed homebrew character setup; legality/skill selections still to validate).
- At the rabbit-hole fall, Alice gains **Magic Initiate** (source/implementation to verify; distinguish from her Acolyte origin feat to avoid double-granting).
- Cinematic sequence: Mystra reaches out and grants **Shield**; Ghaunadaur's acid rains toward Alice; Eilistraee's sword crosses overhead, manifesting **Blade Ward** and shielding Alice from the acid. Blade Ward, NOT Light.
- Alice falls through to the **Hall of Infinite Doors**, sees **Larloch** (user pronounced 'Lor Kar'), a lich distinguished by a halo of colored gems, and glimpses an additional major boss described by user as 'the guy with the T' (identity UNCONFIRMED; do not guess).
- Mystra appears amid a **falling Netherese city** and a **multiverse-ending crisis**. Treat this as an ominous vision/foreshadowing until its chronology, identity and relation to the subsequent Netherese arc are established; don't silently move the Netherese playable arc ahead of Eye of Infinite Mazes.
- Play order remains Pit -> Rabbit Hole -> Infinite Doors -> Door of Ghaunadaur -> Eye of Infinite Mazes/pact -> ooze emergence -> Netherese adventure.
- No scene has been played or rewards actually earned merely by recording this cinematic design.
