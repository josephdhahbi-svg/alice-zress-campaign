# In-Game Character, Story & Artifact Puzzle Trackers

Status: DESIGN LOCK / implementation specification
Purpose: the game must always know who is still on the board, what story threads are active, and what artifact puzzles have been discovered or solved.

## 1. Character Tracker — WHO IS ON THE BOARD

Every named PC/NPC/major creature gets a persistent CHAR record.

Required fields:
CHAR_ID | name | moral label | party/faction | role/profession | alive_state | play_state | current_location | map_pin | current_quest | last_seen_scene | destination | relationship_flags | carried_items | knowledge_flags | injury/condition | chronology_marker | next_possible_scene.

### Play states
- ACTIVE — physically on the current board/map and available.
- NEARBY — same site/settlement but not current encounter.
- TRAVELING — moving between tracked locations.
- PARTY — current adventuring party member.
- RESERVE — known character available for later deployment.
- CAPTURED — alive but unavailable until resolved.
- MISSING — location genuinely unknown.
- INJURED — temporarily unavailable/limited.
- DEAD — confirmed dead; never silently reappears.
- ASCENDED/TRANSFORMED — identity persists under a new state.
- OFFBOARD — alive but presently outside active campaign area.
- UNKNOWN — insufficient evidence.

Never delete an important character merely because they leave a scene. Update play_state and location.

### Board panel
The game UI should show:
**ON BOARD NOW | PARTY | NEARBY | TRAVELING | MISSING/CAPTURED | OFFBOARD | DEAD/TRANSFORMED**

Selecting a character opens:
portrait -> status -> location -> quests -> relationships -> inventory -> knowledge -> chronology -> last scene -> possible next connections.

## 2. Story Tracker — WHAT IS STILL IN PLAY

Every narrative thread gets STORY_ID.

Fields:
STORY_ID | title | trilogy | chain | status | originating_scene | current_stage | involved_CHAR_IDs | LOCATION_IDs | QUEST_IDs | ITEM_IDs | evidence | choices_made | consequences | unresolved_questions | callbacks_planted | payoff_target | next_trigger | chronology | canon/source status.

### Story states
SEED -> DISCOVERED -> ACTIVE -> BRANCHING -> DORMANT -> RETURNED -> CLIMAX -> RESOLVED.
Alternative terminal states: FAILED | ABANDONED | SUPERSEDED.
A resolved story can still create a new SEED.

The Story Tracker must visibly separate:
- Main Story
- Character Stories
- Faction Stories
- Artifact Stories
- Mystery Threads
- World-State Consequences
- Trilogy-to-Trilogy Connections

Every ending must query unresolved STORY records so planted threads are not accidentally forgotten.

## 3. Artifact Puzzle Tracker — WHAT DOES THIS OBJECT MEAN?

Every important artifact gets both an ITEM_ID and, when applicable, PUZ_ID.

Fields:
PUZ_ID | ITEM_ID | artifact_name | collection [NETH/DECK/OLD/PNT/OTHER] | puzzle_state | pieces_required | pieces_found | inscriptions/symbols | known_functions | unknown_functions | required_people | required_professions | required_locations | related_artifacts | evidence_LIGHT_IDs | false_leads | corruption/risk | activation_conditions | solution_steps | reward/unlock | next_connection | source/canon status.

### Puzzle states
UNKNOWN -> FOUND -> EXAMINED -> PARTIAL -> CONNECTED -> SOLVABLE -> SOLVED -> ACTIVATED -> CONSEQUENCE.

Artifacts are allowed to remain PARTIAL for multiple trilogies.

## 4. Three tracker synchronization law

A change in one tracker must propagate to the others.

Example:
1. Character Yara discovers an erased inscription.
2. CHARACTER tracker adds knowledge flag.
3. STORY tracker advances Redactor mystery.
4. ARTIFACT PUZZLE tracker adds inscription evidence.
5. LIGHT tracker raises/lowers confidence.
6. WEB adds a factual connection.
7. WEAVE records relationship/consequence change.
8. MAP places the evidence.
9. HISTORY records when it happened.
10. ECONOMY records ownership/payment if the artifact changed hands.

No major discovery should exist in only one tracker.

## 5. Artifact collections tracked independently

### NETH — Netherese
Track verified/candidate creator, era, enclave, magic system, Fate Engine relationship and provenance.

### DECK — Deck of Many Things
Track official-source card vs Moonveil adaptation, manifestation, draw/event, holder, consequence and Fate Gate links.

### OLD — Old Ones / Far Realm
Track observation/contact/understanding/boundary function and creator confidence. Eye imagery or Far Realm location alone is not proof of Ghaunadaur.

### PNT — Eleven Ruler Paintings
Track ruler, estate/domain, category, +1 boon, provenance, current owner, boon bearer and hidden Eleven Lights alignment.

## 6. In-game tracker screen concept

Top tabs:
[ CHARACTERS ] [ STORY ] [ ARTIFACT PUZZLES ]

Character cards display a small status badge and map-pin action.
Story cards display completion stage, active cast, location and unresolved hooks.
Artifact cards display a puzzle-ring/progress count, discovered clues, connected artifacts and locked unknowns without spoiling undiscovered answers.

Filters:
Trilogy | Quest Chain | Location | Faction | Status | Collection | On Board Only | Unresolved Only.

## 7. Save-game requirements
All tracker states persist in SQLite/offline save data. Save changes after scenes, travel, combat outcomes, quest choices, artifact discoveries, ownership changes and puzzle solutions.

Suggested tables:
character_tracker
character_movements
story_threads
story_thread_links
artifact_puzzles
artifact_puzzle_clues
artifact_connections
tracker_events

Use stable IDs; never rely on display names as database keys.

## 8. Event log
Every tracker-changing action emits TRACK_EVENT:
EVENT_ID | timestamp/sequence | event_type | source_scene | actor | target | old_state | new_state | location | related IDs.

This provides a replayable history of why the game believes a person is alive, a story is active, or a puzzle is solved.

## 9. Player-facing spoiler rule
The database can know hidden truth, but the player UI shows only discovered knowledge.
Use:
GM_TRUTH
PLAYER_KNOWLEDGE
CONFIDENCE
DISCOVERY_REQUIREMENT

This is especially important for the Redactor, Observer, Old One provenance, ruler paintings and Deck/Netherese overlap.

## 10. Connection to the Eleven Categories
Character Tracker primarily anchors PEOPLE.
Story Tracker primarily anchors QUESTS/HISTORY.
Artifact Puzzle Tracker primarily anchors ARTIFACTS/STEAM.
All three connect outward to all eleven categories through WEB, WEAVE, LIGHT, MAP, TIME and LEDGER IDs.

Core loop:
CHARACTER acts -> STORY changes -> ARTIFACT clue changes -> MAP/WORLD changes -> new CHARACTER becomes relevant -> next STORY opens.
