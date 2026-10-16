# ADR-0001: One authoritative campaign state for website and ChatGPT
Status: ACCEPTED AS TARGET ARCHITECTURE — implementation pending
Date: 2026-10-16
Owners: Moonveil project / ChatGPT architecture lead
Related: Tasks 206, 211–219, 255–259, 287; DP001–DP010, DP071–DP090.

## Context
The user wants to play on the Moonveil website and directly through ChatGPT without diverging character progression or world state. Existing browser prototypes use local state. A supported, user-authorized ChatGPT integration to the game server is not yet verified.

## Decision
1. The Moonveil backend is the **only authority** for mutable campaign progress; browser and chat are clients.
2. Stable `player_id`, `campaign_id`, `character_id`, `scene_id` and `event_id` are mandatory; identifiers are not inferred from display names.
3. Each successful mutation is an atomic, validated transaction that writes an append-only event and advances `campaign_revision`. Responses return revision and event ID.
4. Client commands carry a unique idempotency key and expected revision. Replayed commands return the original result; stale revisions return a conflict and fresh state, never silently overwrite.
5. After commit, WebSocket events inform connected browser clients. Reconnecting clients fetch a snapshot and event cursor.
6. ChatGPT gameplay can write authoritative state only through an actually supported connector/action, after player consent and scoped authorization. Until then, chat-based sessions must clearly identify that their progress is not automatically synchronized.
7. Server performs dice adjudication, inventory changes, combat, quests, and progression validation; never trust client-reported rewards.
8. The browser's existing local saves must remain usable until an explicit migration and backup flow has been tested.
9. Record canon metadata separately from mutable gameplay state; avoid promoting proposals into locked canon.

## Minimal event envelope (proposed)
```json
{
  "event_id": "evt-000001",
  "campaign_id": "campaign-example",
  "revision": 1,
  "type": "CHOICE_RESOLVED",
  "actor_id": "character-example",
  "scene_id": "book1-scene-example",
  "occurred_at_utc": "2026-10-16T00:00:00Z",
  "payload": {}
}
```
This is an illustrative schema, not a live API response.

## Consequences and test gates
- Requires authentication, scoped permissions, migrations, idempotency and concurrency tests.
- Test website choice -> chat read; chat choice -> website refresh; duplicate command; concurrent revisions; disconnect/reconnect; restore from backup.
- Do not call the two-mode experience synchronized until a real end-to-end test passes.

## Rejected alternatives
- Two independent browser/chat saves: diverge.
- ChatGPT's conversation memory as authoritative database: not durable or transaction-safe.
- Client-authoritative inventory/combat updates: tampering and concurrency risks.
