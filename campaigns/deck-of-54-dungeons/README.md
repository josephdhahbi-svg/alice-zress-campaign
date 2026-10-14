# Deck of 54 Dungeons — Moonveil production register
**ADM:** ADM-DOMT-001 | **Status:** initial production scaffold, not simulated/completed.
Each of the 54 custom Moonveil cards maps 1:1 to a dungeon, map, story, NPC roster, monsters, side quests, chests, loot, choices, cosmic observation, STEAM challenge, rating audit, autopsy and class performance log.

## Rules and counts
- The official Deck of Many Things uses 22 cards (some versions 13); the expanded Book/Deck of Many Things product includes 66 cards. **Moonveil's 54-card deck is an independent custom deck** with 52 standard-suit cards + two Jokers. Do not conflate their mechanical effects.
- 2024 Player's Handbook has **12** base classes. Official Artificer is available in *Eberron: Forge of the Artificer* (2025). To reach **15**, the Warden and Scholar are provisional Moonveil homebrew, not official 2024 classes.
- 15 editable character records are in `characters/moonveil-15-editable-sheets.json`; no unverified HP, features, or scores have been invented.
- Character sheets track 3 attunement slots, early cursed items, purification rituals, ancestry/species, class source and continuity metadata.
- User's separate cosmic living deck with five Jokers is a **different deck variant**; do not silently overwrite this 54-card media deck.
- No playtests or dice rolls have been run yet; simulation counts remain zero until actually executed.

## Dungeon template
Each `DNG-###` should contain: 15 keyed rooms, 1 boss, 3 side quests, 3+ chests, 1 cameo/callback, 1 STEAM investigation, 1 star/deity evidence trail, roads/routes, a 5-choice decision, and 10-part autopsy with Lessons Learned. Maps should have a legend, grid coordinates and scale. Boss/monster stat blocks must be sourced or marked homebrew. Tone follows ADM-RATING-001, with restrained gore.

## Play sequence
Begin `CARD-001 / DNG-001` (Ace of Moons: Moonrise). Create and validate its encounters and level-appropriate mechanics, simulate party decisions and resource consumption, then record outcomes before calling it tested. Do not mark the other 53 as played prematurely.

## Original editable sheet schema
Every record includes abilities, AC, HP, proficiency, spells, gear, attunement, corruption and DPS/Tank/Utility logs. Fill these through a rules-verified character creation pass before representing them as legal 2024 builds.
