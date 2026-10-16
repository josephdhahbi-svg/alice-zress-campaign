# Moonveil continuous execution handoff
Repository: josephdhahbi-svg/alice-zress-campaign
Branch: feature/verified-automation-phase-a
Checklist: docs/engineering/MOONVEIL_100_TASK_EXECUTION_CHARTER.md

## Operating contract
1. Read latest GitHub branch and checklist; do not trust stale counts.
2. Choose the highest-value unblocked tasks and implement end-to-end. Prefer tests and secure integration over more planning.
3. Fetch existing files before editing. Preserve signed sessions, actor ownership, campaign events, SQLite WAL and migrations.
4. Run tests in an actual Node environment; record command, output, commit and failures. Never claim a test passed merely because a test file exists.
5. Update checklist only for evidence-backed deliverables. If tool access or runtime is blocked, report it without inventing success.
6. Keep Alice's Level 1 state separate from narrated simulation. No unearned items, buffs or levels.
7. Never conflate Mistral, Mystryl, Mystra or candidate v46 artifacts. Preserve 20 planned grand artifacts separate from 111-relic goal.
8. Follow eye-comfort UI: navy/violet surfaces, BLUE heroes, RED villains, GREEN neutral, PURPLE magic, GOLD artifacts, CYAN maps. Four story panels plus five choices (Lawful Good, Neutral Good, Chaotic Good, Utility, Action).
9. At every session end give verified complete / in progress / remaining, changed files, commits, tests, blockers, next steps and a copyable handoff.
10. When the 100 tasks are genuinely complete, create a new prioritized backlog based on verified gaps. Do not invent extra work to inflate completion.
11. No background execution claim: continue when invoked, or use a real supported scheduler if requested.

## Immediate next execution batch
- Run migration-v3.test.js and quest-core.test.js in Node >=20 with better-sqlite3 installed; fix failures.
- Review existing server auth and campaign event API; implement authenticated quest service with character ownership, authoritative verified objective evidence, atomic reward transaction and idempotency.
- Add API integration tests for forbidden access, missing objectives, duplicates, restart persistence, cross-campaign isolation and concurrency.
- Run npm test and CI, then mark T043/T046/T023/T028/T030/T091/T092 only if their acceptance conditions are fully met.
- Keep unverified tasks open.

## Existing evidence
- v46 review commit: 164dc07022e5ffe2abd6598111fc0e4123c4a802
- Candidate quest core: 7311e4983f42a5d0b3f1b29dc65c561bce851350
- Candidate unit tests: c8928f3e8da03cef14153f9febdea200a77677e4
- Migration v3: 628aabe21a7df09e16d5b227d484d803fef20f8d
- Migration test: 182e71f34926788772801acf1e390ead61382c40
- Earlier assistant reported local four tests passing, but this session has not independently reproduced them. Verify before counting T091 if strict audit is required.

## Session update — 2026-10-16, machine-readable canon
- New `config/alice-canon-registry.json` committed at `307eba5b43109cea07d0026b5dd3dfbda17a82b5`.
- New `backend/alice-canon-registry.test.js` committed at `ae117287e83891aa5761a5a1e716af164907a51e`, then corrected config import at `8352feb49a0869ad39d6501c5e73cf32a74e379e`.
- First placement under `data/` caused **Validate campaign records** GitHub Actions run 38918715348 to fail at JSON record metadata validation: the validator rejects unregistered JSON shapes. Moved registry to `config/` and deleted bad data copy at `4a0de2a101ba3ac00cfae23db05a1a035e995e71`.
- No confirmed passing CI result for the corrected HEAD yet. **Do not mark new automated tests verified.** Run `node --test backend/alice-canon-registry.test.js` and `npm test` in CI or a Node environment with dependencies.
- Task counts stay at the prior **5/100 reported** pending evidence audit; the new registry and tests are committed, not yet independently validated.
- Next: verify CI on corrected commit; add canon regression tests to existing validation workflow; run migration tests and secure quest ownership/rewards.

