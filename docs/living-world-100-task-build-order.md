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
- [ ] **016** Test clear-world confirmation, cancellation, and subsequent save.
- [ ] **017** Check keyboard selection, visible focus, ARIA labels, and screen-reader status announcements.
- [ ] **018** Check narrow mobile widths, reduced-motion preference, contrast, and text overflow.
- [ ] **019** Fix defects found during manual QA and record reproducible steps.
- [ ] **020** Run all existing CI checks after QA fixes and document exact run/commit evidence.

## PHASE 2 — Stable world-state data contracts

- [ ] **021** Define a versioned WorldState schema with scene ID, entity list, selection, event history, and timestamps.
- [ ] **022** Define a strict Entity schema with stable ID, entity type, canonical entity reference, transform, visibility, and asset reference.
- [ ] **023** Separate canonical entity identity from display name and runtime instance ID.
- [ ] **024** Define supported entity types and reject unknown types during import.
- [ ] **025** Validate coordinates, visibility, asset path length, IDs, and maximum entity counts.
- [ ] **026** Add unique entity-ID validation and collision-safe ID generation.
- [ ] **027** Add a schema migration path for future world-save versions.
- [ ] **028** Add a save integrity marker if useful without treating it as authentication.
- [ ] **029** Make import validation complete before replacing current state.
- [ ] **030** Ensure failed saves/imports leave the previous valid world intact.
- [ ] **031** Define event record schema with event ID, actor, action, target, timestamp, and details.
- [ ] **032** Limit and rotate local event history without deleting gameplay state.
- [ ] **033** Define scene IDs and metadata in a single catalog rather than hard-coded duplicated values.
- [ ] **034** Define a consistent coordinate system and document responsive-stage behavior.
- [ ] **035** Add a fixture set covering valid, empty, malformed, legacy, and boundary world states.

## PHASE 3 — Connect canonical campaign data

- [ ] **036** Load entity templates from data/characters.json, data/locations.json, and future enemy/item catalogs.
- [ ] **037** Use canonical asset IDs from data/assets.json instead of duplicating image paths in JavaScript.
- [ ] **038** Validate every asset reference against the asset manifest.
- [ ] **039** Validate character references against stable character IDs.
- [ ] **040** Add a Hallway Wraith entity template with explicit provisional/homebrew status.
- [ ] **041** Add a portal entity template that links two known scene IDs.
- [ ] **042** Add an item entity template with inventory and world-placement semantics.
- [ ] **043** Connect the world scene to scene-book01-rabbit-hole-01.
- [ ] **044** Connect scene choices to world events without changing Alice's canon implicitly.
- [ ] **045** Record the three divine origin gifts as narrative origin events, not automatic rules grants.
- [ ] **046** Add a persistent clue entity for the Infinite Hallway setup/payoff thread.
- [ ] **047** Add quest/event references so an entity interaction can update the journal.
- [ ] **048** Define spawn/despawn lifecycle and whether despawned entities remain in event history.
- [ ] **049** Add an entity inspector showing canonical ID, instance ID, source, and continuity status.
- [ ] **050** Add filters for character, NPC, enemy, item, portal, and scenery.

## PHASE 4 — Realistic art and asset pipeline

- [ ] **051** Preserve the MACS rule: every Moonveil image must be realistic or semi-realistic fantasy, never anime or cartoon.
- [ ] **052** Generate catalog entries 001–020 with stable IDs, unique filenames, and explicit status values.
- [ ] **053** Split the seven-asset composite sheet into individual images rather than using the sheet as production assets.
- [ ] **054** Review the Alice portrait against the approved Alice appearance and correct mismatches.
- [ ] **055** Review wraith, spell icon, item panel, hallway plate, UI frame, and sigil as separate deliverables.
- [ ] **056** Remove checkerboard pixels and inspect alpha edges at 100% and on light/dark backgrounds.
- [ ] **057** Check that transparent interiors, especially the UI frame aperture, are truly transparent.
- [ ] **058** Normalize filenames to the MACS catalog and avoid duplicate IDs or filenames.
- [ ] **059** Commit approved image binaries under a stable assets/moonveil/ directory.
- [ ] **060** Update data/assets.json with actual committed paths and truthful statuses.
- [ ] **061** Add asset dimensions, aspect ratio, transparency, source, and related entity IDs to the manifest.
- [ ] **062** Add missing-asset fallbacks and graceful load-error logging.
- [ ] **063** Create an asset contact sheet for human review, clearly marking it as a preview rather than production assets.
- [ ] **064** Integrate Alice portrait and hallway plate into Book 1 without blocking the five-choice interface.
- [ ] **065** Add an asset validation test that checks paths, file existence, dimensions, and alpha channel.

## PHASE 5 — Scene interaction and game mechanics

