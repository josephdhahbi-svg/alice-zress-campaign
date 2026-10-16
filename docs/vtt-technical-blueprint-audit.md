# Moonveil VTT — Technical Blueprint Integration & Audit
**Status:** Architecture proposal + repository gap analysis  
**Date:** 2026-10-15  
**Source:** User-supplied “Moonveil Universe VTT: Master Technical Blueprint”  
**Related:** `docs/master-development-board.md`, `docs/architecture.md`, `docs/continuity.md`

## 1. Target architecture

The proposed end-to-end flow is:

Flutter UI / inspection modal / player action  
→ `UniverseProvider` (campaign state and pending changes)  
→ `UniverseApiService` (HTTP boundary)  
→ Node.js + Express REST API  
→ SQLite transaction and persistence  
→ explicit success/error response  
→ UI sync status and durable campaign state

Proposed API routes:
- `GET /api/health` — service health.
- `GET /api/universe-state` — fetch saved campaign state.
- `POST /api/sync-universe` — validate and persist a campaign update.

Proposed client configuration:
- Android emulator: `http://10.0.2.2:3000/api`.
- Desktop/web/physical device: environment-specific base URL; do not assume the emulator hostname works everywhere.
- SQLite WAL is a backend persistence setting, not a replacement for transaction handling, backups, or validation.

## 2. Repository evidence versus proposal

The repository currently documents and exposes:
- A browser-based offline campaign prototype at `game/index.html`, with local browser saves, character creation, quest journal, five sample choices, and save import/export.
- JSON entity data and `data/schema.json`.
- Python scripts for validation, story scoring, analytics, link checking, and simulation.
- Documentation describing a relationship graph and future architecture.

The inspected repository paths did **not** expose the proposed Flutter source tree, Node.js Express server, controller, migration script, or SQLite database. This is a limited directory/API inspection, not proof those files do not exist elsewhere. Treat the Flutter/API/SQLite stack as a target design until the actual implementation is located and tested. The existing browser prototype explicitly says it is local and not automatically synchronized with GitHub or ChatGPT.

## 3. Important correctness issues in the supplied code sample

### P0 — Book INSERT conflicts with table constraints
The migration defines `books.trilogy_number`, `title`, and `era_name` as `NOT NULL`, but the sync controller inserts only `book_number`, `is_completed`, and `updated_at`. A new book row will fail unless those required columns are supplied or the schema is deliberately redesigned with valid defaults. The controller must check every statement error and roll back the transaction on any failed book update.

### P0 — Validate incoming values on the server
The sample checks only that two fields exist and `book_updates` is an array. Add integer/range checks for book numbers and packet counts, strict booleans, payload size limits, duplicate-book handling, and explicit error responses. Do not trust client-supplied progression or packet balances without server-side rules.

### P0 — Sync concurrency can lose updates
The Flutter sample returns early when `_isSyncing` is true. A second user action during a request can be left unsynced because no follow-up sync is queued. Use a serialized/coalescing queue or revision-based sync loop; expose syncing/error/last-success state to the UI.

### P1 — Seed data and persistent state must agree
The Flutter provider creates 30 generic placeholder book titles, while the server table requires title/trilogy/era metadata and the 30-book narrative index has specific titles. Use a single versioned book catalog or stable catalog IDs; do not allow placeholder titles to become canonical records.

### P1 — Packet balance needs a real ledger
The example stores `available_packets` as a mutable number with a default of five, but has no earning/spending transaction ledger. Add immutable events for grant/spend/refund/adjustment, actor, timestamp, reason, source scene, and resulting balance. Validate spending and prerequisites on the authoritative side.

### P1 — State loading and transaction errors need handling
Check database open/read errors, absent `user_state`, statement errors, finalize errors, and commit errors. Return a stable response envelope and do not report success until the transaction has committed. Ensure rollback completes before closing the connection.

### P1 — Authentication, ownership, and deployment
The sample has a single global row `id = 1` and unrestricted CORS. That can be acceptable for a local single-user prototype only. Before remote or multi-user deployment, define authentication, campaign ownership, authorization, origin allowlists, secret/config handling, and per-campaign state. Never expose an internet-facing write endpoint without access control.

### P2 — Dice are presentation, not a full rules engine
The sample animated roller generates a final d20 result and checks `roll >= targetDc`. It has no ability modifier, proficiency, advantage/disadvantage, natural 1/20 policy, roll audit trail, or server-verifiable seed. Keep the UI animation separate from the authoritative result calculation. Record the check definition, modifiers, final roll, outcome, and resulting state. Do not claim the current sample implements full D&D rules.

### P2 — Platform and resilience
Use environment-based API URLs, timeouts, retry/backoff with idempotency keys, schema/version negotiation, database backup/restore tests, and offline pending changes. WAL improves concurrency behavior but requires a correct lifecycle and backup strategy.

## 4. Recommended data model additions

Keep the existing lore schema and the gameplay persistence schema distinct but linked by stable IDs.

- `campaigns`: campaign ID, schema version, owner, current book/scene, revision.
- `campaign_state`: per-campaign mutable values and last committed revision.
- `book_progress`: campaign ID, book ID, status, start/completion timestamps.
- `choice_events`: immutable choice event, selected option, context, consequences, timestamp.
- `dice_events`: check type, DC, modifiers, roll result, outcome, timestamp, source scene.
- `packet_ledger`: packet grant/spend/adjustment events and reason.
- `inventory_events`: acquisition, use, transfer, loss, and reward gating.
- `sync_outbox` or equivalent client queue: pending idempotent changes and retry status.
- `schema_migrations`: ordered migration versions and applied timestamps.

Recommended invariants:
1. Every record has a stable ID; gameplay rows reference lore IDs rather than copying canonical titles.
2. Every mutation has an event or audit trail when it affects future play.
3. A sync request is atomic: all updates commit, or none do.
4. Repeating the same idempotent request must not duplicate consequences or packet changes.
5. The UI distinguishes local/pending, synced, and failed states.
6. Historical canon timestamps and gameplay timestamps remain separate.
7. A save can be exported, restored, and validated without access to a live server.

## 5. Proposed build sequence

1. Locate or create a dedicated backend directory and package manifest; add migration and controller tests.
2. Define and validate the book catalog from the approved 30-book index.
3. Implement API request/response schemas and server-side validation.
4. Add SQLite migrations and atomic transaction/error handling.
5. Implement revision-aware, queued client sync and visible sync status.
6. Add choice, dice, packet, and inventory event ledgers.
7. Connect Flutter screens to stable book/scene/choice IDs.
8. Add CI tests for migration, transaction rollback, invalid payloads, duplicate requests, offline retries, and export/import.
9. Run a complete vertical-slice test: start Book 1, make a choice, roll, change state, sync, restart, hydrate, and confirm the same state returns.

## 6. Definition of done

The VTT integration is not complete until:
- Migration can run repeatedly without damaging data.
- Valid updates persist and hydrate accurately.
- Invalid requests are rejected without partial writes.
- Transaction failures roll back.
- Concurrent user actions are eventually synced in order.
- Packet balances and book completion cannot be arbitrarily forged by the client.
- A saved campaign can be exported/restored and validated.
- CI tests pass and deployment assumptions are documented.
- Implementation status is supported by actual repository files and test output, not by this blueprint alone.