## Incoming Living World v46 LEGO — 2026-10-16
- Source monolith and autonomous loop were supplied by user. **Do not paste over server.js**: its master-key fallback, query-string key, memory-only pseudo-WAL, unauthenticated actor ownership, unverified quest rewards and fixed +1 DR/year per hourly pulse are unsafe/inconsistent.
- Implemented **opt-in** `backend/living-world-pulse.js` (commit `24988cca90cb6d035326a168dff6f016101086bb`): campaign-scoped SQLite factions, territories, pulse ledger; DM membership validation, explicit DR date, transactional idempotent territory transitions, pre-validation, no implicit cron.
- Added `backend/living-world-pulse.test.js` (commit `30c97e76089e21edc34768b0bf57a1d63b21a76b`): tests for DM-only, cross-campaign isolation, duplicates, invalid faction and rollback.
- **Pending:** GitHub Actions execution of new tests; safe API route wiring with signed actor sessions; scheduler design with single-worker lock and explicit campaign policy. Do not mark T081–T090 complete without CI and task-specific acceptance evidence.
- The user-proposed Python while-loop was **not installed or launched**. If implementing it, require bounded iterations/cost, sandboxed allowlisted commands, explicit approvals for destructive actions, persistent resumability and proof-based completion.

## 2026-10-16 — Signed Living World API integration
- Previous Living World CI runs **PASSED**: Omniversal verification `38919397721`; Validate campaign records `38919397158`.
- Implemented `POST /api/campaigns/:campaignId/world/pulses` and `GET /api/campaigns/:campaignId/world/ledger` in `server.js`, commit `206d88ce85fd74b4acba8735d1db9fc996cc75c0`. Requires signed actor session; POST requires campaign DM role; GET requires membership. Admin shared token intentionally rejected. Explicit DR date, no implicit cron.
- Added `backend/living-world-api.integration.test.js`, commit `5faad09ada9b6f967ca6e4fa6231b8b713841cbf`. Covers admin rejection, player and outsider denial, spoofed actor header, invalid faction, idempotent duplicate, audit ledger, invalid query and cross-campaign isolation.
- **Awaiting CI**: runs `38919615246` (Omniversal) and `38919615249` (Validate) were queued at last check. Fix failures before claiming integration complete.
- World factions/territories are intentionally not provisioned by API yet; seed through trusted campaign setup. No auto-advancing DR and no cron activated.
- Next: validate CI; add restart persistence and transactional quest ownership and rewards. Update master charter only for matching acceptance evidence.

## 2026-10-16 — Combat Engine v1 implementation
- Added `backend/combat-engine.js`, commit `169974456b14a7893068dd8f13088118935349e1`: campaign-scoped SQLite encounter/combatant/action tables, DM role validation, initiative ordering, HP bounds, healing/damage, condition changes, round/turn advance, encounter ending, transactional idempotent actions. No automatic rewards, spells or player-controlled attacks.
- Added `backend/combat-engine.test.js`, commit `03abd19c853c4a05e741401f66aa3fdfc277ab82`: unit tests for initiative, HP bounds, conditions, idempotency, DM authorization and rollback.
- Integrated three signed-actor API routes into `server.js`, commit `42b08e62514b85647d4b2384e1e47813afb393ad`: DM-only encounter creation/actions, campaign member read-only state.
- Added `backend/combat-api.integration.test.js`, commit `1d31db1e6d1d4aa4c3abd620a9f63a0896a16d2f`: API tests for DM authorization, player/outsider denial, duplicate actions and cross-campaign isolation.
- CI for `42b08e6` passed: Validate run `38920038700`, Omniversal run `38920038661`. **New integration test was committed afterward**; CI runs `38920078593` and `38920078591` must pass before claiming full batch verification.
- Still needed: verified full-batch CI, file-backed restart test, concurrent action test, server-side dice/attack roll rules, spell slots, turn permission policy, event-journal integration and quest reward transactions.
- Do not mark T074 complete: full resource/condition coverage is not yet present. Existing 9/100 count unchanged pending task acceptance review.

## 2026-10-16 — Combat durability and attack rules batch
- Added `backend/combat-persistence.integration.test.js` at commit `845bec8d55d5cdd17ced21c2065fafd7694071dd`: file-backed WAL database, two independent connections, replay idempotency, conflict rejection, restart and recovered HP state.
- Added pure `backend/combat-attack-rules.js` at `76a06b446f293b4fa698529597f0ff0c7504fe78` and `backend/combat-attack-rules.test.js` at `6ab257064dc84ae4d63670a7487dec5a4b3221f5`: validates bounded inputs, natural 1 miss, natural 20 hit/critical flag, AC comparisons and damage floor.
- **IMPORTANT:** attack resolver is NOT yet wired to authenticated API or server-generated dice; it accepts a supplied rawRoll for pure deterministic unit testing. Critical damage dice doubling is not implemented. No combat or inventory state was changed for Alice.
- **CI evidence pending for these commits.** Do not mark T074/T093 verified until passing CI and full acceptance review. Prior verified baseline remains 10/100.
- Next: verify GitHub Actions, fix failures, connect attack resolver to DM-authorized combat transaction using server-generated cryptographic RNG, enforce per-turn action economy and spell slots, then return to secure quest ownership/objective/reward transaction tasks.

