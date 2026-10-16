# Moonveil VTT — 100-task execution ledger (new directive)

Updated: 2026-10-15. This ledger uses **T001–T100 from the user's new ten-phase directive**. Do not conflate it with the older `docs/task-status.md` numbering. A feature stub is not a completed task.

Status vocabulary: **DONE** (verified acceptance), **PARTIAL** (some implementation exists), **NOT STARTED**, **BLOCKED**. No task is marked DONE solely from file existence.

| ID | Task | Status | Evidence / outstanding work |
|---|---|---|---|
| T001 | Inventory repository files and systems | PARTIAL | GitHub recursive tree inspected (162 entries); full source-by-source audit pending |
| T002 | Audit broken paths and dependencies | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T003 | Review server startup and security | PARTIAL | Reviewed server.js; authentication is single shared development token; no per-user auth |
| T004 | Review dependencies and reproducibility | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T005 | Review Python SQLite event store | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T006 | Check JavaScript and static pages | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T007 | Fix failing tests with evidence | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T008 | Expand CI coverage | PARTIAL | CI validated at run 38845612687 (success); latest security-change run pending |
| T009 | Document architecture and limitations | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T010 | Maintain task completion ledger | PARTIAL | This ledger committed; automated status reconciliation pending |
| T011 | Harden Express startup | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T012 | Verify SQLite WAL and constraints | PARTIAL | WAL, foreign keys, busy_timeout configured; startup and migration verification pending |
| T013 | Versioned database migrations | NOT STARTED | Transactional v1 migrations implemented in backend/migrations.js; upgrade/rollback scenarios still pending |
| T014 | Campaign and session identifiers | NOT STARTED | Campaign IDs and DM membership records implemented; secure player sessions not yet implemented |
| T015 | Player and DM authentication | NOT STARTED | Expiring HMAC actor sessions added for local development; real player login and token revocation remain outstanding |
| T016 | Per-campaign authorization | NOT STARTED | Actor session identity bound cryptographically; membership checked per campaign; admin can mint any actor, so not public-ready |
| T017 | Revision and idempotency checks | PARTIAL | SQLite revision conflicts and event idempotency implemented; cross-actor retry guard added |
| T018 | Authoritative event journal integration | PARTIAL | Node campaign event journal implemented; Python ledger not yet unified |
| T019 | Validated API contracts | PARTIAL | Campaign event API has signed actor session support, validation and cursor paging; full typed contracts pending |
| T020 | Recovery and concurrency tests | NOT STARTED | Implementation and verification pending |
| T021 | WebSocket authentication | PARTIAL | WebSocket still admin-only; campaign broadcasts disabled; scoped sockets not implemented |
| T022 | Campaign-scoped broadcasts | NOT STARTED | Implementation and verification pending |
| T023 | Reconnect and resync | NOT STARTED | Implementation and verification pending |
| T024 | Authoritative movement | NOT STARTED | Implementation and verification pending |
| T025 | Scenes and portals | NOT STARTED | Implementation and verification pending |
| T026 | NPC scheduling | NOT STARTED | Implementation and verification pending |
| T027 | Faction map integration | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T028 | Deterministic pulse auditing | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T029 | Multiplayer consistency tests | NOT STARTED | Implementation and verification pending |
| T030 | Two-client demo | NOT STARTED | Implementation and verification pending |
| T031 | Character-sheet models | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T032 | Abilities and proficiency | NOT STARTED | Implementation and verification pending |
| T033 | Class and species rules | NOT STARTED | Implementation and verification pending |
| T034 | Spell resources | NOT STARTED | Implementation and verification pending |
| T035 | Equipment and attunement | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T036 | Initiative and conditions | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T037 | Attack and saving throw rules | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T038 | Rest and leveling | NOT STARTED | Implementation and verification pending |
| T039 | Official vs homebrew labeling | NOT STARTED | Implementation and verification pending |
| T040 | Rules regression tests | NOT STARTED | Implementation and verification pending |
| T041 | War room persistence | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T042 | Tactical grid line of sight | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T043 | Armies and squads | NOT STARTED | Implementation and verification pending |
| T044 | Garrisons and sieges | NOT STARTED | Implementation and verification pending |
| T045 | Supply logistics | NOT STARTED | Implementation and verification pending |
| T046 | Faction diplomacy | NOT STARTED | Implementation and verification pending |
| T047 | Victory and retreat conditions | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T048 | Enemy tactical AI | NOT STARTED | Implementation and verification pending |
| T049 | Battle event journaling | NOT STARTED | Implementation and verification pending |
| T050 | War scenario tests | NOT STARTED | Implementation and verification pending |
| T051 | Five-choice dialogue | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T052 | Dialogue checks | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T053 | Companion approval history | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T054 | Affirmative consent | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T055 | Redemption questlines | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T056 | Deity shrine prerequisites | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T057 | Merchant economy | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T058 | Lore and quest flags | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T059 | Moral role colors | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T060 | Story continuity tests | NOT STARTED | Implementation and verification pending |
| T061 | Alice warlock canon | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T062 | Sole Ghaunadaur patron | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T063 | Three custom origin gifts | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T064 | Rabbit-hole prologue | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T065 | Lolth antagonist | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T066 | Underdark adventure content | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T067 | Abyss adventure content | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T068 | Avernus adventure content | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T069 | Thirty books and seven traversals | PARTIAL | Local browser prototype implements progression; canonical save integration pending |
| T070 | Book 30 loop logic | PARTIAL | Local browser prototype implements progression; canonical save integration pending |
| T071 | Character registries | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T072 | Location registries | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T073 | Monster registries | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T074 | Spell and item registries | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T075 | Mission and dialogue registries | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T076 | Chronology metadata | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T077 | Source and canon status | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T078 | Lifetime collection targets | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T079 | Endgame reward locks | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T080 | Continuity automated checks | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T081 | Responsive navigation | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T082 | Reusable visual components | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T083 | Tactical and dialogue controls | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T084 | Map overlays | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T085 | Combat animations | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T086 | Keyboard and mobile controls | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T087 | Flutter widgets | NOT STARTED | Implementation and verification pending |
| T088 | Flutter API integration | NOT STARTED | Implementation and verification pending |
| T089 | Connection and recovery UI | NOT STARTED | Implementation and verification pending |
| T090 | Cross-device QA | NOT STARTED | Implementation and verification pending |
| T091 | Environment and secrets | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T092 | Docker local development | NOT STARTED | Implementation and verification pending |
| T093 | Backups and restore | NOT STARTED | Implementation and verification pending |
| T094 | Logging and diagnostics | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T095 | Deployment workflow | NOT STARTED | Implementation and verification pending |
| T096 | Security tests | NOT STARTED | Added tampering, header spoofing and admin escalation tests; latest CI for these tests pending |
| T097 | End-to-end regression | NOT STARTED | Implementation and verification pending |
| T098 | Release and DM documentation | PARTIAL | Existing prototype or documentation; acceptance tests/integration remain |
| T099 | Evidence-based completion audit | NOT STARTED | Implementation and verification pending |
| T100 | Verified playable release | NOT STARTED | Implementation and verification pending |

