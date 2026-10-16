# Moonveil backend security gate — 2026-10-15

## Verified regression result
Commit `11c41d871a492f4cb9e15c79526e1815d7c00c24` adds integration assertions that a campaign member cannot read or append events to another campaign and that a reused event ID with a changed payload yields `IDEMPOTENCY_CONFLICT`. GitHub Actions validation run [38845612687](https://github.com/josephdhahbi-svg/alice-zress-campaign/actions/runs/38845612687) concluded **success**. This verifies the assertions in the current local development server, not a production deployment.

## Remaining security blockers (P0 before public hosting)
1. **Shared token and spoofable actor header.** The server uses `MOONVEIL_DEV_TOKEN` for all HTTP clients and accepts `X-Moonveil-Actor` as a caller-supplied identifier. Campaign membership checks therefore do **not** establish cryptographically authenticated individual identity. Never expose this server to untrusted users.
2. **WebSocket cross-campaign broadcasts.** The `/events` endpoint accepts the shared token as a WebSocket subprotocol and `broadcast()` sends campaign events to every connected client. Do not describe WebSocket notifications as campaign-isolated.
3. **Non-journaled side-effect endpoints.** Equipment and companion approval endpoints are not yet bound to campaign membership or append-only campaign revisions.
4. **No verified end-to-end chat integration.** ChatGPT and the website do not yet share an authenticated, tested game session.

## Safe implementation sequence
- **Gate A:** Add server-verified per-user session identity; derive actor ID from the authenticated session rather than request headers. Preserve the existing local development mode only behind explicit loopback-only configuration.
- **Gate B:** Authenticate WebSocket sessions using short-lived, scoped credentials and subscribe only to campaigns where the authenticated user is a member. Test that a second campaign receives zero private events.
- **Gate C:** Route inventory, romance, scene and combat mutations through atomic campaign transactions with idempotency keys and expected revisions.
- **Gate D:** Test revocation, unauthorized read/write, duplicate commands, stale revisions, reconnect, database restart, and backup restore. Require green CI before calling these gates DONE.

## Status
- Cross-campaign HTTP journal tests: **VERIFY / CI PASSED**.
- Individual identity and WebSocket campaign isolation: **NOT IMPLEMENTED**.
- Production-ready multiplayer: **BLOCKED**.

This record is an evidence-based security assessment, not a claim that the P0 work is implemented.
