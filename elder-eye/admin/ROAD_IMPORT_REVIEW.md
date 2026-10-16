# Moonveil Roads import review

Status: proposed content, not merged into canonical Elder Eye book order.

## Incoming collection
30 thematic Roads, beginning Road of Arcana and Road of Nature. First two roads contain ten detailed adventures each. Roads 3-30 have titles and expansion templates only. Twelve example JS/JSON modules (six per road) are sketches, not production-ready.

## Canon conflict
Elder Eye's established Book 1 is The Watcher of the Shallows and Book 2 is The Sunken Spire. Do not replace these with Road of Arcana or Road of Nature. The road collection is a candidate secondary content taxonomy, not an approved replacement for the book chronology.

## Integration policy
- Keep existing character, scene and asset IDs unchanged.
- Stage road content in a separate namespace (ROAD-ARCANA, ROAD-NATURE).
- Mark all NPCs, rewards, spells, locations, bosses and timeline positions unverified until continuity review.
- Do not award proposed items or spells until quests are approved and completed.
- Convert console-only module stubs to transaction-backed event and state changes before wiring to VTT.
- Preserve five choices in order: Lawful Good, Neutral Good, Chaotic Good, Utility, Action.
- All visual assets must be photorealistic cinematic.

## Next
Create a normalized import manifest and crosswalk to Elder Eye books, add quest objectives/boss phases, validate duplicate NPC names, and write integration tests.