## Verified work performed in this batch
- Inspected recursive GitHub repository tree: 162 entries including six browser game pages, Node server, Python ledger, and CI.
- Reviewed `server.js` and `.github/workflows/validate.yml` source. Found CI previously did not trigger on root `server.js` or `package.json` changes and did not check server syntax.
- Updated workflow to include those paths and run Node 22 `node --check server.js`. Commit `075728d`.
- Added `.gitignore` for SQLite WAL/database files, `.env`, `node_modules`, and Python cache. Commit `498ba67`.

## Next highest-priority tasks
1. Run newest CI and local Node/Python suites; fix real failures before marking T006–T008 DONE.
2. Create reproducible npm lockfile; add isolated integration tests for Express routes and SQLite WAL.
3. Remove reliance on a single shared token for anything beyond loopback-only development. Add campaign-scoped authorization before multiplayer.
4. Preserve existing browser localStorage saves and Python ledger until an explicitly tested migration exists.

## Development continuation — 2026-10-15
- Verified GitHub Actions run [38845612687](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38845612687) completed successfully at commit `11c41d87` (baseline before the changes below).
- Added transactional SQLite migration `backend/migrations.js` and Node campaign event routes in commits `2aed57b`, `f041f53`, `6f95eba` (previous batch).
- Security review: the shared development token and spoofable actor header do **not** authenticate individual players. Removed campaign event broadcasts from global WebSocket clients until scoped sessions exist. Commit `29417da`.
- Added bounded cursor-based campaign event reads (100 events per page), stricter duplicate-event actor matching, and corresponding integration tests. Commit `5db7a2b`.
- Preserve browser local saves and Python ledger; no migration performed.
- The latest GitHub Actions outcome for these security changes must be checked before marking their tests verified.

