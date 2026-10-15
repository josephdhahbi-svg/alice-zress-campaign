# Treasure Markings System — Moonveil Universe

Status: **ROUGH-DRAFT SYSTEM / CANON-GUARDED**
Purpose: turn walls, stones, ruins, ships, wreckage, roads, dungeons and planar environments into a persistent visual language connecting treasure, artifacts, documents, historical footprints and Roads Across Time & Space.

## Core rule
A treasure marking is evidence, **not a guaranteed treasure spawn**. It can be current, obsolete, copied, forged, misunderstood, displaced, or deliberately misleading. Every mark receives provenance and chronology.

## Mark record
`MARK_ID | symbol_family | symbol | meaning_claimed | creator/author | creator_confidence | era/date | original_location | current_location | surface/material | method | direction | domain_signature | complexity | road_id | item_ids | document_ids | puzzle_id | quest_id | faction | authenticity | condition | player_discovered | LIGHT_ID | source_status | callback`

## Symbol families

### HERO / TRAVELER MARKS
- **Crescent Blade** — weapon/relevant martial cache nearby.
- **Twin Circles** — paired objects or two-part cache.
- **Broken Arrow** — danger/trap before a cache.
- **Spiral Sun** — light-associated relic/evidence.
- **Rooted Hand** — buried nature/ecology cache.

These are Moonveil-original conventions unless a published symbol is separately verified.

### PATCHWORK / ARCHITECT MARKS
Candidate mythology only; Patchwork Architect remains unverified/not automatically canon.
- **Stitched Eye** — object appears sewn/reconnected into local reality.
- **Bone Spiral** — object associated with remains/ruin.
- **Ink Scar** — document/scroll hidden behind or within structure.
- **Threaded Star** — follow a Star Road.
- **Patch Sigil** — suspected spatial/temporal displacement.

### CREATURE / FACTION MARKS
Do not assume every scratch is a formal language.
- **Gnoll claw-pattern candidate** — possible pack/cache trail; Yeenoghu link requires evidence.
- **Demonic rune** — Abyssal/cult provenance candidate, not “hellforged” by default.
- **Leviathan bite/teeth pattern** — swallowed/carcass/wreck clue when ecology supports it.
- **Vampire blood glyph** — ruler/coven/coffin-cache candidate.
- **Illithid neural etching** — psionic/illithid provenance candidate.

### COSMIC / ROAD MARKS
- **Arcane Spiral** — unstable magical phenomenon/item.
- **Tempest Crest** — storm route/forged object.
- **Shadow Crescent** — concealment/shadow route.
- **Astral Line** — Astral/Spelljammer vector.
- **Time Knot** — evidence of multiple-era interaction; actual time displacement must be proven.

## Encoding
A complete marking can combine:
**SYMBOL + DIRECTION + SIGNATURE + COMPLEXITY + ROAD REFERENCE + ERA TRACE**

Example:
`Broken Arrow + Spiral Sun + downward notch + silver residue`
Player hypothesis: dangerous route to a light-associated cache below.
GM truth may differ until evidence confirms it.

## Surfaces
Dungeon walls; cavern floors/ceilings; standing stones; ruins; bridges; ship hulls; Sea of Swords wreckage; Spelljammer bulkheads; Astral wrecks; Avernus war machines; Abyssal stone; Feywild trees; Shadowfell memorials; Ravenloft estates; Netherese ruins; planar gates.

## Five foundational scrolls
These are Moonveil-original candidate documents and must receive DOC IDs when placed.

**The Stitched Map** — teaches Threaded Star + Bone Spiral + Ink Scar combination.
**The Architect's Warning** — warns that Patch marks may indicate displaced/echoed treasure.
**The Hero's Note** — explains one adventurer's Crescent Blade convention.
**The Monster's Claim** — field interpretation of fresh pack markings; author may be wrong.
**The Cosmic Directive** — introduces the Time Knot and choice between versions of a relic.

## Integration with persistent archaeology
After an adventure, survivors may deliberately leave markings beside:
- aftermath caches;
- abandoned equipment;
- hidden scrolls;
- graves/memorials;
- repaired roads;
- dangerous portals;
- monster territories;
- treasure they cannot safely carry.

Villains can forge heroic marks. Later cultures can misread old symbols. The Redactor can remove part of a marking. Spellplague or planar damage can distort one. A marking can therefore become a puzzle spanning several trilogies.

## Roads Across Time & Space
Markings attach to road graph edges:
MOON ROAD | EYE ROAD | INFERNAL ROAD | NETHER ROAD | DECK ROAD | REDACTOR ROAD | STAR ROAD.

Example long chain:
Promenade wall Crescent Blade -> Silence-of-Lolth field cache -> damaged Spellplague copy -> Waterdeep collector's rubbing -> Infernal auction catalogue -> Avernus war-machine mark -> later party reconstructs original route.

## One-off magic-item quests
The 60 rarity one-offs can use markings as optional treasure-hunt language:
COMMON teaches a simple mark;
UNCOMMON combines two;
RARE introduces forgery;
VERY RARE crosses regions/planes;
LEGENDARY requires historical provenance;
ARTIFACT requires multi-era/multi-source evidence and cannot be located from one symbol alone.

## Puzzle Tracker
Every significant marking can link to PUZ-ID.
Puzzle progression:
UNKNOWN -> SEEN -> COPIED -> INTERPRETED -> CROSS-CHECKED -> ROUTE IDENTIFIED -> CACHE FOUND -> PROVENANCE VERIFIED.

Finding the cache does not automatically solve artifact provenance.

## Map UI
When discovered, markings become optional map pins. Filters:
Known Marks | Untranslated | Verified | Suspected False | Hero | Creature | Cosmic | Netherese | Deck | Old One Candidate | Painting | Road | Era.

Selecting a mark shows player-known symbol, location, sketch, current interpretation, connected documents and confidence without exposing GM truth.

## LIGHT evidence
WHITE = verified physical mark.
BLUE = trustworthy heroic interpretation.
GREEN = unresolved/mixed interpretation.
GOLD = Netherese candidate evidence.
VIOLET = Far Realm/Old One candidate.
RED = hostile/forged/manipulated.
BLACK = erased/missing section.
PRISM = multiple independent evidence types converge.

## Canon protection
Published D&D creature/faction/deity symbols must be source-verified before being called official. The named symbols in this system are Moonveil conventions unless explicitly sourced. Gnoll marks do not prove Yeenoghu; eye imagery does not prove Ghaunadaur; infernal-looking runes do not prove Nine Hells provenance; Time Knot imagery does not prove time travel.

## Game database target
Suggested future tables:
`treasure_markings`
`treasure_marking_links`
`treasure_marking_observations`
`treasure_marking_translations`

This is a specification until migrations/UI are actually implemented and tested.

## Core gameplay loop
**SEE MARK -> COPY IT -> INTERPRET -> CROSS-CHECK -> FOLLOW ROAD -> SURVIVE OBSTACLE -> FIND CACHE -> VERIFY PROVENANCE -> UPDATE MAP/STORY/PUZZLE/ITEM TRACKERS -> LEAVE NEW TRACE.**

The player eventually becomes part of the same archaeological system they have been studying.
