# Moonveil Universe — Master Development Board
**Status:** Working architecture / living planning document  
**Updated:** 2026-10-15  
**Scope:** Alice Z'ress campaign, 30-book Moonveil architecture, lore database, and interactive game

## Mission
Build a coherent, playable, expandable multiverse in which story, rules, chronology, source records, and software state remain aligned. Capture ideas first; promote them to canon only after continuity and implementation checks.

## Working principles
1. **Preserve before rewriting.** Never silently delete prior material. Record conflicts and propose a resolution.
2. **Separate status from quality.** An exciting idea can still be provisional, unverified, or mechanically untested.
3. **Trace every consequential record.** Stable ID, source/canon status, chronology, geography/plane, dependencies, prerequisites, and lifecycle.
4. **Close every loop.** Early-book seeds need a payoff or an explicit reason to remain unresolved.
5. **Make the world playable.** Important lore should lead to choices, exploration, social play, tactical encounters, consequences, or meaningful rewards.
6. **Protect source material.** Record citations and paraphrased facts; do not reproduce copyrighted sourcebooks wholesale.

## Status labels
- **LOCKED CANON** — explicitly approved; change only through a recorded decision.
- **WORKING CANON** — current preferred version, still subject to audit.
- **PROPOSED** — promising idea awaiting review.
- **SOURCE CHECK REQUIRED** — needs primary-source or chronology verification.
- **RULES CHECK REQUIRED** — needs edition/mechanics validation.
- **IMPLEMENTATION TODO** — accepted concept not yet built or tested.
- **CONFLICT** — clashes with another record or timeline; do not silently choose.
- **DEPRECATED** — superseded, retained for history and migration.

## Project lanes
### A. Story and book architecture
Maintain the 10-trilogy / 30-book index, each book's dramatic question, opening state, key choices, turning point, climax, outcome, and handoff to the next book.

### B. Character and faction bible
Track identity, motivations, relationships, alignment/moral role, abilities, status at the relevant date, location, travel feasibility, and earned changes. For Alice, maintain the Great Old One Warlock foundation and distinguish her custom origin gifts from ordinary character-creation rules.

### C. Chronology and cosmology
Use one canonical event ledger with in-world date/calendar, era, plane/location, event order, participants, source, prerequisites, and consequences. Explicitly model time travel, planar travel, reincarnation, resurrection, and loop effects.

### D. Artifacts, spells, rituals, and progression
Track provenance, owners, powers, charges, attunement, prerequisites, acquisition/transfer/loss, duration/cooldown, source status, and book/level availability. Keep endgame-only rewards locked until their prerequisites are met.

### E. Encounters and player experience
Use clear encounter objectives, stakes, tactical terrain, NPC intent, social checks only when meaningful, fail-forward options, consequences, treasure, and accessibility/readability checks. Preserve the campaign's five-choice interaction convention where appropriate.

### F. Living-world simulation
Track government, laws, culture, economy, trade, ecology, infrastructure, faith, faction relationships, rumors, daily life, and how locations change after player actions.

### G. Software and data
Keep JSON as validated exchange/configuration data; SQLite as structured persistence when implemented; Flutter as the interactive client; Node.js/webhooks and GitHub Actions only where actual integration is implemented. Document the source of truth for each field and avoid duplicate competing authorities.

## 30-book planning index
1. The Pit of Ghaunadaur — The Fall
2. The Weeping Obsidian Archives
3. The Crown Wars & Elven Splendor
4. The Dawn War Primordial
5. The Subterranean Tectonic Fault
6. The Threshold of the Surface
7. The Fall of Netheril
8. The Greyhawk Convergence
9. The Dragonlance Cataclysm
10. The Eberron Prophecy Engine
11. The Early Mists of Barovia
12. The Planescape Confluence
13. The Cracking of Mount Celestia
14. The Abyssal Sinkholes
15. The Iron Trenches of Baator
16. The Spellplague Tides
17. The Second Sundering
18. The Far Realm Incursion
19. The Spelljammer Void
20. The Dweomer Singularity
21. The Archfey Courts
22. The Shadowfell Entropy
23. Re-entering the Infinite Hallway
24. The Sighting of Lord Car
25. The Expanding Mists
26. The Siege of Vallaki
27. The God-War at the Gates
28. The U01 Ontological Awakening
29. The Heart of Castle Ravenloft
30. Closing the Loop & The Cosmic Showdown

