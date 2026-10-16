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

All HTTP routes require `Authorization: Bearer <MOONVEIL_DEV_TOKEN>`.
The WebSocket endpoint is `/events` and uses the development token as
a WebSocket subprotocol. This mechanism is for trusted local testing only;
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
- There is no account or character ownership model. The single token grants
  access to **all** local data and admin routes; do not expose the port publicly.
- Equipment is not yet validated against ownership, proficiency, attunement,
  slot restrictions or level prerequisites. Do not use for authoritative rewards.
- Approval is a numerical relationship tracker, **not consent**. Romance is
  never activated by the approval endpoint; separate affirmative, revocable
  narrative consent is required before romance or intimacy.
- Shrine tables are created but no attunement endpoint is exposed until
  prerequisites and deity canon are defined.
- WebSocket broadcasts do not yet filter by campaign.
- Faction and territory tables start empty until explicitly seeded.
- No Flutter application or widget files are installed yet.
- No deployment, dependency installation, end-to-end test pass, or browser
  integration has been verified.

Existing static pages and saved campaigns remain unchanged.