- [ ] **066** Connect the Book 1 choice UI to a shared campaign state model.
- [ ] **067** Define approved ability scores and proficiency bonuses before using character modifiers.
- [ ] **068** Keep dice animation separate from authoritative dice result calculation.
- [ ] **069** Record each roll's check ID, DC, modifier, raw roll, total, result, and source scene.
- [ ] **070** Define advantage/disadvantage behavior and critical-roll policy in a rules profile.
- [ ] **071** Apply success/failure consequences through explicit data-driven effect records.
- [ ] **072** Add an event log entry for every choice, roll, teleport, spawn, despawn, and scene transition.
- [ ] **073** Add a player journal view that filters and explains recent events.
- [ ] **074** Add inventory acquisition/use events and prevent duplicated item grants.
- [ ] **075** Add HP/resources/conditions only after a verified character-state schema exists.
- [ ] **076** Add a tactical grid mode with configurable grid size and token snapping.
- [ ] **077** Add collision/occupancy rules for grid movement and distinguish free movement from tactical movement.
- [ ] **078** Add portal travel that validates destination scene IDs and records transitions.
- [ ] **079** Add turn order and combat only after initiative, action economy, and rules source are specified.
- [ ] **080** Add ritual/spell effects as data-driven actions with prerequisites, duration, and logged outcomes.

## PHASE 6 — Living-world simulation

- [ ] **081** Define world-state variables for safety, supplies, morale, trust, and faction influence.
- [ ] **082** Create reusable settlement records with population, leadership, services, resources, and current conditions.
- [ ] **083** Track faction relationships and record changes caused by player actions.
- [ ] **084** Add time advancement with explicit in-world timestamps separate from real-world timestamps.
- [ ] **085** Add NPC schedules or behavior rules that are deterministic and testable.
- [ ] **086** Add simple AI wandering with collision-aware bounds and a pause/stop control.
- [ ] **087** Add pathfinding on a defined grid with blocked cells and unreachable-target handling.
- [ ] **088** Add environmental scene states such as mist density, lighting, hazards, and active portals.
- [ ] **089** Connect world-state changes to future quest availability and dialogue flags.
- [ ] **090** Build a living-world debug inspector that explains why a state changed.

## PHASE 7 — Backend, multiplayer, and security

- [ ] **091** Inventory the actual repository for Flutter, Node.js/Express, SQLite, and WebSocket code before creating duplicates.
- [ ] **092** Define the authoritative owner for campaign state: local client, server, or explicit offline-first merge model.
- [ ] **093** Design REST request/response schemas for fetching and committing world state.
- [ ] **094** Add server-side validation for scene IDs, entity types, permissions, and state transitions.
- [ ] **095** Implement SQLite migrations, WAL setup, indexes, backup, and restore tests if backend creation is approved.
- [ ] **096** Ensure database updates are transactional and roll back on any failed write.
- [ ] **097** Add campaign/player authentication and authorization before enabling multiplayer writes.
- [ ] **098** Restrict CORS and WebSocket origins to approved deployments.
- [ ] **099** Broadcast validated entity movement events to authorized peers.
- [ ] **100** Broadcast dice results as auditable events and prevent clients from asserting arbitrary authoritative outcomes.
- [ ] **101** Use revision numbers or optimistic concurrency to detect conflicting edits.
- [ ] **102** Add idempotency keys and a retry queue for interrupted network requests.
- [ ] **103** Keep secrets in deployment secret stores; never commit .env secrets or private keys.
- [ ] **104** Add integration tests for concurrent edits, disconnect/reconnect, unauthorized writes, and stale revisions.
- [ ] **105** Document deployment, monitoring, database backup, rollback, and incident recovery.

## PHASE 8 — Release and governance

- [ ] **106** Update docs/task-status.md with evidence-based completion states for all tasks in this roadmap.
- [ ] **107** Add Living World Engine instructions and known limitations to README.md.
- [ ] **108** Add CI triggers for all relevant game, data, script, and workflow paths.
- [ ] **109** Run the full validation suite after every schema, engine, asset, or scene contract change.
- [ ] **110** Add browser automation with Playwright or another approved tool when available.
- [ ] **111** Add visual regression screenshots for desktop and mobile layouts.
- [ ] **112** Track performance with large entity counts and long event histories.
- [ ] **113** Add export/import compatibility tests across schema versions.
- [ ] **114** Review every feature for accessibility, privacy, security, and data-loss risks.
- [ ] **115** Create a release checklist and changelog with links to tested commits and CI runs.
- [ ] **116** Re-audit the seven-traversal question, trilogy titles, and level model without silently resolving them.
- [ ] **117** Complete one end-to-end Book 1 scenario from scene entry through choice, roll, clue, journal, save, reload, and payoff reference.
- [ ] **118** Plan the next three-book batch only after the Book 1 vertical slice passes acceptance criteria.
- [ ] **119** Produce a final milestone report listing verified work, unverified claims, open risks, and next priorities.
- [ ] **120** Generate a fresh self-contained copy-and-paste handoff for the next ChatGPT session.

## Definition of done

The Living World Engine is ready for wider campaign integration only when the key browser interactions work, world state round-trips through save/export/import, canonical entity and asset references validate, Book 1 choices create persistent journal events, the relevant CI workflow passes, and limitations are documented.