## Batch 5 — actor-bound development sessions
- Baseline GitHub Actions run [38845715063](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38845715063) passed on `5db7a2b`.
- Added `backend/session-auth.js` with HMAC-SHA256 signed, expiring actor tokens (commit `0a937b9`).
- Server now distinguishes local administrator token from actor tokens, limits admin routes to administrator, and ignores spoofed actor headers for signed actor sessions (commit `6def2c7`). CI [38845812678](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38845812678) passed for this server commit.
- Extended integration tests for token tampering, forged actor headers and actor-to-admin privilege escalation (commit `31b813f`). Their latest CI run must be checked before calling these test cases verified.
- Updated server setup docs with session issuance and boundaries (commit `8dd3f96`).
- Remaining: genuine player identity provider, actor session revocation, per-campaign WebSocket authorization, rate limiting, equipment ownership and real-world deployment security.

## Batch 6 — persistent actor session revocation
- Verified GitHub Actions baseline [38845905630](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38845905630) passed at `9ec92358`.
- Implemented SQLite migration v2 for hashed revoked actor sessions (`c660350`). Its CI run [38845935834](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38845935834) passed.
- Added `POST /api/sessions/logout` and admin-only `POST /api/admin/sessions/revoke` and reject revoked tokens in middleware (`0ff9a4c`).
- Added HTTP regression tests for logout and admin revocation (`204cb7d`). Latest test CI outcome pending.
- Updated local development documentation (`2665d35`).
- Security limitations: development admin may mint actor identities; no production identity provider, campaign-scoped WebSocket sessions, or rate limiting. SQLite revoked-token records need expiry cleanup.

## Batch 7 — campaign-scoped WebSocket notifications
- Verified prior session-revocation integration test: [CI run 38845957562](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38845957562), success at `204cb7d`.
- Added authenticated campaign-specific WebSocket upgrade handling and `CAMPAIGN_EVENT` notifications (`f319d3e`); no global broadcast of private campaign events.
- Added integration test for two-campaign isolation and revoked token HTTP denial (`c024a5b`, race correction `5555a53`).
- Wired new WebSocket test into CI (`46ba83d`), outcome pending at time of writing.
- Updated development documentation (`496af8e`).
- Remaining: verify WebSocket CI, real account identity, origin validation and TLS, per-campaign character ownership, reconnection replay, and cross-device gameplay QA.