## First-pass brainstorm: highest-leverage ideas
1. **Loop ledger:** for every seed, record introduction book, apparent meaning, hidden meaning, payoff book, payoff mechanism, and any paradox risk.
2. **U01 packet ledger:** packet ID, origin, condition earned, holder, uses, cost, consequence, and final reconciliation.
3. **Weeping Obsidian Lens lifecycle:** discovery, limitations, misleading interpretations, historical appearances, damage/repair, and endgame function.
4. **Guvner Universal Axioms ledger:** define which laws it can observe, interpret, challenge, or rewrite; add limits, jurisdiction, appeal, and cost so it does not solve every problem automatically.
5. **Lord Car identity gate:** keep identity and cosmological role unresolved until source and continuity evidence support a decision.
6. **Ravenloft convergence map:** define how settings/factions enter the Mists, what each wants, why they cannot simply leave, and what keeps the siege playable.
7. **Living-city state:** track population, food, water, shelter, safety, morale, commerce, faction trust, and rebuilding consequences.
8. **Choice consequence matrix:** map the five choices to immediate outcome, delayed consequence, relationship changes, resources, and loop effects; avoid reducing choices to simplistic alignment stereotypes.
9. **Source confidence:** every canon-sensitive claim gets a source pointer, confidence, date checked, and unresolved question.
10. **Automated validation:** check unique IDs, required metadata, valid references, impossible dates, missing dependencies, unearned items, dangling setup/payoff links, and schema regressions.

## Initial priority order
- **P0 — Reconcile canon conflicts:** compare this 30-book outline against existing campaign roadmap, seven-traversal structure, foundational Elder Eye trilogy names, and current Alice origin rules. Preserve both versions until an explicit resolution is recorded.
- **P1 — Inventory existing project files:** identify current schema, data collections, validator coverage, prototype capabilities, and documentation overlaps.
- **P2 — Establish the canonical record schema:** agree on IDs, metadata, references, source status, and migration policy before bulk data entry.
- **P3 — Build Book 1 as a vertical slice:** playable opening, three origin gifts, first meaningful choices, inventory/state updates, chronology metadata, and one validated loop seed.
- **P4 — Test one end-to-end loop:** follow a Book 1 seed to its planned payoff in the endgame and test that changing one record surfaces affected dependencies.
- **P5 — Expand in batches:** only after the vertical slice and validation rules work reliably.

## Canon conflict register (do not silently resolve)
- **Traversal model:** this handoff describes one 30-book journey that closes into the Pit; the repository README currently mentions seven circular traversals. Decide whether the seven traversals are retained as an overarching structure, reframed as an older draft, or removed after review.
- **Foundational trilogy titles:** this handoff uses The Pit of Ghaunadaur / Weeping Obsidian Archives / Crown Wars & Elven Splendor; repository documentation also names That Which Lurks / The Labyrinth of the Elder Eye / The Return of the Avatar of Ghaunadaur. Determine whether these are subtitles, alternate editions, or conflicting title sets.
- **Level range:** the handoff says Levels 1–30. Verify whether this is narrative book numbering, character level, an epic/homebrew progression, or all three; do not imply standard D&D progression supports character levels 21–30 without a documented homebrew ruleset.
- **Cosmology and source chronology:** the book sequence crosses different settings and eras. Each transition needs an explicit travel/time mechanism and a dated continuity check.
- **Technical stack:** SQLite WAL, Flutter, MultiProvider, Node.js webhooks, and GitHub Actions are the target architecture in the handoff; implementation status must be checked against repository code before claiming these are operational.

## Definition of done for a major change
- Idea has a stable ID and status.
- Source/canon and rules claims are checked or clearly marked pending.
- Chronology, geography, dependencies, and consequences are recorded.
- Affected books, characters, artifacts, and software modules are listed.
- Relevant schema/tests/validators pass, or failures are documented.
- The change has a rollback path and does not erase earlier versions.
- Any new setup has a payoff, or is explicitly marked as intentionally open.

## Immediate next actions
1. Inventory current docs, data schemas, sample records, validator, and playable prototype.
2. Produce a canon-conflict decision log without overwriting either version.
3. Audit required metadata against the actual JSON schema and validator.
4. Choose Book 1 as the first end-to-end playable slice unless a blocker is found.
5. Update this board after each meaningful milestone, not after every raw brainstorm.


