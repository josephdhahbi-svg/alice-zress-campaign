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
