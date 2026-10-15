# Moonveil Campaign Atlas — Maps, Trackers, Webs, Weaves & Lights

Status: **LIVING MASTER INDEX / ROUGH-DRAFT CONTENT**
Purpose: one administrative layer that says where every quest, person, object, clue, faction and unresolved mystery is, how it connects, and where it moves next.

## 1. Master campaign-map hierarchy
Use six simultaneous map scales:
1. **WORLD** — Faerûn / Sword Coast and later planes/cosmos.
2. **REGION** — Baldur's Gate, coast, trade roads, Underdark, Far Realm thresholds.
3. **SETTLEMENT** — districts, markets, guilds, government, shops, NPC homes/workplaces.
4. **SITE** — ruin, vault, observatory, lighthouse, dungeon.
5. **TACTICAL** — numbered/grid encounter maps.
6. **CONNECTION** — non-geographic web showing quests, people, objects, evidence, economy and consequences.

Map IDs:
WORLD-MAP-### | REG-MAP-### | CITY-MAP-### | SITE-MAP-### | TAC-MAP-### | WEB-MAP-###

## 2. Current route map
WORLD-MAP-001 / REG-MAP-001:

[BALDUR'S GATE]
  SC-DNG-001 Card Beneath Gate
       |
       v
[SWORD COAST ROAD / COAST]
  SC-DNG-002 Road Written in Salt
       |
       v
[COASTAL RUIN]
  SC-DNG-003 Choir Below Tide
       |
       v
[TRADE-ROAD DESCENT]
  SC-DNG-004 Broken Trade Road
       |
       v
[UNDERDARK MARKET]
  SC-DNG-005 Market of Unspoken Names
       |
       v
[UNDERDARK PRINT NETWORK]
  SC-DNG-006 Printing House of Tomorrow
       |
       v
[ERASED RUIN]
  SC-DNG-007 Ruin of Sixth Figure
       |
       v
[ROADS UNDER ROADS]
  SC-DNG-008 Roads Under Roads
       |
       v
[FORGOTTEN CUSTOMS HOUSE]
  SC-DNG-009 Customs House Without Buyer
       |
       v
[BLANK VAULT]
  SC-DNG-010 Blank Vault
       |
       v
[FAR REALM THRESHOLD]
  FR-DNG-020 -> 019 -> ... -> 002 -> 001 Eye Beyond Last Door

Only Baldur's Gate is presently a firmly named conventional city on this route. Do not invent names for the coastal/Underdark settlements merely to fill the map. Assign exact published settlements only after continuity/source verification.

## 3. Location tracker
Each location record:
LOCATION-ID | map ID | name | type | plane | region | parent location | coordinates/grid | source status | government | economy zone | controlling faction | population/status | entrances | exits | quests | NPCs present | items present | dangers | services | current world-state | last updated run.

Movement rule: an NPC/item cannot appear in two simultaneous locations without a stated travel, duplication, projection, teleportation or chronology explanation.

## 4. Character tracker
Each NPC/PC:
CHAR-ID | name | BLUE/RED/GREEN | role | profession | home | current location | destination | party/faction | alive/status | relationship scores | current quest | knowledge | carried items | promises/debts | last scene | next expected scene | chronology marker.

Current recurring network:
SC-NPC-001 Mara Vey — Baldur's Gate civic origin; lamplighter; Lamp Ledger.
SC-NPC-002 Deren Vale — Baldur's Gate law/investigation; provisional Flaming Fist affiliation pending continuity verification.
SC-NPC-003 Lysa Saltvoice — coastal signal network; singer/navigator.
SC-NPC-004 Orren Chalk — route network; cartographer/surveyor.
SC-NPC-005 Tavia Bronzethread — trade-road engineering; smith/engineer.
SC-NPC-006 Pell Quill — books/comics/archive network.
SC-NPC-007 Sella Mirrorglass — painting/restoration network.
SC-NPC-008 Vhaera Nhal — Underdark trade network.
SC-NPC-009 Brikk Fen — salvage/recording technology.
SC-NPC-010 Aveline Rook — relic/economy network.
SC-NPC-011 Brother Caldus — healing/history network.
SC-NPC-012 Inkless Courier — location variable/unknown.
SC-NPC-013 Yara Copperquill — Underdark-connected print network.
SC-NPC-014 Nym Orl — Roads Under Roads.
SC-NPC-015 Saelra Vonn — erased-ruin/art conservation.
SC-NPC-016 Torren Ashwake — freight/customs network.
SC-NPC-017 Velis Nine-Fingers — antiquities/provenance network.
SC-NPC-018 The Redactor — location/identity unresolved.

Do not overwrite locations when people travel: add MOVE records.

## 5. Quest tracker
QUEST-ID | chain | main/side | status | giver | location | prerequisites | objective | NPCs | artifacts | clues | economy | morality | STEAM | map | next quest | callbacks | unresolved threads.

Three current macro chains:
- **CHAIN-A Nine Roads / Trade Road:** SC-DNG/MQ/SQ 001–005.
- **CHAIN-B Ink Road / Redactor:** SC-DNG/MQ/SQ 006–010.
- **CHAIN-C Far Realm Reverse Path:** FR-DNG/SCR 020→001.

Current minimum: 30 principal adventures. SC 001–010 each has a primary scroll and a connected side-quest framework; Far Realm has 20 principal scroll-linked adventures.

## 6. Object tracker — three-source separation
Never collapse these categories.

### NETH — Netherese magic
NETH-ID | object | verified creator/culture | era | source | found at | owner | function | value/status | related quest | evidence confidence | next use.
Rule: ancient magic is NOT automatically Netherese.

### DECK — Deck of Many Things / fate objects
DECK-ID | official card/source or Moonveil adaptation | manifestation | found at | current holder | effect/story function | fate consequence | source verification | next callback.
Rule: distinguish official Deck material from Moonveil inventions.

### OLD — Old One / Far Realm artifacts
OLD-ID | object | alleged creator | verified creator | found at | observation/contact/understanding function | corruption/risk | boundary/consent rule | owner | market status | next use.
Rule: Far Realm proximity, eye imagery or unknown origin does NOT prove Ghaunadaur/Old One authorship.

Initial OLD candidates already in design:
OLD-CAND-019 Lens of Nineteen Errors
OLD-CAND-018 Tuning Fork of Silent Interval
OLD-CAND-017 Compass of Nonparallel Roads
OLD-CAND-016 Ledger Coin of Before-and-After
OLD-CAND-015 Bookmark of Unwritten Chapter
OLD-CAND-014 Key of Hospitable Margin
OLD-CAND-013 Prism of Lower Beacon
OLD-CAND-012 Stonepass Survey Chain
OLD-CAND-011 Token of Remembered Self
All remain **CANDIDATE/UNKNOWN CREATOR** until evidence verifies origin.

## 7. Evidence web
WEB-MAP-001:
Mara's Lamp Pulse
 -> Lysa's Signal Song
 -> coastal route key
 -> Underdark trade road
 -> print alignment
 -> Sixth Figure
 -> Nym family survey mark
 -> Roads Under Roads
 -> missing customs buyer
 -> Keeper of Blank Vault
 -> Blank Vault catalogue coordinate
 -> Incorrect Constellation
 -> Silent Interval
 -> Watching Geometry
 -> temporal caravan
 -> future book
 -> marginal city
 -> lighthouse
 -> relationship-road
 -> memory market
 -> unpainted gallery
 -> Sixth Shadow
 -> protective censorship
 -> Archive of Necessary Lies
 -> First Listener
 -> Learning Signal
 -> Questions From Outside
 -> Window
 -> Claiming Thought
 -> Eye Beyond Last Door.

Every arrow must eventually carry an EVID-ID supporting why the connection exists.

## 8. WEAVES — relationship and consequence network
A **WEAVE** is a connection that changes when characters make choices.

WEAVE-A AUTHORITY:
Aurelia <-> Deren <-> Baldur's Gate institutions <-> Redactor question.
Tracks protection, lawful custody, censorship and accountability.

WEAVE-B RESTORATION:
Amara <-> Caldus <-> Sella <-> Saelra.
Tracks healing people, restoring objects, recovering history and deciding whether restoration can itself cause harm.

WEAVE-C INFRASTRUCTURE:
Elara <-> Tavia <-> Nym <-> Torren.
Tracks roads, engineering, logistics, worker safety, trade and physical consequences.

WEAVE-D NAVIGATION:
Seraphine <-> Lysa <-> Orren <-> Far Realm lighthouse.
Tracks maps, songs, ecology, routes, stars and safe passage.

WEAVE-E EVIDENCE:
Ilyra <-> Pell <-> Yara <-> Inkless Courier.
Tracks text, comics, printing, magic, provenance and contradictory evidence.

WEAVE-F OWNERSHIP:
Vhaera <-> Rook <-> Velis <-> Blank Vault.
Tracks trade, restitution, relic ownership, markets and cultural claims.

WEAVE-G OBSERVER:
Sixth Figure -> Sixth Shadow -> observer-space -> Window -> Claiming Thought -> final Observer.
Tracks SEE / BE SEEN / CONSENT / BOUNDARY.

## 9. LIGHTS — navigation and truth-confidence layer
A **LIGHT** marks something the party can follow through uncertainty.

LIGHT-WHITE = verified physical evidence.
LIGHT-BLUE = trustworthy heroic/person testimony, still cross-checkable.
LIGHT-GREEN = neutral/mixed testimony or unresolved interpretation.
LIGHT-GOLD = Netherese magical evidence.
LIGHT-VIOLET = Far Realm/Old One candidate signal.
LIGHT-RED = hostile/manipulated evidence.
LIGHT-BLACK = missing/erased evidence.
LIGHT-PRISM = multiple independent evidence types converge.

Each major clue gets:
LIGHT-ID | color | evidence IDs | confidence 0–5 | source count | contradiction count | location | who knows | unlocks | false-path risk.

No clue becomes PRISM merely because it is dramatic; require independent convergence.

## 10. Map pins
Every campaign map can use:
🏙 settlement
🏛 government/civic
⚒ engineering/workshop
💰 market/economy
📜 quest/scroll
🃏 Deck/fate
◇ Netherese
👁 Old One/Far Realm candidate
🎨 painting/art
🎵 song/music
📚 book/archive
🗺 map/navigation
🏚 ruin
⚔ combat/boss
❤️ ally/rescue
❓ unresolved
🚪 portal/Fate Gate/threshold
💡 LIGHT evidence
🕸 WEAVE connection

## 11. Live dashboards
Maintain:
- **DASH-QUEST** — open/completed/failed/locked quests.
- **DASH-CAST** — every person's current location/status.
- **DASH-ITEM** — item owner/location/value/attunement.
- **DASH-NETH** — verified/candidate Netherese objects.
- **DASH-DECK** — cards/manifestations/fate consequences.
- **DASH-OLD** — Old One/Far Realm candidates and confidence.
- **DASH-MAP** — discovered/unexplored/blocked routes.
- **DASH-ECON** — wallets, treasury, shops, TXNs, regional economy.
- **DASH-REL** — relationships, promises, debts, rivalries.
- **DASH-WEAVE** — consequence network.
- **DASH-LIGHT** — evidence confidence and contradictions.
- **DASH-CONTENT** — PG-13 audit.
- **DASH-CONTINUITY** — date/era/geography/source contradictions.
- **DASH-SIM** — BUILT/SIMULATED/AUTOPSIED/CANONIZED.

## 12. Update protocol
After every scene/run:
1. update current map pin;
2. update character MOVE/status;
3. update quest state;
4. update item ownership/location;
5. add economy TXNs;
6. add evidence/LIGHT;
7. modify relationship WEAVES;
8. connect callbacks;
9. update chronology;
10. run continuity + PG-13 checks.

Nothing important should exist only in prose. Give it an ID and place it on at least one tracker/web/map.

## 13. First master visualization
LIGHTS illuminate evidence.
WEAVES show changing relationships/consequences.
WEB lines show factual clue connections.
MAPS show physical location.
Together:

LIGHT (what appears true)
   ↓
EVIDENCE WEB (what connects)
   ↓
WEAVE (who/what changes because of it)
   ↓
MAP (where consequence occurs)
   ↓
QUEST (what players can do)
   ↓
CHOICE
   ↓
WORLD-STATE UPDATE
   ↺ back into LIGHT / WEB / WEAVE / MAP.

This loop is the campaign's living-world tracking engine.


## 14. Eleven-category Living World Connection Matrix

The campaign now uses **11 connected categories**. The original mapping/tracking layers remain; these eleven are the content categories that must exchange information and consequences.

| # | Category | Symbol | Tracks | Must connect to |
|---|---|---|---|---|
| 1 | People & Relationships | 👥 | PCs, NPCs, families, allies, rivals, promises, romance, reputation | quests, factions, locations, culture |
| 2 | Quests & Choices | 📜 | main quests, side quests, morality choices, failures, callbacks | people, artifacts, history, economy |
| 3 | Places & Routes | 🗺 | cities, roads, ruins, dungeons, portals, planes, tactical maps | economy, factions, ecology, quests |
| 4 | Artifacts & Collections | 💎 | Netherese magic, Deck objects, Old One candidates, relics, books, paintings, comics | history, quests, economy, cosmology |
| 5 | Economy & Trade | 💰 | prices, shops, wages, treasure, taxes, tolls, trade routes, scarcity, transactions | government, professions, routes, artifacts |
| 6 | Factions, Government & Law | 🏛 | rulers, guilds, armies, law, diplomacy, territorial control, civic services | economy, people, cities, conflict |
| 7 | Culture, Faith & Arts | 🎭 | religion, philosophy, music, dance, language, food, customs, stories, education | people, history, factions, clues |
| 8 | Ecology, Creatures & Environment | 🌿 | monsters, animals, plants, climate, resources, hazards, habitats | settlements, trade, professions, travel |
| 9 | STEAM, Professions & Infrastructure | ⚙ | science, technology, engineering, arts, mathematics, tools, jobs, roads, communications | economy, puzzles, settlements, artifacts |
| 10 | History, Chronology & Memory | ⏳ | eras, dates, ruins, provenance, altered history, records, continuity | artifacts, factions, culture, Redactor |
| 11 | Cosmos, Planes & The Unknown | ✨ | stars, gods, planes, Far Realm, Old Ones, portals, observation, cosmic navigation | history, artifacts, magic, routes |

### Connection law
No major entry may remain isolated. Every important record must connect to **at least two other categories**, and major campaign discoveries should eventually touch **five or more**.

### Eleven-link campaign circuit
The default living-world circuit is:

**👥 PEOPLE**
→ receive/create **📜 QUESTS**
→ move through **🗺 PLACES**
→ discover/use **💎 ARTIFACTS**
→ alter **💰 ECONOMY**
→ pressure **🏛 FACTIONS/GOVERNMENT**
→ change **🎭 CULTURE/FAITH/ARTS**
→ affect **🌿 ECOLOGY/CREATURES**
→ require/build **⚙ STEAM/PROFESSIONS/INFRASTRUCTURE**
→ become part of **⏳ HISTORY/MEMORY**
→ reveal something about **✨ COSMOS/UNKNOWN**
→ which changes **👥 PEOPLE** again.

This is a loop, not a one-way railroad.

### Example: Blank Vault eleven-way connection
1. 👥 Saelra, Vhaera, Rook, Velis and the party dispute stewardship.
2. 📜 Return the Collection asks what to do with displaced objects.
3. 🗺 The Blank Vault occupies the threshold between Underdark routes and the Far Realm path.
4. 💎 Its collection contains Deck evidence, possible Netherese objects and Old One candidates.
5. 💰 Restitution, sale, security and preservation alter wealth and markets.
6. 🏛 Governments/guilds/factions can claim jurisdiction or custody.
7. 🎭 Paintings, songs, books and sacred/cultural objects belong to living traditions.
8. 🌿 Reopening routes can alter migration, food, monsters and underground habitats.
9. ⚙ Conservation, vault security, engineering, printing and provenance analysis solve practical problems.
10. ⏳ The Redactor's erasures create a contested historical record.
11. ✨ The catalogue coordinate opens the Far Realm reverse path.
Then the Far Realm discovery changes what the characters believe about the original Blank Vault decision.

### Cross-category ID links
Add to every major record:
`CATEGORY_PRIMARY`
`CATEGORY_LINKS[]`
`WEB_IDS[]`
`WEAVE_IDS[]`
`LIGHT_IDS[]`
`MAP_IDS[]`
`QUEST_IDS[]`
`CHAR_IDS[]`
`ITEM_IDS[]`
`ECON_IDS[]`
`FACTION_IDS[]`
`HISTORY_IDS[]`
`COSMOS_IDS[]`

### Dashboard expansion
Add:
- **DASH-FACTION** — government, guilds, law, territory and diplomacy.
- **DASH-CULTURE** — faith, languages, arts, customs, education and cultural ownership.
- **DASH-ECOLOGY** — habitats, resources, creatures, environmental changes and migration.
- **DASH-STEAM** — professions, infrastructure, experiments, inventions and repairs.
- **DASH-HISTORY** — chronology, provenance, contradictions, erased/restored memory.
- **DASH-COSMOS** — stars, planes, deities, Far Realm signals, portals and observation boundaries.

### Web/Weave/Light rule for all eleven
- **WEB** answers: What is factually connected?
- **WEAVE** answers: What changes because of choices and relationships?
- **LIGHT** answers: How strong is the evidence?
- **MAP** answers: Where is it?
- **TIME** answers: When is it?
- **LEDGER** answers: Who owns/pays/owes what?

A fully tracked campaign node therefore becomes:
**WHO + WHAT + WHERE + WHEN + WHY + COST + EVIDENCE + CONNECTION + CONSEQUENCE + NEXT PATH.**

### Rabbit-hole expansion
Each category can open the next:
Person → Quest → Place → Artifact → Economy → Government → Culture → Ecology → STEAM → History → Cosmos → Person.

This makes the eleven categories one connected campaign organism rather than eleven separate filing systems.


## 15. The Eleven Patron Paintings — Wealthy Ruler Trophy Quest (ROUGH DRAFT)

Design rule: the eleven category paintings are not lying around as ordinary loot. Each is a prestigious trophy, inheritance, commission, stolen cultural work, or protected heirloom held by a **wealthy ruler/lord** in a major estate, fortress, palace, city, domain, or planar court. Vampire lords are one model, but the eleven rulers should vary so the campaign does not become eleven copies of the same boss.

To claim a painting, the party must **face and defeat the ruler's challenge**. “Defeat” can mean combat, exposing the ruler, breaking a curse, winning a legal/political contest, completing a trial, forcing surrender, or redeeming the ruler when a legitimate path exists. The painting is only awarded/transferred when its quest condition is satisfied.

### Eleven painting/ruler concepts

| ID | Painting | Category | Wealthy ruler / domain concept | Victory theme | Painting boon |
|---|---|---|---|---|---|
| PNT-011-A | **The Joined Hands** | 👥 People & Relationships | **Countess Veyra Nocturne**, vampire aristocrat in a moonlit manor | break her system of fear, debt and enthralled loyalty | **+1 Charisma** |
| PNT-011-B | **The Unfinished Scroll** | 📜 Quests & Choices | **Prince Othmar the Oathkeeper**, immortal quest-lord in a contract palace | prove choice matters more than imposed destiny | **+1 Wisdom** |
| PNT-011-C | **The Road With No Border** | 🗺 Places & Routes | **Duke Caldran Waylock**, wealthy gate-lord controlling roads and tolls | reopen the roads / defeat his monopoly | **+1 Dexterity** |
| PNT-011-D | **The Hand Around the Relic** | 💎 Artifacts & Collections | **Lady Seraxa Gilt**, dragon-blooded collector in a treasure citadel | solve provenance claims and overcome her vault | **+1 Intelligence** |
| PNT-011-E | **The Golden Scales** | 💰 Economy & Trade | **Merchant-King Varro Coincrown**, ruler of a fortified market city | defeat manipulation of prices, debt and supply | **+1 Charisma** |
| PNT-011-F | **The Empty Throne** | 🏛 Factions, Government & Law | **Lord Magistrate Aurel Vane**, autocratic ruler of a marble court | expose/correct the law he weaponized | **+1 Wisdom** |
| PNT-011-G | **The Moonlit Song** | 🎭 Culture, Faith & Arts | **Duchess Miralune**, immortal patron who owns artists' work and identities | free the court's creative voices | **+1 Charisma** |
| PNT-011-H | **The Garden Behind the Wall** | 🌿 Ecology & Creatures | **Baron Thornwake**, ancient beast-lord ruling a walled hunting preserve | restore ecological balance and stop exploitation | **+1 Constitution** |
| PNT-011-I | **The Impossible Engine** | ⚙ STEAM, Professions & Infrastructure | **Archon Ferrix Brass**, industrial mage-lord in a mechanized fortress | outbuild/outthink the engine and protect its workers | **+1 Intelligence** |
| PNT-011-J | **The City Beneath Yesterday** | ⏳ History, Chronology & Memory | **Marquis Edraven the Remembered**, deathless historian-ruler | restore deliberately suppressed history | **+1 Intelligence** |
| PNT-011-K | **The Eye Among the Stars** | ✨ Cosmos, Planes & Unknown | **The Astral Regent**, wealthy planar sovereign in an observatory-palace | survive the final observation trial and establish boundaries | **+1 Wisdom** |

Names, exact species/stat blocks, cities/domains, chronology and official/homebrew status remain provisional until source/continuity review.

### Boon rules — provisional
Each recovered painting grants a **Painting Boon: +1 to the listed ability score** to its attuned/recognized bearer.
- Treat this as **Moonveil homebrew**, not an official D&D rule.
- Default maximum after the boon is **20** unless a later endgame rule explicitly raises it.
- One character cannot stack duplicate copies of the same painting.
- Painting ownership and boon bearer are separate fields: a community may own the art while a hero retains a supernatural blessing.
- If balance testing shows permanent ability-score stacking is too strong, preserve the narrative reward but revise the mechanical expression before CANONIZED status.

### Collection payoff
Recovering all eleven forms **SET-PNT-011 — THE ELEVEN LIGHTS**.
The eleven paintings physically arrange into a circular gallery. Their painted roads line up and reveal the hidden Eye/road-loop image from the original *Eleven Lights* concept.

Collection equation:
**11 RULERS -> 11 DOMAINS -> 11 PAINTINGS -> 11 +1 BOONS -> 11 CATEGORIES -> 1 CONNECTED MAP.**

The completed gallery does not automatically prove the Eye is Ghaunadaur or an Old One. It produces a **PRISM-LIGHT candidate clue** that must be cross-checked against Deck, Netherese, historical and Far Realm evidence.

### Required trackers for each painting
PNT-ID | ruler CHAR-ID | domain LOCATION-ID | estate SITE-MAP | quest ID | ruler wealth/economy | source status | challenge type | victory condition | painting provenance | category | +1 boon | current owner | current bearer | attunement/recognition | LIGHT IDs | WEB IDs | WEAVE IDs | later callback.

### Campaign-map placement rule
Spread the eleven ruler domains across the campaign rather than putting them in one city. Each ruler must affect surrounding economics, government, culture, ecology, infrastructure or history before the party reaches the estate. Players should hear rumors, see taxes/trade goods, meet refugees/artists/workers/agents, and find earlier clues so every ruler feels embedded in a living region rather than appearing as an isolated boss room.
