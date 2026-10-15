# Moonveil Universe Expansion Engine — Roads, Maps, Dimensions, Graphs & Data

Status: **ROUGH-DRAFT WORLD EXPANSION STANDARD**
Purpose: turn every brainstorm adventure, historical era, character, artifact, monster, settlement and planar event into reusable data that expands the universe instead of remaining isolated prose.

## 1. Universe graph
Every important thing becomes a NODE. Every meaningful connection becomes an EDGE.

NODE types:
CHARACTER | PARTY | FACTION | QUEST | STORY | LOCATION | ROAD | CITY | REGION | DUNGEON | PLANE | DIMENSION | PORTAL | ERA | EVENT | MONSTER | ARTIFACT | DECK_CARD | NETHER_MAGIC | OLD_ONE_OBJECT | PAINTING | BOOK | SONG | MAP | ECONOMY | GOVERNMENT | CULTURE | ECOLOGY | STEAM | DEITY | MYSTERY | LIGHT.

EDGE types:
LOCATED_AT | TRAVELS_TO | LEADS_TO | ALLIED_WITH | OPPOSES | OWNS | STOLE | CREATED | DISCOVERED | GUARDS | REQUIRES | UNLOCKS | FORESHADOWS | CAUSED_BY | DESCENDED_FROM | KNOWS | WORSHIPS | TRADES_WITH | RULES | CONNECTS_TO | PORTAL_TO | PRECEDES | CONTRADICTS | CONFIRMS | TRANSFORMS_INTO.

Every EDGE stores chronology and confidence so a connection can be historical, current, suspected, false, erased or future.

## 2. Road engine
A road is more than a line on a map.

ROAD record:
ROAD_ID | name | road_type | origin | destination | intermediate_nodes | plane | distance | travel_time | terrain | controlling_faction | toll/cost | trade_goods | travelers | monsters | hazards | settlements | inns/services | quests | historical_events | portals | secret_routes | current_condition | source_status.

Road types:
surface road; city street; tunnel; river/sea lane; caravan route; pilgrimage road; military road; smugglers' route; Underdark passage; planar path; Astral route; Spelljammer lane; Fate Gate; moon-road; memory-road; relationship-road.

Road law:
Every major dungeon should eventually have **a reason people can reach it**, even if that reason is a portal, ritual, ship lane or impossible road.

## 3. Map hierarchy
MAP-WORLD -> MAP-CONTINENT/REGION -> MAP-CITY -> MAP-DISTRICT -> MAP-ROAD -> MAP-SITE/DUNGEON -> MAP-TACTICAL -> MAP-PLANAR -> MAP-COSMIC.

Every map pin stores:
PIN_ID | node ID | x/y or grid | layer | discovered? | player-visible? | era | current state | icon | connected roads | active characters | active quests | artifacts | encounters.

Historical map layers allow the same place to be viewed in 1358 DR, Silence of Lolth era, Spellplague, Second Sundering, Descent into Avernus era and BG3 threshold without pretending geography never changes.

## 4. Dimension/plane engine
DIM_ID | name | cosmology class | parent plane | access methods | exits | time behavior | gravity | magic behavior | environment | settlements | factions | native creatures | visiting creatures | resources | economy | hazards | divine influence | known artifacts | mysteries | source/canon status.

Important separation:
Underdark = geographic subterranean world on Material Plane.
Abyss = Outer Plane.
Nine Hells = Outer Plane.
Astral/planar routes = separate travel environments.
Far Realm = treated according to verified source plus Moonveil cosmology labels.
Never collapse them into one generic “underground/other dimension.”

## 5. Eleven-category data vector
Every major NODE receives 11 values from 0–5 indicating how strongly it currently participates in:
1 People
2 Quests
3 Places
4 Artifacts
5 Economy
6 Government/Factions
7 Culture/Faith/Arts
8 Ecology/Creatures
9 STEAM/Professions
10 History/Memory
11 Cosmos/Planes/Unknown

This creates comparable data for settlements, dungeons and whole trilogies and exposes empty worldbuilding categories.

A zero is not automatically bad. It means “not yet developed/relevant.” Fill blanks only when doing so improves the story.

## 6. World-density dashboard
For every city/region/trilogy track:
named characters;
active factions;
main quests;
side quests;
roads;
settlements;
dungeons;
shops/services;
government institutions;
cultures/faiths;
professions;
ecological systems;
monster populations;
artifacts;
puzzles;
historical events;
planar connections;
economy transactions;
unresolved mysteries;
player choices with persistent consequences.

Use these counts to find thin regions rather than padding every region equally.

## 7. Adventure intake conversion
The Absolute Chaos brainstorm contributes reusable NODE clusters:

Fate Unbound -> Deck/card-realm/Fate Gate nodes.
Leviathan's Lair -> Sea of Swords route/pirate/leviathan nodes.
Avernus Last Stand -> infernal road/Blood War/logistics nodes.
Out of the Abyss -> Underdark/Abyss/demon-lord nodes, source verification required.
Space Pirates -> Spelljammer lanes/pirate ports/comedy-relief nodes.
Dragon Nation -> nation-state/dragon ecology/politics nodes.
Far Realm War -> cosmic boundary/first-contact/hostile-intrusion nodes.

Do not preserve a brainstorm scene merely because it exists. Break it into reusable nodes and reconnect the strongest pieces.

## 8. Historical road layers
Build historical versions of important routes:
1358 Avatar/Time of Troubles;
1372–1373 Silence of Lolth;
1385 Spellplague;
Spellplague aftermath;
1482–1487 Second Sundering;
1490s reconstruction;
Descent into Avernus;
STOP at BG3 opening for the historical prologue.

Artifacts and characters get movement edges across these layers. This lets an item discovered in 1492 have a custody chain reaching backward rather than magically appearing.

## 9. Monster migration graph
Every monster encounter gets:
native environment -> reason displaced/traveling -> route used -> current location -> faction/behavior -> outcome -> ecological consequence.

Examples:
Abyssal demon -> cult summoning breach -> Underdark -> defeated/escaped/contained.
Infernal creature -> contract transport -> Waterdeep-region smuggling route.
Sea monster -> disrupted migration -> Sea of Swords trade lane.
Far Realm entity -> observation window -> planar threshold; behavior UNKNOWN until observed.

This permits “monsters from everywhere” while preserving world logic.

## 10. Artifact knowledge graph
Three protected source lanes:
NETH = verified/candidate Netherese magic.
DECK = official Deck material/Moonveil fate adaptations.
OLD = Old One/Far Realm candidate artifacts.
PNT = Eleven Ruler Paintings.

Artifacts connect through:
creator -> owner -> thief -> buyer -> ruler -> dungeon -> puzzle -> ritual -> consequence -> next artifact.

Track provenance and never infer creator from aesthetics alone.

## 11. Graph loops
Preferred loop:
PERSON -> QUEST -> ROAD -> CITY/REGION -> FACTION -> ECONOMY -> ARTIFACT -> HISTORY -> PLANE -> MYSTERY -> PERSON.

Cosmic loop:
UNDERDARK -> WATERDEEP -> SEA OF SWORDS -> AVERNUS/HELLS -> ABYSS -> PLANAR CROSSROADS -> ASTRAL/SPACE -> FAR REALM BOUNDARY -> historical clue -> UNDERDARK.

Evidence loop:
LIGHT -> WEB -> WEAVE -> MAP -> STORY -> CHOICE -> CONSEQUENCE -> HISTORY -> new LIGHT.

## 12. Player-facing graph/map filters
Filters should eventually include:
Current Era;
Current Trilogy;
On Board Characters;
Active Quests;
Unresolved Puzzles;
Known Roads;
Unknown Roads;
Trade;
Faction Control;
Monster Threat;
Netherese;
Deck;
Old One;
Paintings;
Historical Layer;
Planar Layer;
LIGHT confidence;
WEAVE relationships.

The player sees only discovered data. GM/database truth remains hidden.

## 13. Data quality states
Every record:
IDEA -> REGISTERED -> MAPPED -> CONNECTED -> SOURCE-CHECKED -> PLAYTESTED -> CANONIZED.

Additional flags:
CANON-PUBLISHED;
MOONVEIL-HOMEBREW;
ADAPTED;
UNKNOWN;
CONTRADICTED;
HISTORICAL;
PLAYER-DISCOVERED;
GM-HIDDEN.

## 14. Expansion algorithm
Whenever new brainstorm material arrives:
1 preserve original intake;
2 extract nodes;
3 extract connections;
4 assign era;
5 assign geography/plane;
6 assign one or more of eleven categories;
7 connect roads/portals;
8 place characters;
9 place artifacts;
10 connect quests;
11 add economy/ecology/government effects;
12 add source/canon label;
13 add player-vs-GM knowledge;
14 identify missing links;
15 generate only useful missing content;
16 feed consequences into later trilogies.

This is how the universe grows outward without losing continuity.

## 15. Bigger-universe principle
More data is useful only when it creates **relationships and consequences**.

Do not measure world size only by number of locations. Measure:
how many locations affect each other;
how many people move between them;
how trade changes;
how wars alter roads;
how ecology reacts;
how artifacts move;
how history is remembered incorrectly;
how planar events affect ordinary people;
and how a decision in an early trilogy can still matter in Trilogy 10.

The goal is not a pile of maps. It is a living graph whose maps, stories, timelines, economies, artifacts, monsters and characters all describe the same universe.
