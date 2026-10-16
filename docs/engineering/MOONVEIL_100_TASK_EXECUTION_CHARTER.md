# Moonveil 100-Task Execution Charter

> Assignment: execute 100 tasks, grouped into 10 phases. This is a **task backlog**, not a claim that tasks are complete.

## Execution rules
- Preserve working repository and existing 200-task program; this is a focused sub-program, not a replacement.
- Work on development branch, test changes, attach file paths, commit SHA and test output for each completion.
- Mark tasks TODO, IN PROGRESS, BLOCKED, or VERIFIED DONE; never mark complete without evidence.
- Preserve Alice's established Level 1 checkpoint separately from narrated Elder Eye simulations.
- Prioritize heroic completionist play, canon chronology, color-rich UI and secure durable backend.
- Do not silently equate Mistral, Mystryl and Mystra or replace the one-Mistral/one-Netherese-per-trilogy rule.
- Avoid claiming real-time autonomous/background execution unless an actual scheduler exists.

## Phase 1: Canon & Continuity
- [ ] T001 — Audit current Alice canon, checkpoint and divergent story simulations
- [ ] T002 — Build chronology ledger with DR dates and source status
- [ ] T003 — Separate published lore, homebrew, proposals and gameplay outcomes
- [ ] T004 — Validate Alice Great Old One Warlock Acolyte origin
- [x] T005 — Record five gifts with three confirmed and two pending
- [ ] T006 — Define Mistral/Mystryl/Mystra spelling and identity decision register
- [ ] T007 — Track Ghaunadaur and Lolth roles across eras
- [x] T008 — Reconcile seven traversals and 30-book circular structure
- [ ] T009 — Define source evidence and contradiction review procedure
- [x] T010 — Produce canonical baseline checkpoint with no invented acquisitions

## Phase 2: Elder Eye Narrative
- [ ] T011 — Create complete trilogy story bible
- [ ] T012 — Outline Book I ten missions with objectives
- [ ] T013 — Outline Book II ten missions with objectives
- [ ] T014 — Outline Book III ten missions with objectives
- [ ] T015 — Write Rabbit Hole opening with three confirmed gifts
- [ ] T016 — Build Underdark settlement rescue arc
- [ ] T017 — Build Eilistraeen alliance and redemption arc
- [ ] T018 — Build Netherese investigation and guardian arc
- [ ] T019 — Design Elder Eye cult confrontation and safe seal
- [ ] T020 — Write heroic epilogue with unresolved future threats

## Phase 3: Quest Systems
- [ ] T021 — Model quests with prerequisite state machine
- [ ] T022 — Separate story beats from verified quest completions
- [ ] T023 — Add objectives and evidence-based completion checks
- [ ] T024 — Require server-side character and campaign ownership
- [ ] T025 — Support failed, blocked, active and complete statuses
- [ ] T026 — Track repeatability and cooldowns explicitly
- [ ] T027 — Define encounter and rescue outcome flags
- [ ] T028 — Implement idempotent quest completion transaction
- [ ] T029 — Log quest transitions with audit metadata
- [ ] T030 — Test bypass and duplicate completion attempts

## Phase 4: Artifacts & Crafting
- [ ] T031 — Catalog existing Mistral-Netherese pair per trilogy
- [ ] T032 — Preserve separate 111-relic ledger until reconciled
- [x] T033 — Catalog five incoming v46 candidate artifacts
- [ ] T034 — Resolve proposed artifact mapping without conflation
- [ ] T035 — Define official versus homebrew item metadata
- [ ] T036 — Define rarity, attunement and ownership
- [ ] T037 — Design recipe requirements and ingredient policy
- [ ] T038 — Apply bounded buffs with D&D rules review
- [ ] T039 — Make crafting atomic, authorized and idempotent
- [ ] T040 — Test missing components, repeats and concurrent craft

## Phase 5: Backend & Data
- [ ] T041 — Inventory current Express API and module boundaries
- [ ] T042 — Review migration conventions and database schema
- [x] T043 — Create durable quest and inventory migrations
- [ ] T044 — Enable and verify actual SQLite WAL where suitable
- [ ] T045 — Add transaction rollback and restart recovery tests
- [x] T046 — Introduce character campaign foreign-key relationships
- [ ] T047 — Persist positions with plane/world coordinate frames
- [ ] T048 — Add spatial grid or indexed proximity strategy
- [ ] T049 — Validate coordinates and radius against NaN/Infinity
- [ ] T050 — Test spatial movement, boundaries and cross-plane isolation

## Phase 6: Security & Operations
- [ ] T051 — Remove hardcoded default master key
- [ ] T052 — Remove API keys from URL query strings
- [ ] T053 — Never log secrets or authentication tokens
- [ ] T054 — Enforce authenticated entity ownership on all endpoints
- [ ] T055 — Restrict destructive telemetry actions by role
- [ ] T056 — Add body limits and input schema validation
- [ ] T057 — Add abuse limits for expensive proximity searches
- [ ] T058 — Make log rotation reliable and auditable
- [ ] T059 — Add structured errors and safe operational logging
- [ ] T060 — Run security and regression test suite

