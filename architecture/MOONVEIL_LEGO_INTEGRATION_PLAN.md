# MOONVEIL LEGO INTEGRATION — Assembly Plan v1
Date: 2026-10-15
Purpose: unify Copilot, Gemini, and ChatGPT contributions into a playable, living D&D universe, without discarding existing work.

## Inspection scope and honesty
GitHub default-branch code search for pubspec.yaml, package.json, server.js, inventoryProvider and world_route_graph returned no matches. Search is default-branch only, so this is NOT proof of absence from development branches. Confirm existing tree and build commands before overwriting or adding app scaffolding.
Verified on development branch in previous work: campaign_notes/alice_three_chosen_design_checkpoint_2026-10-14.md and campaign_notes/alice_aberration_boss_hunts_and_elder_eye_ring_quests_2026-10-15.md. Earlier development commits created route, quest, living-world checkpoint and SQL architecture files. Treat unverified implementation claims as proposed until code and tests are inspected.

## LEGO inventory and interfaces
| Brick | Input | Output | Integration rule | Status |
|---|---|---|---|---|
| Campaign lore | D&D source metadata | canon ledger + quest graph | preserve date/plane/source and homebrew flags | notes exist |
| Route graph | location IDs, gates | reachable scenes | cannot travel without satisfied prerequisites | prototype data |
| Quest engine | player command + event ledger | quest state and unlocks | engine validates; narration never awards | design |
| NPC schedules | world clock + faction state | NPC location/activity | deterministic offscreen ticks | prototype design |
| Economy | route availability + supplies | price and shortages | no magical instant replenishment | design |
| Relationship graph | events + faction affiliations | trust, hostility, links | append event, derive state | design |
| D&D rules | sheet + dice seed + action | validated check/attack result | no client-authoritative critical flags | design |
| Artifact provenance | item catalog + quest completion | owned inventory | locked artifacts not equipped | SQL groundwork |
| World memory | events + snapshots | reproducible save | immutable event history | SQL groundwork |
| Flutter VTT | scene DTOs + API | clickable panels/map | 4 panels + 5 choice bar | to integrate |
| Node API | authenticated commands | event + read models | idempotent transactions | to integrate |
| WebSockets | committed event | client refresh | delivery only; no game authority | to integrate |
| Optional AI narrator | sanitized read-only state | prose/roleplay | no executable instructions | to integrate |

## Contracts (versioned)
Every request: schemaVersion='Omni-Engine V8.0', commandId, profileId, actionType, payload, expectedRevision.
Every response: accepted, reason, eventIds, newRevision, updatedScene.
Every committed event: eventId, commandId, eventType, actorId, worldTick, plane, locationId, payload, sourceStatus, createdAt.
A failed validation must not emit events or mutate any tables. Duplicate commandId must not double-apply.

## First vertical slice — The Silver Courier
Alice L1 at a homebrew Eilistraeen safehouse, hears Sable's warning, sees a map with contradictory routes.
Five choices: Lawful Good (protect refugees publicly); Neutral Good (escort medicine); Chaotic Good (misdirect patrol); Utility (study map/ledger); Action (intercept pursuers).
Engine applies a bounded reputation change, creates one quest event, updates a rumor, then advances the world clock one tick. The narrator describes the committed outcome, never chooses or changes it.
All five options must be playable and reversible only via new in-world events; story simulations remain separate from the canonical save.

## Test-first integration
1. Load all SQL migrations in a disposable SQLite database, assert WAL and foreign keys.
2. Create Alice L1 with empty legendary inventory, zero Wishes and locked future companion.
3. Validate command schema; reject malformed rolls and sector movements.
4. Execute a scene choice once, verify one immutable event and quest update.
5. Repeat same commandId; verify zero duplicate effects.
6. Reload from snapshot and replay; verify identical relationships, inventory and quest state.
7. Run world tick and ensure NPC schedules and trade rumors change without advancing player quest.
8. Confirm WebSocket broadcasts only committed events.
9. Verify offline Flutter UI can display scene and queue commands without network.
10. Keep level 21+ homebrew capabilities unavailable until earned.

## Safe merge policy
- Preserve original source and provenance (Copilot/Gemini/ChatGPT where known), license, timestamp and file path.
- Compare APIs and tests; select one authoritative state engine rather than running conflicting engines.
- Port reusable functions behind adapters. Don't blindly paste two incompatible Providers or duplicate databases.
- No direct writes to main; work on dev branch with incremental commits.
- Don't introduce AI prompt-injection automation; GitHub is code and content storage, not a game command bus.
- Do not mark sample Vorpal Blade, Ring of Three Wishes or Book of Vile Darkness as Alice-owned.

## Next concrete files to implement after inspection
backend/services/commandEngine.js; backend/routes/sceneActions.js; backend/services/worldTick.js; backend/services/websocketServer.js; backend/tests/commandEngine.test.js; flutter_client/lib/models/scene.dart; flutter_client/lib/screens/visual_command_center_screen.dart; flutter_client/lib/widgets/five_choice_panel.dart; shared/contracts/omni_v8_events.schema.json.

## Core success definition
A player taps a choice on a phone, the game validates and rolls as appropriate, the scene responds, an NPC's opinion changes, a quest unlocks, a world rumor spreads, the event is saved, and loading tomorrow restores the exact same state.
