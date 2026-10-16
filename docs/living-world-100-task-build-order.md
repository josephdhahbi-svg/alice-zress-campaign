# Moonveil Living World Engine — 100-Task Build Order

**Purpose:** Turn the current local browser prototype into a tested, data-connected, realistic-art-enabled, expandable campaign engine.
**Repository:** https://github.com/josephdhahbi-svg/alice-zress-campaign
**Current baseline:** `game/living-world.html`; local-only browser state; no verified multiplayer/server sync.
**Rules:** Mark tasks complete only with evidence. Do not claim manual browser QA without actually performing it. Keep official D&D lore, homebrew, and provisional ideas distinct. All Moonveil art must be realistic or semi-realistic fantasy, never anime/cartoon.

## Execution rules
- Execute in dependency order; fix P0 defects before feature expansion.
- Every task must leave evidence: code, data, test output, screenshot, CI run, or documented decision.
- Do not replace existing campaign data silently; use stable IDs and migration notes.
- Local browser persistence is not multiplayer persistence.

## PHASE 1 — Browser QA and stabilization


- [ ] **001** Open game/living-world.html in a real desktop browser and record the browser/version tested.
- [ ] **002** Verify the initial Alice and Hallway Wraith fallback entities render inside the stage.
- [ ] **003** Test selecting every entity from both the stage and entity registry.
- [ ] **004** Test pointer dragging with a mouse and confirm coordinates update smoothly.
- [ ] **005** Test touch dragging on a physical or emulated touch device.
- [ ] **006** Verify stage-boundary clamping at all four edges and after resizing.
- [ ] **007** Test teleporting repeatedly and confirm entities remain inside the stage.
- [ ] **008** Test pulse animation on each supported entity type.
- [ ] **009** Test vanish animation, entity removal, and selected-entity clearing.
- [ ] **010** Test both scene buttons and confirm entities persist across scene changes.
- [ ] **011** Test runtime editing of name, type, coordinates, and asset path.
- [ ] **012** Test blank-name rejection, invalid coordinates, and long asset-path handling.
- [ ] **013** Test local save, browser reload, and automatic restoration.
- [ ] **014** Test intentionally empty saved worlds and confirm they stay empty after reload.
- [ ] **015** Test JSON export, valid import, malformed JSON, incompatible version, and oversized entity arrays.

## PHASE 2 — Stable world-state data contracts


- [ ] **016** Define a versioned WorldState schema with scene ID, entity list, selection, event history, and timestamps.
- [ ] **017** Define a strict Entity schema with stable ID, entity type, canonical entity reference, transform, visibility, and asset reference.
- [ ] **018** Separate canonical entity identity from display name and runtime instance ID.
- [ ] **019** Define supported entity types and reject unknown types during import.
- [ ] **020** Validate coordinates, visibility, asset path length, IDs, and maximum entity counts.
- [ ] **021** Add unique entity-ID validation and collision-safe ID generation.
- [ ] **022** Add a schema migration path for future world-save versions.
- [ ] **023** Add a save integrity marker if useful without treating it as authentication.
- [ ] **024** Make import validation complete before replacing current state.
- [ ] **025** Ensure failed saves/imports leave the previous valid world intact.
- [ ] **026** Define event record schema with event ID, actor, action, target, timestamp, and details.
- [ ] **027** Limit and rotate local event history without deleting gameplay state.

## PHASE 3 — Connect canonical campaign data


- [ ] **028** Load entity templates from data/characters.json, data/locations.json, and future enemy/item catalogs.
- [ ] **029** Use canonical asset IDs from data/assets.json instead of duplicating image paths in JavaScript.
- [ ] **030** Validate every asset reference against the asset manifest.
- [ ] **031** Validate character references against stable character IDs.
- [ ] **032** Add a Hallway Wraith entity template with explicit provisional/homebrew status.
- [ ] **033** Add a portal entity template that links two known scene IDs.
- [ ] **034** Add an item entity template with inventory and world-placement semantics.
- [ ] **035** Connect the world scene to scene-book01-rabbit-hole-01.
- [ ] **036** Connect scene choices to world events without changing Alice's canon implicitly.
- [ ] **037** Record the three divine origin gifts as narrative origin events, not automatic rules grants.
- [ ] **038** Add a persistent clue entity for the Infinite Hallway setup/payoff thread.
- [ ] **039** Add quest/event references so an entity interaction can update the journal.

## PHASE 4 — Realistic art and asset pipeline


- [ ] **040** Preserve the MACS rule: every Moonveil image must be realistic or semi-realistic fantasy, never anime or cartoon.
- [ ] **041** Generate catalog entries 001–020 with stable IDs, unique filenames, and explicit status values.
- [ ] **042** Split the seven-asset composite sheet into individual images rather than using the sheet as production assets.
- [ ] **043** Review the Alice portrait against the approved Alice appearance and correct mismatches.
- [ ] **044** Review wraith, spell icon, item panel, hallway plate, UI frame, and sigil as separate deliverables.
- [ ] **045** Remove checkerboard pixels and inspect alpha edges at 100% and on light/dark backgrounds.
- [ ] **046** Check that transparent interiors, especially the UI frame aperture, are truly transparent.
- [ ] **047** Normalize filenames to the MACS catalog and avoid duplicate IDs or filenames.
- [ ] **048** Commit approved image binaries under a stable assets/moonveil/ directory.
- [ ] **049** Update data/assets.json with actual committed paths and truthful statuses.
- [ ] **050** Add asset dimensions, aspect ratio, transparency, source, and related entity IDs to the manifest.
- [ ] **051** Add missing-asset fallbacks and graceful load-error logging.
- [ ] **052** Create an asset contact sheet for human review, clearly marking it as a preview rather than production assets.

