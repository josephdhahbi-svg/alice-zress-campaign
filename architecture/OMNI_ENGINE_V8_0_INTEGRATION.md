# Moonveil Omni-Engine V8.0 — Integration Spec
Status: user-provided architecture proposal; staged implementation, not deployed.
Prior architecture: MOONVEIL_MASTER_DEVELOPMENT_DIRECTIVE_V1.md.
## Architecture
Flutter UI -> authenticated HTTP command API -> deterministic rules engine -> SQLite transaction and immutable event ledger -> simulation tick -> WebSocket event -> optional AI narration.
GitHub stores reviewed code/content, not executable player commands. A roll or sector move must not commit arbitrary text as an "AI-DM prompt injection" or mutate main branch.
## Required compatibility
All exported profile JSON has schemaVersion "Omni-Engine V8.0". SQLite uses WAL and foreign_keys. Flutter Provider state is a read model of authoritative game state, not source of truth. Offline-first: local command queue and SQLite ledger, reconcile with server via stable command IDs. WebSockets are delivery notifications; replay missing events after reconnect. Event IDs and idempotency keys prevent duplicate consequences.
## Security and correctness corrections to supplied prototype
- Avoid hardcoded GitHub owner/repository/token and main-branch writes; use environment configuration and least-privilege tokens only for explicitly authorized source changes.
- No GitHub prompt-injection pipeline. Narrator prompts are treated as untrusted text and cannot issue engine commands.
- Never accept rawRoll, total or critical flags as authoritative from the client. Server/engine generates and verifies rolls, validates dice and modifiers, and distinguishes natural 20/1 semantics by check type.
- POST routes require authentication, request schema validation, rate limiting, size limits and idempotency key. WebSocket subscriptions need authorization.
- SQL CHECK constraints for dissonance values 0–100; transitions event-ledgered and source attributed.
- Do not use INSERT OR REPLACE for mutable history; REPLACE can delete and reinsert rows and break provenance. Use UPSERT for content toggles, append-only for events.
- The sample Flutter ItemModel literals have unterminated string quotes. The sample inventory wrongly gives Alice legendary items. Move those to a locked catalog with owned=false; display ownership separately from library enablement.
- Level 21+ is homebrew epic play; do not treat it as official 2024 core level progression. Alice starts Level 1.
- A named 'Living Promenade' in Prime Material/Far Realm border is homebrew and not evidence of Qilue or canonical Promenade continuity.
- JSON WebSocket events: DICE_ROLL_EVENT and PLANAR_SHIFT_EVENT, with eventId, commandId, actorId, occurredAt, worldTime, payload, schemaVersion.
## Suggested tree
backend/db/{library_schema.sql,dissonance_schema.sql,omniverse_expanded_schema.sql,event_ledger_schema.sql}; backend/services/{commandEngine.js,websocketServer.js}; backend/routes/{dice.js,sector.js}; flutter_client/lib/{main.dart,services/,screens/,widgets/}; tests/.
## Minimum playable vertical slice
(1) player opens a Book 1 scene; (2) clicks one of five options; (3) engine validates; (4) transaction appends immutable event; (5) quest and relationships update; (6) world advances on tick; (7) client receives event; (8) save and replay yield same state. No AI required to complete this loop.
## Acceptance tests
Unowned artifacts stay unowned; no Wish charges spent without approved quest action; invalid moves roll back; repeated commandId applies once; no mutation from narrator; stable replay; world ticks respect DR time; offline client can resume; future L21 features stay locked.
