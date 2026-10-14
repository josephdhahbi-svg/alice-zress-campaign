# Three Chosen - Connected Progression Ledger

Status: LOCKED DESIGN RULE
Updated: 2026-10-14

## Core rule
Everything connects. Character choices, story events, levels, milestones, feats, skills, proficiencies, instruments, spells, pact features, Chosen status, relationships, equipment, and transformations must point to one another instead of existing as isolated lists.

## Level 3 collection rule
Each of the three Chosen has exactly 10 meaningful personal items by completion of the Level 3 milestone.

Exactly 3 are pact/attunement items:
1. Offense
2. Defense
3. Utility

The remaining 7 must record meaningful character development rather than filler loot:
4. Instrument / artistic choice
5. Skill-linked item
6. Tool, language, weapon, or training-linked item
7. Feat-linked item
8. Chosen / faith / patron-linked item
9. Relationship-linked item
10. Destiny / transformation-linked item

## Required provenance for every item
Every item record must answer:
- WHEN: level, milestone, scene, and sequence marker
- WHERE: exact location and plane
- WHO: giver, teacher, maker, former owner, patron, deity, faction, or discoverer
- HOW: quest, training, inheritance, pact, reward, discovery, crafting, ritual, or choice
- WHY: personal meaning and story reason
- CHOICE: what the player/character selected and alternatives when relevant
- UNLOCK: feat, skill, proficiency, instrument, spell, pact feature, relationship, Chosen feature, or other mechanic connected to it
- REQUIREMENTS: prerequisites and attunement requirements
- NUMBER MEANING: why its collection number/milestone number matters
- FUTURE: upgrade/evolution/ascension connection
- SOURCE: official source, user reference, homebrew, or campaign-original
- CONTINUITY: chronology/geography/canon notes

## Numbers matter
- 3 Chosen protagonists.
- 3 pact attunement roles per Chosen: offense / defense / utility.
- 10 Level-3 personal items per Chosen.
- 30 total meaningful Level-3 items across all three.
- 9 total pact/attunement items across all three.

Do not change these numbers casually. A numerical change requires an explicit design reason.

## Progression rule
The 10 items are earned across Levels 1 -> 2 -> 3. They are not simply handed to the character at creation. Acquisition scenes must connect mechanically and narratively to the feat/skill/proficiency/instrument/spell/pact/Chosen decisions made at that point.

Example principle: if a character chooses an instrument or gains Performance, record the scene, teacher/source, instrument choice, reason for the choice, related item, and later consequences. Do not merely add "Performance proficiency" to a sheet.

## Eilistraee / angel-path reference package
Current user-supplied visual references include Eilistraee/Dark Maiden imagery and material for Chosen of Eilistraee, Moonsong, Sword Dancer, Moonsong Encore, Waltz of the Dark Maiden, Moondance, Sword Dance, Spellsong, Silverhair Knight, Silvered Weapon, Aura of Truth, Dark Maiden's Vessel/avatar transformation, College of Sword Dancing, Eilistraee's Moonfire, Eilistraeen spells, Drow Bladesinger, and moon-themed swords.

These are design references. Preserve official/homebrew/source distinctions. Do not silently treat homebrew as official.

## Working data columns for spreadsheet/database
chosen_id | item_no | item_name | category | attunement_role | level | milestone | scene_id | sequence | location | plane | giver_teacher | acquisition_method | story_reason | player_choice | unlock_type | unlock_name | prerequisites | instrument | skill | proficiency | feat | spell | pact_feature | relationship | chosen_feature | number_meaning | future_evolution | source | canon_status | continuity_notes

## Implementation principle
Notepad/Markdown notes are the human-readable story bible.
Spreadsheet/Excel is the structured cross-reference ledger.
GitHub is the version-controlled source of truth for implementation and synchronization.
All three must use stable IDs so a story scene, item, feat, skill, and game record can cross-reference each other.