## Batch 8 — WebSocket reconnect recovery
- Verified campaign-isolation CI run [38846157184](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38846157184), success at `8abd9ab1`.
- WebSocket now accepts a nonnegative integer `after` revision and returns `CONNECTED` with current revision plus `CATCH_UP_REQUIRED` when a client is behind (`2e912ea`). CI [38846242788](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38846242788) passed.
- Added reconnect tests for stale/current/invalid revision cursors (`5da85ee`); latest CI outcome pending.
- Documented HTTP cursor-based journal replay after reconnect (`380108d`).
- No automatic browser save migration or gameplay state projection yet; the server event ledger remains a local development prototype.

## Batch 9 — user-supplied LEGO bundle integration
- Latest verified baseline [CI 38846582693](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38846582693) passed at `083eb354`.
- Added `backend/backup-service.js`: opt-in SQLite online backups via `db.backup()`, default six-hour interval, retention, failure cleanup and no concurrent runs (`72cda95`).
- Wired `MOONVEIL_BACKUP_DIR` and `MOONVEIL_BACKUP_RETAIN` to local server lifecycle (`1db1aec`); its CI run [38846849378](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38846849378) passed.
- Added backup service unit tests (`e62730b`); baseline CI [38846861904](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38846861904) passed but the workflow did not yet execute these tests.
- Added dedicated CI backup test step (`5dfbbae`); its outcome pending at ledger update time.
- Documented safe integration decisions, Flutter proposals, and provisional Glyph TypeScript combat prototype (`15452d2`).
- T093 backups: PARTIAL (online local backups, no restore drill, encryption or offsite rotation). T087–T089 Flutter features: NOT STARTED. T040 combat/rules: NOT STARTED for attached Glyph prototype. Do not call these production-ready.

## Batch 10 — verified backup restore and isolated Glyph tactical prototype
- Dedicated backup-service CI succeeded [38846873816](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38846873816) at `5dfbbae`.
- Added actual better-sqlite3 WAL backup restore integration test: verifies database integrity, migrated schema, campaign membership and Alice's `CHOICE_RESOLVED` event survives reopening the backup (`c429bbb`); wired into CI (`d691b57`). Check its latest CI before marking fully verified.
- Added isolated `backend/glyph-tactics.js` with bounded, explicitly prototype actions and expiring defense/control effects; no persistent character-sheet changes (`de56163`).
- Added Glyph tests for injured ally support, damage bounds, expiry and incapacitation (`8040cb5`), wired into CI (`8c8fb52`). Latest test CI pending.
- T093 backup and restore PARTIAL until full operational restore procedure, offsite retention and encrypted backup handling. T040 combat PARTIAL prototype only, not official 2024 D&D mechanics. T087 Flutter deck still NOT STARTED.

## Batch 11 — backup restore verification and browser tactical command deck
- Verified real SQLite WAL backup restore and Glyph prototype test suites via [CI 38847046225](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847046225), success at `8c8fb52`.
- Added `game/tactical-command-deck.html`: clickable command macros, versioned local pin preferences, dice sandbox, isolated Glyph support/attack/defend/control/scan actions, status display and JSON export (`5a8d24e`). No authoritative campaign save modifications.
- Linked the deck from the tactical war table (`9f79949`).
- Extended `scripts/test_living_world.py` static checks to cover the deck controls, navigation and macro persistence (`0f90c34`). CI for the new browser deck is pending; no manual browser QA yet.
- T082 and T083 UI controls PARTIAL; T087 Flutter widgets NOT STARTED (browser deck is not Flutter). T040 Glyph remains sandbox-only and is not official D&D rules. T093 local backup restore test verified, but operational recovery, encryption and offsite rotation remain.

## Batch 12 — command deck safety and preview honesty
- Verified static command deck checks in [CI 38847203967](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847203967), success at `0f90c349`.
- Improved local deck to clearly distinguish preview-only commands from working navigation and dice; sanitized/deduplicated saved pin codes (`5529dbb`).
- Blocked invalid Glyph actions and no-target healing/attacks; sandbox remains isolated from authoritative Alice saves (`1367968`).
- Extended static checks for preview labeling, supported actions, and target guards (`bd3ff3f`). New CI outcome pending; manual browser QA and automated DOM interaction testing remain.
- T082/T083 remain PARTIAL; T040 Glyph rules prototype remains PARTIAL and non-canonical. No production-ready claims.

