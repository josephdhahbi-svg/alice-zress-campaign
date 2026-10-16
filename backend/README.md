# Moonveil Automaton FSM — isolated v1 module

Node.js built-in test runner (Node >=20); no external packages required.

Run `node --test backend/automaton_fsm.test.js`.

This is a deterministic in-memory state-transition controller for a **provisional/homebrew** unit identifier, `UNIT-VANGUARD-09`. It does **not** connect to physical robotics hardware; does **not** run Express, WebSockets, SQLite, Docker or Flutter; and must **not** be exposed directly to untrusted control commands.

Five states: `IDLE`, `PATROL`, `ENGAGE`, `RECALIBRATE`, `EMERGENCY_SHUTDOWN`. Commands use an explicit allowlist and empty-object payloads. Emergency shutdown is intentionally terminal until a separately designed, authorized reset process is approved. Starting patrol requires at least 15% battery. Successful transitions return immutable journal-ready events with sequence numbers; persistence and authorization are future work.

The unit ID is an engineering fixture, **not established Alice Z'ress canon**. Existing Book 1 gameplay remains unchanged.

## SQLite campaign event ledger (prototype)
`campaign_store.py` is a separate Python-standard-library SQLite component.
It is **not** a deployed server, a character-state projector, an authentication
layer, or a ChatGPT integration. It does not replace the browser's local saves.

Usage (from the repository root):
```sh
python -m unittest discover -s backend -p 'test_campaign_store.py' -v
```

`initialize(conn)` creates the campaign and append-only event tables.
`create_campaign(conn, id)` registers a new campaign.
`append_event(conn, campaign_id, event_id, idempotency_key, type, payload, expected_revision)`
serializes writers, rejects stale revisions, and returns a replay result for
duplicate idempotency keys. `campaign_snapshot(conn, campaign_id, after_revision=0)`
reads ordered committed events after an exclusive cursor.

**Important limitations:** no access control, no HTTP API, no per-player
ownership, no payload schema beyond requiring a JSON object, and no integration
with the existing Book 1 browser. A caller must authenticate and authorize
the player *before* exposing snapshots or accepting commands. Open SQLite
connections with a suitable timeout and enable foreign keys on every
connection. Test actual file-backed concurrency and backup/restore before
production use. Never treat this prototype as a multiplayer-ready service.