## Locked genre identities — Three Chosen

- **Chosen 1 — Alice:** Drow, Underdark / Elder Eye path. **Genre identity: MADNESS.** Her Underdark journey, Rabbit Hole, Elder Eye, cosmic doors and related presentation should use Madness as the governing genre/aesthetic identity.
- **Chosen 2 — Solar:** Aasimar, Angel path. **Story shape: MIDDLE → LOW → RISE.** Mortal/Material beginning → descent into Avernus → ascent to space/stars → earned Angel/Solar culmination.
- **Chosen 3 — Dhampir Undead Warlock:** Ravenloft path. **Genre identity: GOTHIC.** Ravenloft, undeath, horror architecture and the eventual lich path should use Gothic as the governing genre/aesthetic identity.

These identities are structural design rules, not merely visual labels. They should influence locations, encounters, music, imagery, character progression, items, dialogue, quests and UI while preserving each character's distinct story.


## Locked poster emblem — Three Warlocks / Three Diamonds

When the Three Chosen trilogy work is complete, create a **poster featuring the three warlocks/Chosen** and their shared emblem: **three adjacent diamond-shaped gems arranged as a triangular three-part symbol**.

### Exact gem composition
- **RED diamond:** furthest left; oriented/pointing **left**.
- **GREEN diamond:** centered above the other two; highest point of the composition; oriented/pointing **up**.
- **BLUE diamond:** furthest right; oriented/pointing **right**.
- The three gems sit directly next to one another and collectively read as a **triangle / three-part crest**.

Simple layout reference:

```
          ◆ GREEN
         points UP

RED ◆               ◆ BLUE
points LEFT       points RIGHT
```

The emblem represents the three central characters together and is reserved as a major visual identity for the eventual trilogy poster. Preserve the red-left / green-up / blue-right placement consistently in future poster, logo, UI, title-card, and promotional concepts unless the user explicitly changes it.


## LOCKED DESIGN POLICY — Three Chosen as Homebrew World-Mapping NPCs

The universe is built and mapped **first through the Three Chosen as campaign-original/homebrew characters**. This development phase intentionally permits homebrew classes/features, transformations, items, spells, divine relationships, progression systems, cosmological links, and other mechanics needed to establish the setting.

The Three Chosen are not merely player-character drafts. They are **signature setting characters / DM-usable NPCs** who embody and reveal the universe. A Dungeon Master running adventures in this setting may use them as major NPCs, patrons, allies, rivals, quest-givers, historical figures, cosmic guides, or other story roles appropriate to the campaign.

Their journeys function as three primary lenses for mapping the universe:
- **Alice — MADNESS:** Drow / Underdark / Elder Eye / Rabbit Hole / Infinite Doors / cosmic-unreality route.
- **Solar — MIDDLE → LOW → RISE:** Aasimar / mortal world → descent into Avernus → ascent through stars/space → Angel/Solar culmination.
- **Dhampir Undead Warlock — GOTHIC:** Ravenloft / undeath / Gothic-horror route → eventual lich culmination.

Together, their three routes establish major geography, cosmology, factions, divine conflicts, cultures, themes, planar roads, quest structures, and visual language before ordinary book-rules characters are introduced.

### Homebrew-first, official-rules-second rule

1. **Worldbuilding phase:** use the Three Chosen and clearly labeled homebrew/campaign-original material to map and develop the universe.
2. **Setting stabilization:** document the resulting locations, cosmology, factions, history, conflicts, doors/routes, and DM-facing setting material.
3. **Official-character phase:** afterward, build ordinary playable characters using the selected official D&D rules/sourcebooks as written, with homebrew excluded unless the DM explicitly opts into it.
4. Never disguise campaign-original mechanics as official rules. Every record continues to carry its source/canon status.

This separation allows the Three Chosen to be mythic signature figures of the setting while players can still enter the completed universe using straightforward official-rule characters.