## PHASE 5 — Scene interaction and game mechanics


- [ ] **053** Connect the Book 1 choice UI to a shared campaign state model.
- [ ] **054** Define approved ability scores and proficiency bonuses before using character modifiers.
- [ ] **055** Keep dice animation separate from authoritative dice result calculation.
- [ ] **056** Record each roll's check ID, DC, modifier, raw roll, total, result, and source scene.
- [ ] **057** Define advantage/disadvantage behavior and critical-roll policy in a rules profile.
- [ ] **058** Apply success/failure consequences through explicit data-driven effect records.
- [ ] **059** Add an event log entry for every choice, roll, teleport, spawn, despawn, and scene transition.
- [ ] **060** Add a player journal view that filters and explains recent events.
- [ ] **061** Add inventory acquisition/use events and prevent duplicated item grants.
- [ ] **062** Add HP/resources/conditions only after a verified character-state schema exists.
- [ ] **063** Add a tactical grid mode with configurable grid size and token snapping.
- [ ] **064** Add collision/occupancy rules for grid movement and distinguish free movement from tactical movement.
- [ ] **065** Add portal travel that validates destination scene IDs and records transitions.

## PHASE 6 — Living-world simulation


- [ ] **066** Define world-state variables for safety, supplies, morale, trust, and faction influence.
- [ ] **067** Create reusable settlement records with population, leadership, services, resources, and current conditions.
- [ ] **068** Track faction relationships and record changes caused by player actions.
- [ ] **069** Add time advancement with explicit in-world timestamps separate from real-world timestamps.
- [ ] **070** Add NPC schedules or behavior rules that are deterministic and testable.
- [ ] **071** Add simple AI wandering with collision-aware bounds and a pause/stop control.
- [ ] **072** Add pathfinding on a defined grid with blocked cells and unreachable-target handling.
- [ ] **073** Add environmental scene states such as mist density, lighting, hazards, and active portals.
- [ ] **074** Connect world-state changes to future quest availability and dialogue flags.
- [ ] **075** Build a living-world debug inspector that explains why a state changed.

## PHASE 7 — Backend, multiplayer, and security


- [ ] **076** Inventory the actual repository for Flutter, Node.js/Express, SQLite, and WebSocket code before creating duplicates.
- [ ] **077** Define the authoritative owner for campaign state: local client, server, or explicit offline-first merge model.
- [ ] **078** Design REST request/response schemas for fetching and committing world state.
- [ ] **079** Add server-side validation for scene IDs, entity types, permissions, and state transitions.
- [ ] **080** Implement SQLite migrations, WAL setup, indexes, backup, and restore tests if backend creation is approved.
- [ ] **081** Ensure database updates are transactional and roll back on any failed write.
- [ ] **082** Add campaign/player authentication and authorization before enabling multiplayer writes.
- [ ] **083** Restrict CORS and WebSocket origins to approved deployments.
- [ ] **084** Broadcast validated entity movement events to authorized peers.
- [ ] **085** Broadcast dice results as auditable events and prevent clients from asserting arbitrary authoritative outcomes.
- [ ] **086** Use revision numbers or optimistic concurrency to detect conflicting edits.
- [ ] **087** Add idempotency keys and a retry queue for interrupted network requests.
- [ ] **088** Keep secrets in deployment secret stores; never commit .env secrets or private keys.

## PHASE 8 — Release and governance


- [ ] **089** Update docs/task-status.md with evidence-based completion states for all tasks in this roadmap.
- [ ] **090** Add Living World Engine instructions and known limitations to README.md.
- [ ] **091** Add CI triggers for all relevant game, data, script, and workflow paths.
- [ ] **092** Run the full validation suite after every schema, engine, asset, or scene contract change.
- [ ] **093** Add browser automation with Playwright or another approved tool when available.
- [ ] **094** Add visual regression screenshots for desktop and mobile layouts.
- [ ] **095** Track performance with large entity counts and long event histories.
- [ ] **096** Add export/import compatibility tests across schema versions.
- [ ] **097** Review every feature for accessibility, privacy, security, and data-loss risks.
- [ ] **098** Create a release checklist and changelog with links to tested commits and CI runs.
- [ ] **099** Re-audit the seven-traversal question, trilogy titles, and level model without silently resolving them.
- [ ] **100** Complete one end-to-end Book 1 scenario from scene entry through choice, roll, clue, journal, save, reload, and payoff reference.

## Definition of done

The Living World Engine is ready for wider campaign integration only when the key browser interactions work, world state round-trips through save/export/import, canonical entity and asset references validate, Book 1 choices create persistent journal events, the relevant CI workflow passes, and limitations are documented.
