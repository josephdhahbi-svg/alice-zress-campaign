# Moonveil reliable event-delivery Lego
2026-10-15. Added eventOutbox.js and test_eventOutbox.js.
Purpose: close the gap between SQLite-committed world events and WebSocket delivery. Append a unique event to outbox **inside the same transaction** as authoritative ledger writes. After commit, send outbox rows to authorized profile subscribers; on reconnect, client requests rows after last acknowledged sequence. Delivery is at-least-once; clients must deduplicate by eventId.
The queue is NOT a source of authority; never accept an arbitrary client 'committed' boolean as proof of a valid ledger event.
Tests require better-sqlite3 installed. Tests skip if dependency unavailable; do not claim skipped tests passed. The code has not yet been deployed, and no live ChatGPT bridge is active.
Next: auth and profile ownership checks; outbox retention and snapshots; reconnect Flutter consumer; transactional integration with existing event_ledger_schema.sql; reliable idempotent broadcast.
