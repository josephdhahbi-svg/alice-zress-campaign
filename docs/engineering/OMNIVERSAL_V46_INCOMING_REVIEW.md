# Omniversal VTT v46.0.0 — Incoming Candidate Review
Date: 2026-10-16
Status: QUARANTINED CANDIDATE / NOT DEPLOYED
Source: user-provided consolidated runtime, Jest suite, package.json and CI YAML pasted in conversation.

## Architectural decision
Do NOT overwrite the existing server.js, package.json, migrations, SQLite DB, test runner, or GitHub Actions workflow with this bundle. Treat it as a design input for incremental integration. The user's Alice Z'ress story and gameplay state remain unchanged.

## Source bundle components
- `omniversal_engine_v46.js`: Express app, Map-based inventory and gold, EventEmitter journal, JSON snapshot, header-based auth, mock seed data.
- `omniversal.test.js`: five Jest/Supertest cases for transfer snapshot, public health, 401 unauthorized, API-key success, bearer balance.
- Replacement `package.json`: express 4, Jest 29, Supertest 6; incompatible as a drop-in replacement for the existing Node >=20 Express 5, better-sqlite3, ws, node-cron server and node:test suite.
- `.github/workflows/ci.yml`: main push/PR test workflow, npm ci, Node 20, hardcoded test credentials; requires package-lock.json.

## Verified from source inspection (not runtime tested)
1. The so-called WAL is an in-memory `walJournal` array, not SQLite WAL. No actual SQLite connection, transaction isolation, durable event replay, or atomic rollback exists.
2. `transferItem` mutates the inventory item before snapshot write; snapshot write failure occurs during commit, after state mutation, and rollback does not restore state.
3. `adjustGold` likewise mutates before commit; invalid deltas and values (NaN, fractional amounts) are not validated.
4. `DiscordAlertManager.sendAlert` logs payload; it performs no HTTP webhook request. A console message saying 'Alert Sent' is not delivery evidence.
5. Auth accepts EITHER API key OR bearer token, not both. Insecure hardcoded fallback secrets must be removed; tests should set isolated environment variables.
6. `Date.now()` transaction IDs can collide under same-millisecond calls.
7. `writeFileSync` summary is neither atomic durable ledger nor sufficient recovery snapshot (no inventory contents or balances).
8. Health endpoint reveals version and counts publicly; operational status is not proof of healthy DB or external integrations.
9. The user pasted runtime twice; duplicates should be deduplicated rather than concatenated.
10. Jest `describe/test/expect` suite is not compatible with current `node --test backend/*.test.js` script without configuration. Its five tests do not verify webhook delivery or robust rollback.
11. Workflow `npm ci` needs lockfile; do not introduce a broken CI by copying the proposed workflow.
12. Seed item 'The Soul Gem' is mock data, not an acquired Alice relic. No transfer to campaign state.

## Integration backlog (priority)
- P0: Preserve current app and DB migrations; do not label prototype 'production grade'.
- P0: Reject default secrets and enforce appropriate per-route authorization and campaign scoping.
- P0: Implement transactional inventory/gold updates using existing better-sqlite3 transaction boundaries, constraints, and idempotency keys.
- P0: Add negative-path tests: insufficient gold, missing items, concurrent transfers, rollback on write failure, invalid payloads, auth bypass, duplicate transactions.
- P1: Add optional real Discord webhook transport with redaction, timeout, retry and failure observability, disabled unless configured.
- P1: Make health/readiness truthful; validate environment, secrets and database.
- P1: Produce and verify dependency lockfile before npm ci; retain existing test framework or migrate intentionally.
- P1: Run CI and inspect evidence; no deployment until required checks and user-approved release conditions are met.

## Next actions
Compare current inventory/ledger API and tests against v46 candidate. Implement only compatible enhancements on feature branch. Execute tests and attach run logs before marking verification complete. Maintain draft PR #2 as the review boundary.

## Story continuity
This incoming software bundle does not advance Alice's Descent into Avernus scene, award gold/relics, or alter HP. Current story checkpoint: Elfsong Tavern rooftop, Alice HP 5/9, Level 1, 0/111 relics; Tarina endangered; Dead-Eye pursuing.
