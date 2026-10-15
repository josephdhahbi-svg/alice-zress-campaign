# Cosmic Monster Codex v1

Status: source-index draft. CR values refer to 2014-era fifth edition. Monster stat-block text is not reproduced. Check edition, licensing, and encounter balance before game implementation.

| Tier | Creature | CR | Source |
|---|---|---:|---|
| I | Cultist | 1/8 | Monster Manual (2014) |
| I | Grimlock | 1/4 | Monster Manual (2014) |
| I | Star Spawn Grue | 1/4 | Mordenkainen's Tome of Foes (2018) |
| II | Cult Fanatic | 2 | Monster Manual (2014) |
| II | Gibbering Mouther | 2 | Monster Manual (2014) |
| II | Star Spawn Mangler | 5 | Mordenkainen's Tome of Foes (2018) |
| III | Mind Flayer | 7 | Monster Manual (2014) |
| III | Aboleth | 10 | Monster Manual (2014) |
| III | Star Spawn Hulk | 10 | Mordenkainen's Tome of Foes (2018) |
| IV | Star Spawn Seer | 13 | Mordenkainen's Tome of Foes (2018) |
| IV | Star Spawn Larva Mage | 16 | Mordenkainen's Tome of Foes (2018) |
| V | Lesser Star Spawn Emissary | 19 | Van Richten's Guide to Ravenloft (2021) |
| V | Greater Star Spawn Emissary | 21 | Van Richten's Guide to Ravenloft (2021) |

Narrative tier is not encounter challenge rating. Monsters are reusable encounter resources, not proof of canonical allegiance to Tharizdun or another deity. No high-CR random spawns for Alice at level one.

## Two source piles

**Published D&D lore:** Tharizdun and Dendar are established D&D entities, but no standard direct 5e avatar stat block has been verified for either. Zargon has a direct 5e boss stat block in Quests from the Infinite Staircase (2024). Star spawn have published 5e creature stat blocks and can support all five narrative tiers.

**Mythos crossover / custom boss implementation:** Cthulhu is referenced as a possible Great Old One patron in the 2014 Player's Handbook, but has no standard official 5e direct boss stat block. Yog-Sothoth and Azathoth are Mythos-origin entities with older-edition crossover history to verify; no standard official 5e boss blocks are established here. These must not be mislabeled as Forgotten Realms canon.

**Proposed boss sequence:** Dendar -> Cthulhu -> Yog-Sothoth -> Azathoth -> Tharizdun. This is story encounter order, not an official cosmic power ranking. Ghaunadaur is Alice's patron, not automatically an enemy.

## Next implementation gates

1. Verify specific sourcebook pages and historical availability for each creature and boss.
2. Build metadata records compatible with data/schema.json; never copy nonlicensed stat blocks.
3. Add CR-aware, party-aware encounter selection and explicit story locks.
4. Validate JSON and test no level-one cosmic avatar spawns.
5. Integrate into quest routing without advancing saved gameplay.