## 2026-10-16 — Server-rolled attack integration
- `backend/combat-engine.js` now accepts `ATTACK` actions with bounded DM-adjudicated attackBonus, armorClass, damageCount (1–10), damageSides (2–100), damageBonus. Server uses `node:crypto.randomInt` for d20 and damage dice; natural 20 doubles damage dice; all results are stored in the same SQLite transaction as HP and action ledger. One ATTACK per initiative turn, enforced by durable `vtt_combat_turn_usage` unique key. Idempotent retries return prior results without rerolling. Commits `53e4356c66730783c234712a841ef2ac4334060b`, `bedff17ce06a4fb45c419dbfe099c136a5d119f5`.
- `server.js` passes attack parameters to DM-authenticated combat engine, commit `21e668fd01bdfd2d956e159ab9c29231f6ed9c80`. No client-supplied rawRoll accepted.
- `backend/combat-attack.integration.test.js` commit `6b1b9ff388dd1f23a394e2cb6ed443b856ccb755` tests critical dice, bounded HP, action exhaustion, replay without reroll, invalid input and RNG rollback.
- **Pending:** GitHub Actions CI outcome for integration test commit. No completion count increase until verification.
- Limitations: DM enters AC and bonuses (not yet derived from trusted character sheets); no player-controlled attack API, spell slots, bonus actions, reactions or condition effects. Do not mark T074 complete.

## 2026-10-16 — Quest evidence and completion implementation
- Added `backend/quest-evidence-engine.js`, commit `5d10ebeb8956c84e7a6f2971b031965f5a950a8e`: campaign/character owner or DM authorization; objective verification requires exact campaign journal proof `QUEST_OBJECTIVE_VERIFIED` with matching IDs; completion requires DM-authored `QUEST_COMPLETION_APPROVED` event, matching full required objective set, and persisted objective evidence; both transactional and idempotent.
- Added `backend/quest-evidence-engine.test.js`, commit `d36302dfe6ccfd55770ef5a72e33127b2a7bf18d`: ownership, isolation, missing evidence, rollback, duplicate and conflicting submissions.
- Integrated signed-actor routes `POST /api/campaigns/:campaignId/quests/objectives/verify` and `POST /api/campaigns/:campaignId/quests/complete` into `server.js`, commit `b311f9316f315f7bee2c7dd15ee9a913291d7c6b`. Existing campaign journal now restricts reserved quest proof/approval event types to DMs.
- Added `backend/quest-evidence-api.integration.test.js`, commit `aa607842d8d19567f37d83624eabdfc9d3deadb4`: rejects player-forged proof and unauthorized ownership; verifies objective and completion APIs and confirms zero artifacts awarded.
- **No artifact reward system activated**: v46 artifact list remains candidate-only. Completion returns `awardedArtifacts: []`. No Alice progression or loot changed.
- **CI pending for latest batch**. Maintain 12/100 verified until GitHub Actions succeeds and charter acceptance is checked.
- Known gap: full quest catalog/required objective sets are not yet trusted server-defined records; DM approval payload currently defines required set. Future quest definitions must prevent deliberately incomplete approval sets.

## 2026-10-16 — Authoritative quest catalog implementation
- `backend/quest-evidence-engine.js` commit `cbcbc25c0ad291be44f19e1740d554fa603a5e77` creates campaign-scoped immutable DM-registered quest definitions; objective verification rejects unknown quest/objective and completion checks the full registered required-objective set before accepting journal approval. Existing quest rewards remain disabled.
- `server.js` commit `09a3e325909c112a1e2cb97c34992d34ae5b3b55` adds signed DM-only `POST /api/campaigns/:campaignId/quests/catalog`. Registration is idempotent only for identical objective sets.
- Updated `backend/quest-evidence-engine.test.js` commit `36d6ebb1ca44b0fe3b84fc9709d7a25a0cb4e3b6` and `backend/quest-evidence-api.integration.test.js` commit `70ae79bee99fd85d353da70ae4c19385b2d1dac2` to require catalog registration and test immutability and player denial.
- CI runs `38921730562` and `38921730504` were in progress when written; verify and fix before closing T023. Current verified baseline 15/100.
- Next: catalog lifecycle/versioning, audit journal for definitions, secure reward catalog with explicit approval, combat resources.

