# Moonveil Node VTT server — development setup

This is an **opt-in local backend prototype**, not a deployed game service.
It does not replace the existing Python SQLite campaign event ledger or browser localStorage saves.

## Start (Node 20+)
```sh
npm install
```
Set a randomly generated development token of at least 24 characters in your
shell's `MOONVEIL_DEV_TOKEN` environment variable. Never commit it.
Then:
```sh
npm start
```
Server listens on `127.0.0.1:3000`. The SQLite database defaults to
`moonveil_vtt.db` and uses WAL, foreign keys and a busy timeout.
For optional hourly faction pulses, set `MOONVEIL_ENABLE_CRON=1`.
Run only **one** cron-owning server process per database.

Admin routes require `Authorization: Bearer <MOONVEIL_DEV_TOKEN>`. A trusted local admin can issue expiring actor-bound development tokens via `POST /api/admin/sessions` with JSON `{actorId,ttlSeconds}`. Use the returned token as `Authorization: Bearer <accessToken>` on campaign event routes. Actor session tokens cannot call admin routes. An `X-Moonveil-Actor` header is ignored for actor sessions, preventing header-based impersonation. Admin-token campaign event calls still accept that header for local compatibility.
The WebSocket endpoint is `/events?campaignId=<id>` and accepts an actor session token as WebSocket subprotocol `moonveil.<accessToken>`. The server verifies actor membership and filters campaign notifications; the administrator token cannot open a campaign socket. This mechanism is for trusted local testing only;
production needs proper user identity, per-campaign authorization, TLS,
origin checks, audit logging, and WebSocket session authentication.

## Routes
- `GET /api/health` — authenticated server health.
- `GET /api/factions` — current faction influence and territory control.
- `POST /api/admin/world-pulse` — manual, idempotent UTC-hour faction pulse.
- `GET /api/war-table/overview/:bookId` — legacy war territories by book.
- `POST /api/items/equip-advanced` — JSON `{entityId,itemId,slot}`;
  stores an equipment slot for an existing catalog item.
- `POST /api/romance/approval` — JSON `{entityId,companionName,delta}`;
  delta is an integer from -20 through 20; total approval clamps to [-100,100].

## Critical limitations
- There is no account login, revocation service, or character ownership model. The local admin token can mint sessions for any actor; do not expose the port publicly. Actor tokens expire and can be revoked by the administrator or by an actor logging out. Token revocation is persisted in SQLite; periodic cleanup of expired revocation rows is not yet implemented.
- Equipment is not yet validated against ownership, proficiency, attunement,
  slot restrictions or level prerequisites. Do not use for authoritative rewards.
- Approval is a numerical relationship tracker, **not consent**. Romance is
  never activated by the approval endpoint; separate affirmative, revocable
  narrative consent is required before romance or intimacy.
- Shrine tables are created but no attunement endpoint is exposed until
  prerequisites and deity canon are defined.
- WebSocket connections are campaign-scoped and receive only committed event notices from their own campaign. The local admin can still mint any actor token; this is not a public multiplayer identity system. Legacy global faction/equipment notifications are disabled.
- Faction and territory tables start empty until explicitly seeded.
- No Flutter application or widget files are installed yet.
- No deployment, dependency installation, end-to-end test pass, or browser
  integration has been verified.

Existing static pages and saved campaigns remain unchanged.

## Campaign event API (local prototype)
- `POST /api/campaigns` — admin-only; `{campaignId,name,actorId}` creates a campaign with initial DM membership.
- `POST /api/admin/sessions` — admin-only; `{actorId,ttlSeconds?}` creates an HMAC-signed, expiring actor token (default 1 hour, max 24 hours).
- `GET /api/campaigns/:campaignId/events?after=0` — authorized member only; returns up to 100 events, a revision cursor and `hasMore`.
- `POST /api/campaigns/:campaignId/events` — authorized DM/PLAYER only; `{eventId,expectedRevision,eventType,payload}`; duplicate event IDs are idempotent only for matching actor/type/payload.

These actor sessions authenticate an **actor identifier** issued by a trusted local administrator; they do not authenticate a real-world player or establish a secure public identity provider. Existing Python event storage and browser local saves are unchanged.

## Actor token revocation
- `POST /api/sessions/logout` — actor session only; revokes its own token.
- `POST /api/admin/sessions/revoke` — admin only; JSON `{accessToken}` revokes an unexpired actor token.
- Revocations are stored as SHA-256 token hashes in migration v2. Never store raw access tokens in game data, logs, or source control.
- This does **not** implement a user login provider, rate limiting, public hosting, or scoped WebSocket sessions.

## WebSocket development example
```js
const socket = new WebSocket("ws://127.0.0.1:3000/events?campaignId=alice", ["moonveil." + actorAccessToken]);
socket.addEventListener("message", event => console.log(JSON.parse(event.data)));
```
The socket sends a `CONNECTED` acknowledgement and `CAMPAIGN_EVENT` notifications with revision numbers; clients fetch full events through the authorized HTTP endpoint. Existing localStorage saves remain separate. Token use in a subprotocol is local-development only and requires a stronger browser session architecture for public deployment.

## Reconnection and event recovery
Connect to `/events?campaignId=alice&after=<lastAppliedRevision>`. The server sends `CONNECTED` with the current journal revision. If there are newer events it also sends `CATCH_UP_REQUIRED` with the last applied revision and current revision. Fetch `GET /api/campaigns/alice/events?after=<lastAppliedRevision>` repeatedly until caught up, applying each revision once. Persist the last applied revision only after applying the corresponding event successfully. Reconnect notifications are not a replacement for the journal; always re-fetch after network loss. This does not yet synchronize browser localStorage with server saves automatically.

## Opt-in SQLite online backups
Set `MOONVEIL_BACKUP_DIR` to a writable private folder before starting the local Node server. The server then uses `better-sqlite3`'s online `db.backup()` every six hours, including committed WAL data, with 14 retained snapshots by default. Override count using `MOONVEIL_BACKUP_RETAIN` (1–1000). Without the environment variable, no background backup runs. Backups are **not** encrypted, offsite, or automatically restored; protect the directory and test restores separately. The backup timer stops on normal server shutdown. This service does not modify existing browser saves.

## Supplied LEGO bundles — review status
- Reused the online SQLite backup concept with retention, opt-in configuration, error handling and CI tests; existing migrations and authenticated WebSockets remain the source of truth.
- Rejected replacing the server with the supplied globally broadcasting WebSocket hub: that would permit unauthenticated cross-campaign event injection and leak private activity.
- Rejected the second SQL-file migration runner as a competing schema ledger; `backend/migrations.js` already tracks versioned migrations.
- Flutter speech, audio, vibration, macro pinning and ambient tracks are **proposals**, not verified working features: packages, permissions, platform support, actual assets and app wiring are not yet supplied.
- The attached TypeScript Glyph combat/robot bundle is **prototype gameplay logic**, not official 2024 D&D rules. It requires a build configuration, validation, balanced turn economy, stat-cap controls, pathfinding and tests before being attached to authoritative Alice saves. Keep Glyph provisional and Alice's established Warlock canon unchanged.