## VTT technical blueprint integration
See `docs/vtt-technical-blueprint-audit.md` for the proposed Flutter → API service → Node.js/Express → SQLite persistence flow, repository evidence, code-level risks, recommended gameplay ledgers, and vertical-slice acceptance tests.

Current technical decision: treat Flutter + Node.js + SQLite WAL as the target architecture until source files and tests confirm the implementation. The browser prototype is an existing offline prototype, not proof of backend synchronization. Resolve the book-table INSERT constraint mismatch, server-side validation, transaction error handling, sync queue/concurrency, and packet ledger before trusting remote persistence.


## Administration and Lego build system
- `docs/administration-build-operations.md` defines the capture → classify → connect → build → test → integrate → review → grow workflow, roles, priorities, and done criteria.
- `data/books.json` is the initial structured 30-book catalog. All entries remain `pending_review`; the file does not certify historical dates or source canon.
- `data/development_components.json` is the reusable component registry for the book catalog, canon ledger, chronology, loop ledger, U01 packets, Lens, Guvner axioms, choices, dice, sync, living world, and quality gates.
- `docs/vtt-technical-blueprint-audit.md` records target VTT architecture and code risks.

## Newly created component records
The first batch creates structured "Lego" records rather than only brainstorming prose. Next steps are to extend the validator for uniqueness/references, run it against every data JSON file, add acceptance criteria and tests to each component, and connect the five-choice Book 1 slice to stable book and scene IDs.


## Connected story and administration records
- `data/setup_payoffs.json` now records six proposed cross-book setup/payoff links: the Lens, U01 packets, Guvner Axioms, Infinite Hallway, expanding Mists, and Lord Car.
- `data/decisions.json` records four unresolved architecture decisions: traversal structure, foundational titles, level model, and software-stack implementation status.
- `docs/project-inventory.md` documents inspected repository assets and gaps.
- `docs/task-status.md` tracks the 100-task work order using evidence-based status labels.
- `scripts/validate.py` now has dedicated profiles for lore records, relationship edges, story phases, setup/payoff records, decisions, and the component registry. It also checks that setup/payoff records reference known book IDs.
- A structural validation pass against the current JSON returned 12 data files, 63 records, and zero issues in the checks mirrored during this review. This was not a local execution of the Python validator or a verified GitHub Actions run.


## Book 1 vertical slice — current build
- `data/scenes.json`: structured opening scene `scene-book01-rabbit-hole-01`, with five choices in the required order, proposed checks, outcomes, and state-effect rules.
- `data/locations.json`: includes a pending-review homebrew record for the Pit of Ghaunadaur.
- `game/book1.html`: standalone local browser prototype for selecting an option, rolling a d20, viewing outcomes, and exporting/importing the scene event log.
- `scripts/validate.py`: now includes scene schema checks plus references from scenes to books, locations, and setup/payoff IDs. Setup/payoff records are checked against the book catalog.

**Validation evidence:** a structural review mirrored against the current repository JSON checked 13 data files and 65 records, including scene choice ordering and cross-file references, with zero issues. The Python validator has not yet been executed in a local checkout, browser testing is still pending, and GitHub Actions status was not available from the inspected commit status response.


## Automated Book 1 checks added
- `scripts/test_book1.py` checks the 30-book catalog, Book 1 scene ID, five-choice order, choice outcomes/check definitions, three origin gifts, book/location/payoff references, and browser prototype controls.
- `.github/workflows/validate.yml` now runs this test after the validator and deterministic encounter simulation.
- GitHub Actions run `38836895815` reported success for all three test steps: metadata validation, encounter simulation, and Book 1 regression checks. The overall GitHub Actions workflow subsequently completed successfully.
- Manual browser testing, mobile/keyboard QA, and save/export/import verification remain open.


## Character and art asset wiring
- `data/scenes.json` now links the opening scene to character ID `alice-zress`.
- `scripts/validate.py` now requires scene `character_id` references to resolve to `data/characters.json` and validates the art manifest structure and unique asset IDs.
- `data/assets.json` registers seven generated art concepts with planned repository paths and explicit local-only status.
- Art source files currently exist in the generated working-session asset folder, not yet in the GitHub repository. Their checkerboard background is baked in; background removal is required before using them as transparent tokens/overlays.
- `scripts/test_book1.py` now checks Alice linkage, seven unique asset records, and honest asset availability/transparency status.
- Manual browser QA and actual image-file commit/integration remain outstanding.


