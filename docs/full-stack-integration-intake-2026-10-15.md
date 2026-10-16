# Moonveil full-stack integration intake — 2026-10-15

Status: USER-SUPPLIED PROPOSAL / NOT DEPLOYED OR VERIFIED.

## Supplied modules
- SQLite factions, regional_control, faction_control_audit_log, ownership-change trigger.
- Node database maintenance/checkpoint and backup validation.
- Discord webhook alert service and /vtt-status bot.
- Flutter RealmMapProvider and NodeFloatingPopup.
- Target: Express, raw ws, SQLite WAL, Flutter Web, Docker, Nginx.

## Existing repository baseline
- Browser prototypes: game/book1.html, game/living-world.html.
- In-memory FSM: backend/automaton_fsm.js with Node tests.
- JSON campaign data and Python validators.
- Do not claim the supplied modules are already committed, tested or deployed.

## Integration blockers and fixes
1. Migration ordering: define spatial_nodes before regional_control; enable PRAGMA foreign_keys=ON on every SQLite connection; add CHECK constraints for alignment_tier and monotonic revision where required.
2. Ownership audit: current trigger logs only controlling_faction_id changes, not control_index-only changes. Decide whether to audit both. Add actor, reason, realm ID, sequence/revision, and server UTC timestamp in authoritative transactional ledger; do not infer in-world DR date from current wall-clock time.
3. Backup safety: avoid interpolation of arbitrary paths into VACUUM INTO; prefer driver online-backup API with safe destination, file retention and checksum. Verify backups with integrity_check AND actual restore/open tests; coordinate checkpoints with active readers.
4. Maintenance: avoid overlapping scheduled jobs; use controlled start/stop lifecycle and observe errors.
5. Discord: validate webhook host and HTTPS, set timeouts, await HTTP response, retry only safe failures with backoff, sanitize payloads, avoid posting secrets/PII. Slash command needs authorization, known entities schema, and separate DB/WAL metrics.
6. Flutter: initialize channel safely, store/cancel StreamSubscription, validate packet shapes and revisions, guard delayed callback after dispose, cancel timers, handle reconnect/backoff and full snapshot sync. Avoid duplicated listeners on connect.
7. Transport: use raw WebSocket consistently (not Socket.IO); authenticate connection and authorize every realm mutation; broadcast only after committed transaction.
8. Operations: add migrations, integration tests, Docker, secrets and TLS only after backend foundation exists.

## Implementation order
A. Confirm repo tree and test baseline.
B. Add schema migrations and SQLite tests (including trigger and rollback).
C. Implement server-authoritative regional control mutation API.
D. Add revisioned WS event protocol and authentication.
E. Add resilient Flutter provider and popup tests.
F. Add backup/restore worker and tests.
G. Add Discord integration behind optional configuration, with tests.
H. Add Docker/CI and deployment smoke tests.

## Source-of-truth rule
This document records user-provided proposed code; implementation status is not DONE until committed and tested. Preserve previous 100-task trackers and established canon.