## Batch 13 — d20 macro and Glyph invalid-state hardening
- Verified command deck safety checks in [CI 38847307426](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847307426), success at `bd3ff3f`.
- Added bounded roll modifier (-10..20), difficulty class (1..40), and logged d20 totals and outcomes to the local command deck (`405a25e`); [CI 38847423183](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847423183) succeeded.
- Extended static deck regression checks for roll controls and outcome messages (`4d0c1cc`); latest CI pending.
- Hardened isolated Glyph prototype against malformed HP and nonfinite random rolls (`04f0bde`), with new edge-case unit test (`723451f`); latest CI pending.
- Parallel art/asset commits appeared on main during this batch; none of the art/asset files were overwritten.
- Browser-based interaction QA and authoritative campaign macro execution remain unimplemented; no Flutter integration or production readiness claim.

## Batch 14 — authenticated campaign d20 journal
- Verified Batch 13 dice/Glyph tests [CI 38847455047](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847455047), success; Pages deployed [38847469964](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847469964).
- Added deterministic bounded d20 resolution module (`4959690`) and edge-case unit tests (`b6fd16a`), included in CI (`99a6a72`); [CI 38847734743](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847734743) passed.
- Added campaign-scoped `POST /api/campaigns/:campaignId/rolls` endpoint: server-side crypto random die, authenticated member authorization, observer restriction, journal revision and idempotent retry (`7ff575c`); [CI 38847752196](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847752196) passed existing tests.
- Extended HTTP integration test with roll replay, invalid input and outsider isolation (`e324d57`); newest CI outcome pending.
- Documented development API and limitations (`e14abf9`). T017/T018/T032 partial; browser macro remains local-only, no server linkage or official combat effects. Production authentication/fairness remains unimplemented.

## Batch 15 — secure client groundwork
- Verified server roll integration tests: [CI 38847778798](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847778798), success at `e324d572`.
- Created `game/roll-client.js`: explicit HTTPS/loopback URL validation, actor bearer token only in Authorization header, bounded dice parameters, no token persistence and no automatic retry after revision conflict (`6f669aa`).
- Added client contract tests for requests, URL validation, invalid inputs and conflict reporting (`09fd2cd`), added dedicated CI step (`7349175`). [CI 38847910015](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38847910015) passed.
- Documented usage and blockers (`d3dc8a0`). The tactical command deck HTML was **not changed** this batch; UI wiring and cross-origin deployment are still unresolved. Do not claim end-to-end multiplayer dice are available on GitHub Pages.
- T019 API contracts PARTIAL; T088 client API groundwork PARTIAL, not Flutter; T089 recovery PARTIAL.

## Faction dispute integration — 2026-10-15
- Added transactional `backend/faction-dispute-engine.js` using existing `factions` and `territory_control` tables; unique partial index prevents concurrent PENDING/ESCALATED disputes on one territory. UUID dispute IDs and capped escalation. Commits `cedfbfc`, `38509c1`.
- Added `backend/faction-dispute-engine.test.js` for escalation, participant-only settlement, stale owner rejection, and atomicity (`33e7117`). [Validation at tests commit](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38848321212) succeeded.
- Added admin-only `POST /api/war-table/dispute` and `POST /api/war-table/resolve` endpoints (`8dd308a`). Uses existing local admin token, not untrusted user-supplied roles. Wired dispute tests into CI (`f87a5c6`). CI on integration commit pending at ledger update; do not claim endpoint integration tests exist yet.
- T027 faction map PARTIAL, T046 diplomacy/disputes PARTIAL, T049 war event log NOT STARTED for disputes. No campaign-scoped event journal or websocket synchronization yet; not production-ready.