## 2026-10-16 — Quest definition approval and audit batch
- `backend/migrations.js` migration v4 adds durable `vtt_quest_catalog`, `vtt_quest_definition_audit` and `vtt_quest_approvals`; commit `fa83690404f8597ccabe5593a0a68ad0230e7996`.
- `backend/quest-evidence-engine.js` commit `87d9f0e323d13c4717ca0b5c54cf97309c89cf82` now writes REGISTERED and APPROVED audit snapshots, requires explicit DM approval before objective verification/completion, preserves immutable objective sets.
- `server.js` commit `5889ec9f97651476b65dd122ec8993f6aaad207d` adds signed DM-only POST `/api/campaigns/:campaignId/quests/catalog/:questId/approve`.
- Tests: `backend/quest-evidence-engine.test.js` `89fd3181ae53a66dd1dfc0c5edb48b0c4b2ef846`; `backend/quest-evidence-api.integration.test.js` `8f6a714b25c88b091210a625122545b2ea339955`; new `backend/quest-approval-migration.test.js` `a56e1fa0c80616ff2c868db7b29001e9484ad182`.
- **CI not yet confirmed for this batch.** Verified charter remains 16/100 until successful workflows and acceptance review. No artifact rewards and no Alice progression changes.
- Next: CI fixes; check legacy migration tests; assess T029 audit requirements, reward catalog approval and transactional award design; combat spell slots.

### CI resolution and next work
- First v4 CI runs `38922093940` and `38922093898` failed because `backend/migrations-v3.test.js` expected exactly schema versions [1,2,3].
- Fixed migration regression assertion to compare with `MIGRATIONS.map(x=>x.version)`, commit `f3bc602c082e59e7d2f509c6b950a417e8a80329`.
- **Verified PASS**: Omniversal run `38922191588`; Validate campaign records run `38922191598`. Both jobs completed successfully after fix.
- Charter remains **16/100**: approval/audit is real and tested, but T029 covers broader quest state transitions, not merely catalog registration/approval; keep it open. No reward catalog approved and no artifacts granted.
- Next: versioned quest status transitions and audit; reviewed artifact metadata/approval design; atomic rewards only after explicit rule approval; combat resources.

## 2026-10-16 — Audited quest state transitions batch
- Migration v5 in `backend/migrations.js` commit `ed96af51f29f5bd4064d8fa0d03d0ed627a8689e` adds per-character quest states (BLOCKED/ACTIVE/FAILED/COMPLETE), revision and append-only transition audit.
- `backend/quest-evidence-engine.js` commit `a5c9851285d2ab8f58a59fe3e40fe165a38bb2ee`: DM-only state machine with expected-revision optimistic concurrency, reason, valid transition graph, transactionally logged transitions. Completion requires ACTIVE and records COMPLETE audit in the same transaction as completion.
- `server.js` commit `85e3b51b562d7ecdb5da22160f71a5f1ae58aba5`: signed DM-only POST `/api/campaigns/:campaignId/quests/:questId/state`.
- Tests updated: `backend/quest-evidence-engine.test.js` `4cb393d2a40a74c4ea2bcd11d0e8c17c6319a3a2`, `backend/quest-evidence-api.integration.test.js` `e8bab6454b7ee8c98335cd20b46d83c3e50db5e8`; new `backend/quest-state-transitions.test.js` `2049116a43c8edcb93ed30c630d4ba4af3f5c031`.
- **CI pending at time of handoff**; verified count remains 16/100 until confirmed. Do not award artifacts or modify Alice.

### Quest state CI resolution
- Initial Omniversal run `38922624373` failed due to eight SQL placeholders for nine `vtt_quest_state_audit` columns; corrected in commit `d7b8d03c02e40aaab6ee153fccdf2f4e0181235a`.
- Rerun **Omniversal `38922707170` SUCCESS** and **Validate campaign records `38922706681` SUCCESS**.
- Charter commit `1e0bc0d2da323e400768b6e96b4ace6b0681a246` closes **T025** and **T029**; verified **18/100**, open **82/100**.
- Next: trusted prerequisite graph (T021), cooldown/repeatability (T026), outcome flags (T027), artifact metadata and explicitly approved reward catalog; combat resources. No candidate artifact awards.
