# Elder Eye: 100-task autonomous development backlog

Status: PLANNED unless verified in code and tests. Session 002 introduced partial implementations; no new tasks are marked complete without executed tests. Do not confuse planning with completion.

## Operating principles
Fun first; canon protection; photorealistic visuals; five choices; never invent successful sync or test results.

## Workstreams

### Governance & canon
- [ ] EE-T001 Establish canonical source hierarchy
- [ ] EE-T002 Define canon/homebrew statuses
- [ ] EE-T003 Register 30-book chronology
- [ ] EE-T004 Crosswalk Roads thematic collection
- [ ] EE-T005 Track historical DR dates
- [ ] EE-T006 Track plane and geography metadata
- [ ] EE-T007 Create contradiction audit
- [ ] EE-T008 Define immutable asset IDs
- [ ] EE-T009 Define decision approval rules
- [ ] EE-T010 Publish change log

### Story & pacing
- [ ] EE-T011 Outline Book 1
- [ ] EE-T012 Outline Book 2
- [ ] EE-T013 Outline Book 3
- [ ] EE-T014 Outline Books 4-10
- [ ] EE-T015 Outline Books 11-20
- [ ] EE-T016 Outline Books 21-30
- [ ] EE-T017 Design 7 traversal loop
- [ ] EE-T018 Create session pacing template
- [ ] EE-T019 Design cliffhangers
- [ ] EE-T020 Build narrative quality rubric

### Alice & party
- [ ] EE-T021 Verify Alice starting stats
- [ ] EE-T022 Record three divine gifts
- [ ] EE-T023 Build spell resource tracker
- [ ] EE-T024 Build inventory ledger
- [ ] EE-T025 Build leveling rules
- [ ] EE-T026 Track companions
- [ ] EE-T027 Define relationship system
- [ ] EE-T028 Create redemption arcs
- [ ] EE-T029 Track moral choice consequences
- [ ] EE-T030 Create character sheet UI

### World simulation
- [ ] EE-T031 Define faction registry
- [ ] EE-T032 Define territory map
- [ ] EE-T033 Build faction pulse
- [ ] EE-T034 Create world clock
- [ ] EE-T035 Build travel engine
- [ ] EE-T036 Design economy and trade
- [ ] EE-T037 Define culture records
- [ ] EE-T038 Create NPC schedules
- [ ] EE-T039 Track environmental changes
- [ ] EE-T040 Design reputation system

### Quests & encounters
- [ ] EE-T041 Normalize quest objectives
- [ ] EE-T042 Import 10 Arcana adventures
- [ ] EE-T043 Import 10 Nature adventures
- [ ] EE-T044 Create boss phase engine
- [ ] EE-T045 Create encounter builder
- [ ] EE-T046 Implement branching objectives
- [ ] EE-T047 Build rescue mechanics
- [ ] EE-T048 Implement reward prerequisites
- [ ] EE-T049 Build quest journal
- [ ] EE-T050 Test quest lifecycle

### Combat & rules
- [ ] EE-T051 Implement dice roller
- [ ] EE-T052 Implement initiative tracker
- [ ] EE-T053 Implement action economy
- [ ] EE-T054 Implement spell resolution
- [ ] EE-T055 Implement conditions
- [ ] EE-T056 Implement enemy AI
- [ ] EE-T057 Implement rest and recovery
- [ ] EE-T058 Implement horror stress rules
- [ ] EE-T059 Build tactical grid movement
- [ ] EE-T060 Test combat scenarios

### Visual codex & UI
- [ ] EE-T061 Audit asset registry
- [ ] EE-T062 Link EE-B2-001 source art
- [ ] EE-T063 Create photorealistic style guide
- [ ] EE-T064 Create scene-to-asset mapping
- [ ] EE-T065 Implement four-panel story UI
- [ ] EE-T066 Implement five-choice decision UI
- [ ] EE-T067 Build tactical map display
- [ ] EE-T068 Create character portrait registry
- [ ] EE-T069 Build responsive HUD
- [ ] EE-T070 Verify image continuity

