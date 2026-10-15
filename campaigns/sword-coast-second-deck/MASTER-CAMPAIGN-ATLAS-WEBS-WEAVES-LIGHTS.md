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
