# Moonveil immutable event ledger v1
Status: architecture proposal, not implemented. Applies to 30 books, seven traversals.

## Four separate clocks
1. Historical chronology: DR year/date and precision, edition/source, and plane-local rules.
2. Campaign clock: monotonic `campaign_tick` and scene sequence.
3. Traversal: `traversal_id` 1–7 and timeline/branch identifier. Never assume Book 30 rewinds the actual historical date.
4. Audit clock: server UTC recorded timestamp, independent of fictional chronology.

## Event contract
```json
{
  "event_id": "uuid",
  "campaign_id": "campaign",
  "traversal_id": 1,
  "timeline_id": "primary",
  "campaign_tick": 0,
  "event_type": "QUEST_COMPLETED",
  "actor_character_id": "character",
  "entity_id": "quest",
  "book_id": "B01",
  "plane_id": null,
  "location_id": null,
  "historical_dr": null,
  "date_precision": "unknown",
  "occurred_at_utc": null,
  "expected_save_revision": 0,
  "prerequisite_event_ids": [],
  "source_status": "homebrew",
  "payload": {},
  "idempotency_key": "request-unique-id"
}
```
All IDs here are illustrative placeholders, not recorded events.

## Append-only rules
- Server validates permissions, actor identity, quest state, canonical time and location, and expected save revision before committing.
- Single transaction: verify prerequisites, append event, update materialized state and revision, write outbox message. Reject duplicate idempotency keys.
- Never edit or delete historical event rows. Corrections append compensating events with references to the superseded event.
- Player choice events require actual player confirmation. Rendering a five-choice UI is not confirmation.
- Read-only previews must not append events or advance campaign time.
- A missed deadline is represented as a dated expiration event, not retroactively changing the player's prior choices.
- A proposed route cannot be promoted to operational merely because an NPC, illustration or book template references it.
- A time-travel scene may change fictional chronology, but `campaign_tick` remains strictly increasing.

## Access-control and privacy
- Private character saves and player messages live outside public Git repositories.
- All writes require authenticated server authority and campaign-scoped permissions.
- Public lore, map tiles and asset manifests must not contain private correspondence.
- Preserve Alice Z'ress Level 1 and her unchosen U01 Silver Courier options.

## Next implementation checks
- Repeated request with same idempotency key grants at most one reward.
- Two clients with same expected revision cannot both win.
- Quest completed after deadline does not unlock timed reward.
- NPC cannot spawn before arrival or after departure.
- Plane and location mismatches reject actions.
- Historic Mystryl/Mystra identities are not silently conflated.
- No client-supplied resource delta is trusted.