### Backend & persistence
- [ ] EE-T071 Inspect existing server
- [ ] EE-T072 Audit dependencies
- [ ] EE-T073 Integrate SQLite migrations
- [ ] EE-T074 Implement event sourcing
- [ ] EE-T075 Implement state snapshots
- [ ] EE-T076 Implement inventory transactions
- [ ] EE-T077 Implement VTT API endpoints
- [ ] EE-T078 Add schema validation
- [ ] EE-T079 Implement backup/restore
- [ ] EE-T080 Add migration regression tests

### Testing & quality
- [ ] EE-T081 Add unit test runner
- [ ] EE-T082 Add canon validation tests
- [ ] EE-T083 Add asset ID collision tests
- [ ] EE-T084 Add save/load tests
- [ ] EE-T085 Add choice consequence tests
- [ ] EE-T086 Add NPC chronology tests
- [ ] EE-T087 Add accessibility checks
- [ ] EE-T088 Add performance checks
- [ ] EE-T089 Run end-to-end session test
- [ ] EE-T090 Conduct fun playtest review

### Release & operations
- [ ] EE-T091 Document setup steps
- [ ] EE-T092 Create administrator dashboard
- [ ] EE-T093 Define versioning policy
- [ ] EE-T094 Create release checklist
- [ ] EE-T095 Prepare dev environment
- [ ] EE-T096 Add issue triage workflow
- [ ] EE-T097 Create session recap exporter
- [ ] EE-T098 Create copy-paste handoff exporter
- [ ] EE-T099 Review deployment safety
- [ ] EE-T100 Release tested first playable build

## Delivery protocol
1. Inspect existing code before modifications.
2. Implement smallest safe vertical slice on feature branch.
3. Test and report verified outcomes separately from proposed work.
4. Keep main branch unchanged until review.
5. End each development session with a pasteable continuation command.

## Already verified (not counted as completed tasks above)
- Development branch feature/elder-eye-admin-foundation exists.
- schema.sql, seed.sql, engine.js, README.md, ROAD_IMPORT_REVIEW.md committed.
- Live database migrations, VTT integration and automated tests not verified.

## Continuation command
Continue Elder Eye autonomous development on feature/elder-eye-admin-foundation. Select the highest-value uncompleted task, inspect existing repository structure, implement and test a safe improvement, protect Alice Z'ress canon and EE-B2-001, update this backlog with evidence, and report actual commits separately from plans. Prioritize fun, playability, photorealism, and five clickable choices.

## Session 002 partial progress (not completed)
- EE-T066: Five-choice contract and journal adapter authored; no HTTP endpoint or browser QA.
- EE-T071: Inspected existing server.js and its auth/event flow; broader repository audit remains.
- EE-T072: Verified package dependencies and migration definitions; install/runtime check pending.
- EE-T074: Adapter writes to existing vtt_campaign_events with revision/idempotency controls; full event sourcing and replay projections pending.
- EE-T085: Added six service regression tests and six earlier scene-contract tests; execution not verified.
- Architectural decision: elder-eye/admin/INTEGRATION_DECISION.md. Do not run duplicate draft admin schema on live database.

## Session 003 partial progress (tests not yet verified)
- EE-T066: Authenticated HTTP choice endpoint committed; client integration/browser QA remains.
- EE-T074: Existing vtt_campaign_events journal used with transaction, revision and replay handling; projections pending.
- EE-T077: Scene GET and campaign choice POST added to server.js; live API smoke test pending.
- EE-T085: Scene contract and journal service regression tests included in CI workflow; no passing run confirmed.
- EE-T078: Shared dice-rule validation used; character ability modifier provenance still requires verification.
- Full completion count remains 0/100 until acceptance criteria and tests are verified.

## Session 004 partial progress — unverified CI
- EE-T065: Four text-only cinematic scene panels added to game/elder-eye-live.html; final artwork and visual QA pending.
- EE-T066: Five clickable choices in browser wired to authenticated choice POST; browser integration test pending.
- EE-T077: Campaign-scoped GET scene, protected event type, and local /elder-eye shell route committed.
- EE-T085: Authenticated HTTP integration test authored and added to GitHub Actions; no passing run confirmed.
- EE-T099: Draft PR #1 created for CI and review, explicitly not for merge. Deployment blocked by client-supplied modifier.
- Fully verified completion remains 0/100. See SESSION_004_REPORT.md.
