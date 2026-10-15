# Engineering Batch 1 — Gemini / Copilot intake and security review

Status: **REVIEWED PROPOSAL — DO NOT DEPLOY OR COPY INTO LIVE BACKEND**.
Input: user-pasted source for backend/package.json, backend/db/database.js, backend/routes/characters.js, backend/routes/savestates.js, backend/routes/portalSync.js, backend/tests/server.test.js; plus Copilot master development charter.
Repository audit: six named backend files were not found on `dev/alice-three-chosen-roadmap` at review time. No Node test was run. Gemini's “Executed & Verified” assertion is not independently substantiated.

## Keep / adapt
- Express router factories accepting a database handle (improves isolation/testability).
- SQLite WAL, foreign keys, transactional state updates; adapt into versioned migrations.
- Explicit portal closed-by-default policy.
- Read-only character lookup and snapshot concepts.
- Jest + Supertest testing approach; run against isolated ephemeral database only.
- Copilot charter: repository truth, audit-first, stable IDs, D&D canon, Alice protection, documentation and release checklist.

## Blockers before integration
1. **No authentication or authorization** on PATCH, snapshot creation/restore or portal traversal. Comments asserting authorization do not implement it.
2. **Client-controlled level, resonance, corruption and realm**: PATCH accepts arbitrary updates, including Alice advancement; violates event-sourced server authority and player choice.
3. **Portal key spoofing**: client-supplied `hasKeyItem` is accepted; no inventory lookup, location/plane match, DR availability, prerequisites, choice event, or save revision.
4. **Unverified 1495 DR baseline**: `ERA_1495_DR` default and Alice seed assign an unverified date. The phrase “Dalereckoning Epoch” is not a historical verification. DR must be signed integer + precision + source per event, not only a baseline string.
5. **Audit log not immutable**: table has no append-only DB triggers or write policy, no causal event links, and a mutable direct UPDATE path. `Math.random()`-derived IDs and millisecond collisions are avoidable.
6. **Restore bypasses event ledger**: overwrites state without audit, actor authorization, optimistic revision check, or preserving intervening choices. Snapshot only serializes a subset of state.
7. **No versioned migrations**: CREATE IF NOT EXISTS does not migrate existing schemas; importing database.js immediately creates a persistent DB and seeds Alice. Avoid side effects on module import.
8. **Missing application entrypoint**: package main/start refers to server.js, not provided.
9. **Tests unsafe and inadequate**: integration tests write into a persistent database; `INSERT OR REPLACE` may erase rows; no test for unauthorized writes, portal spoofing, temporal mismatch, concurrency, or immutable ledger. Claimed “Executed & Verified” has no attached evidence.
10. **Error exposure**: API returns raw database error messages; require safe structured errors and input validation.
11. **Dependency/security review pending**: supplied version ranges and Node >=18 must be checked against current supported runtime and lockfile before installation.
12. **No OpenAPI implementation provided** despite Copilot charter mentioning an OpenAPI design.

## Approved implementation sequence
1. Create a pure, read-only domain contract and an isolated test fixture factory; no real Alice save import or seed.
2. Build versioned SQLite schema with explicit chronology, event ledger, foreign keys, revisions, idempotency, and separate private save storage.
3. Add authentication, campaign-scoped authorization and permission checks before any mutating endpoint.
4. Replace direct character PATCH with validated domain commands that append events transactionally.
5. Replace portal `hasKeyItem` with authoritative inventory and event prerequisites; check direction, origin, timeline, date and explicit choice.
6. Implement restore as privileged compensating event or isolated recovery process, never silent rollback.
7. Add isolated automated tests for every denied/allowed transition; then document actual execution logs.

## Required acceptance tests
- Unauthenticated PATCH/restore/traverse rejected without changes.
- Caller cannot set arbitrary level, currency, spells, resonance or location.
- Forged portal key claim fails.
- Portal unavailable when actor not at its origin, historical DR unknown, prerequisites unmet, or route locked.
- Repeated idempotency key never duplicates an event or reward.
- Concurrent writes using same save revision do not both succeed.
- Snapshot restore cannot erase immutable history or unchosen player options.
- Alice Level 1 remains unchanged; no seed on import.
- Unknown era and source status fail closed.
- All tests run on disposable database; no persistent or player data touched.

## Source and status distinction
The pasted JavaScript is a design contribution, **not committed production code**. The Copilot charter is a governance proposal; its list of “already designed” features is not proof those files exist. Treat all sourcebook, lore, geography, and historical assumptions as requiring individual verification.