## 2026-10-16: asset registry and CI repair
- Created `data/assets.json` for the seven generated art concepts. This is a manifest, not proof the image binaries are committed.
- Added `character_id: alice-zress` to the Book 1 opening scene and cross-reference validation.
- Added asset-manifest checks to the validator and regression test.
- CI initially found an `UnboundLocalError` after the validator began counting asset records. Fixed the scope declaration.
- Verified GitHub Actions run #70 completed successfully: https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38837871070
- Remaining: commit actual image files, remove checkerboard backgrounds, manually test the browser prototype, and connect persistent scene outcomes to character/journal state.


## Transparent art export
- Generated cleaned PNG versions of all seven assets and packaged them as `moonveil_art_assets_transparent.zip` in the current session.
- The manifest records cleaned-but-not-committed status honestly; binary files are not yet present in GitHub.
- The UI frame center aperture was cleaned separately to remove checkerboard pixels inside the frame.
- Visual review of a contact sheet indicates the background is largely removed, but edge halos and light-colored subject details still need manual review.
- CI run #72 passed the validator, simulation, and Book 1 regression steps after the manifest/test status update: https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38838143586


## Living World Engine v1
- Added `game/living-world.html`: standalone browser sandbox with draggable/pointer-operated entities, selection, teleport, pulse animation, spawn, vanish/remove, scene switching, editable name/type/coordinates/asset path, entity registry, local save/load, JSON export/import, and clear confirmation.
- Entity asset paths now match the canonical filenames planned in `data/assets.json` for Alice, Wraith, and Infinite Hallway; if the PNG binaries are not present, fallback tokens render.
- Save state uses a versioned localStorage key and automatically restores compatible saves at startup, including intentionally empty saved worlds.
- Added `scripts/test_living_world.py` and CI execution; run #74 passed all checks on commit `213dd06098573ebad0ba20ce9779f87a81568dc1`.
- Follow-up asset-path alignment commit `bc254b323ebe9c68ce2512d13667ea84058a3406` has a new validation run pending at last check.
- Limitation: this is a local browser prototype, not a multiplayer/server-synchronized engine; actual art binaries are not committed yet.


## Living World Engine — 100-task work order
- Added `docs/living-world-100-task-build-order.md`, containing exactly 100 numbered tasks across eight phases: browser QA; world-state contracts; canonical campaign data; realistic art pipeline; scene mechanics; living-world simulation; backend/multiplayer/security; release/governance.
- Treat it as the detailed execution checklist; the master board and task-status tracker remain the high-level summary.
- Start at Task 001. Mark tasks complete only with actual implementation/test evidence; browser QA is not complete until performed in a real browser.


## Full-stack robotics/FSM briefing — verification audit (2026-10-15)

The newly supplied Node/Express, Flutter, SQLite WAL, WebSocket, Docker, Nginx, and CI/CD package is a **proposed architecture**, not a verified deployed stack.

Repository root inspection found no `server.js`, `client/`, `Dockerfile.backend`, `Dockerfile.frontend`, or `docker-compose.yml`. Workflow directory currently contains `analytics.yml` and `validate.yml`, not `flutter_ci.yml`.

Code-review blockers in supplied snippets:
- `server.js` references undefined `app` and `db`; the FSM controller module is not shown.
- Raw `ws` and Socket.IO routing are conflated; standardize on one transport and path.
- Flutter manager sets connected=true before confirming connection, and lacks full stream subscription disposal/reconnect guards.
- Control commands need authorization, input validation, rate limits, state-transition guards, and telemetry event IDs.
- Docker runtime image must include controller, migrations, config, and other required source files.
- CI example does not implement the claimed container publish, backup, metrics, and webhook workflows.
- Never place real secrets in documentation or source.

Suggested next LEGO batch: `backend/` containing a deterministic pure FSM, allowed-transition table, validated command envelope, tests, and documented integration contract; keep UNIT-VANGUARD-09 provisional/homebrew until canon review. Preserve the existing `game/` prototype and do not claim multiplayer functionality until tested.