## Phase 7: Visual Game UI
- [ ] T061 — Adopt muted navy/slate/violet eye-comfort theme
- [ ] T062 — Implement BLUE hero RED villain GREEN neutral labels
- [ ] T063 — Add purple magic gold artifacts cyan exploration
- [ ] T064 — Make four cinematic panels plus decision panel
- [ ] T065 — Provide five clickable choices in fixed moral order
- [ ] T066 — Build tactical maps with grid, arrows and legend
- [ ] T067 — Add NPC portraits and faction status cards
- [ ] T068 — Add inventory, spells, quest and codex tabs
- [ ] T069 — Mark verified, proposed and unknown data clearly
- [ ] T070 — Test legibility, contrast and mobile layout

## Phase 8: Autonomous DM
- [ ] T071 — Specify Neutral Good completionist autopilot policy
- [ ] T072 — Allow user interruption and choice override
- [ ] T073 — Use actual RNG for dice and record modifiers
- [ ] T074 — Track initiative, HP, spell slots and conditions
- [ ] T075 — Enforce level appropriate encounter difficulty
- [ ] T076 — Automate loot discovery without granting unseen items
- [ ] T077 — Resolve noncombat, stealth and diplomatic encounters
- [ ] T078 — Track mercy, rescues, redemption and consequences
- [ ] T079 — Save reversible checkpoints and replay summaries
- [ ] T080 — Run one full simulated trilogy regression

## Phase 9: World Simulation
- [ ] T081 — Define regions, planes, factions and settlement records
- [ ] T082 — Model travel availability by date and location
- [ ] T083 — Add NPC schedules and persistent relationships
- [ ] T084 — Track faction influence and territory changes
- [ ] T085 — Create economy and trade baseline for settlements
- [ ] T086 — Simulate refugee movements and safe routes
- [ ] T087 — Track environmental hazards and recovery
- [ ] T088 — Connect Netherese technology to chronology constraints
- [ ] T089 — Create event pulses with deterministic replay
- [ ] T090 — Test living-world consistency across missions

## Phase 10: Release & Evidence
- [x] T091 — Build automated unit tests for quest logic
- [ ] T092 — Build API integration tests for auth and state
- [ ] T093 — Build database restart and concurrency tests
- [ ] T094 — Build artifact reward ledger invariant tests
- [ ] T095 — Build story canon contradiction checks
- [ ] T096 — Run lint, type/static checks and package audit
- [ ] T097 — Run CI on development branch and capture results
- [ ] T098 — Review accessibility and image licensing boundaries
- [ ] T099 — Publish release notes with known limitations
- [ ] T100 — Close only evidence-backed tasks and hand off remaining work

## Execution evidence — Batch 1 (2026-10-16)
- **T033 VERIFIED DONE**: five v46 candidate artifacts and proposed fusion documented in `docs/engineering/INCOMING_V46_QUEST_WORKBENCH_SPATIAL_REVIEW.md` (commit `164dc07022e5ffe2abd6598111fc0e4123c4a802`). Candidate-only; not earned items.
- **T049 IN PROGRESS**: `backend/quest-core.js` validates finite numeric 3D coordinates and radius <=1000, but API integration remains outstanding (commit `7311e4983f42a5d0b3f1b29dc65c561bce851350`).
- **T023/T030/T037/T040/T091 IN PROGRESS**: pure validation and tests exist in `backend/quest-core.js` and `backend/quest-core.test.js` (commit `c8928f3e8da03cef14153f9febdea200a77677e4`). Local `node --test /mnt/data/moonveil_batch/quest-core.test.js`: 4 passed, 0 failed. No persistent transaction or server-side objective authority yet.
- **Blockers**: ownership and durable DB transactions, actual API integration, concurrency tests, full CI validation, artifact canon reconciliation.

## Completion evidence template
`T### | status | changed files | commit SHA | tests and results | outstanding risks`

## 2026-10-16 canon deliverable verification
T005, T008 and T010: baseline written and committed in docs/campaign/ALICE_CANON_BASELINE_AND_CONTINUITY.md at 36dd131770eca1fd90edf67fc750d1c57a09aa94. These are documentary completions, not gameplay progression or automated test results. The full historical source audit remains open.

## 2026-10-16 verified CI evidence
- T043 and T046 VERIFIED DONE for the scoped durable v3 schema and character-to-campaign foreign-key relationships in `backend/migrations.js` (commit `628aabe21a7df09e16d5b227d484d803fef20f8d`). Both GitHub Actions workflows passed at commit `f38aed444a6bf327ec41edd292f0bd9becf5ccc9`: Validate campaign records run `38919073074`; Omniversal verification run `38919073075` (includes `npm test`). Scope excludes secure API reward implementation.
- T091 VERIFIED DONE: `backend/quest-core.test.js` is included in `npm test`, which passed in Omniversal verification run `38919073075`. Scope is existing quest-core unit coverage, not complete API integration.
- Fixed migration count regression in `backend/backup-restore.integration.test.js` at commit `f38aed444a6bf327ec41edd292f0bd9becf5ccc9`.
- Added explicit CI step for canon/quest/migration tests in `.github/workflows/validate.yml` at commit `8abb3b6216a63efde9981c0aa89379dd946566ec`; its latest run was pending when this entry was written.
- Evidence-backed checklist count now 7/100: T005, T008, T010, T033, T043, T046, T091 = **7/100**. This count supersedes earlier 5/100 reports; T091 was not previously checked in the checklist despite earlier reported success.
