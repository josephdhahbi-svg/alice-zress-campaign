# Gemini Engineering Batch 2 intake — Encounter Scaling, Crafting, Webhook Relay

Status: **REVIEWED DESIGN INPUT ONLY**. No Batch 2 source installed or executed.

## Repository audit
The user pasted SQL migration `backend/db/migrations/batch2_schema.sql`, encounter service, crafting router, webhook service and Jest integration tests. At intake, the branch did not contain `backend/db/database.js`, `backend/services/encounterScaler.js`, `backend/routes/craftingMatrix.js`, or `backend/services/webhookDispatcher.js`. Batch 1B dependency not verified.

## Lego decisions
- **Encounter scaling — retain as opt-in homebrew encounter preview.** Official monster stat blocks remain unchanged; CR is not linearly proportional to party size and the suggested AC/HP multipliers are not official D&D balancing rules. Validate finite positive party size, levels and resonance; set reasonable ceilings; calculate encounter difficulty with edition-specific rules separately. Preserve source/canon tags.
- **Crafting — retain as future transactional server-authoritative domain command.** Require authenticated character ownership, mandatory revision and idempotency key, ingredient quantity/stack validation, alignment/prerequisite checks, historical era, location and quest eligibility, unique reward rules, event ledger and outbox in the *same* transaction. Do not accept arbitrary client resource values. No automatic Alice reward.
- **Webhooks — retain as asynchronous outbox integration, not unrestricted remote posting.** The supplied dispatcher only inserts records marked `DISPATCHED` with a fake 200; no HTTP call happens. Replace with PENDING → ATTEMPTED → DELIVERED / FAILED / DEAD_LETTER state machine, destination allowlist, SSRF protection, HMAC signatures, minimal nonprivate payloads, bounded retries, deduplication and observability. Do not assume `api.chatgpt.com/webhook` is a valid ChatGPT endpoint.

## Blocking findings
1. No authorization middleware in crafting router.
2. `expectedRevision` is optional; no atomic compare-and-swap UPDATE.
3. Recipe `alignment_tier_required` never enforced; alignment choices are narrative, not automatically earned crafting tiers.
4. `COUNT(*)` inventory model assumes one row per item; stacked quantities are ignored.
5. `DELETE ... LIMIT ?` and random/millisecond identifiers require SQLite compatibility and collision audit.
6. `recipeId` inserted as crafted `item_id` instead of a defined output item identifier.
7. Hardcoded `1495 DR` ignores campaign date, timeline, plane and location.
8. No authenticated player confirmation, unique reward handling or outbox atomicity.
9. Encounter scaling can generate invalid/unbalanced AC/HP/CR; it must not mutate official creature data.
10. Webhook `DISPATCHED` is fabricated success; actual network delivery is not implemented.
11. Subscription targets lack allowlisting and SSRF protection; events may expose private character identifiers.
12. Claimed `npm test` pass has no attached logs; supplied suite depends on absent Batch 1B `createDatabaseConnection` and `runMigrations`.
13. Test fixture uses a Level 3 character with Alice-like identifier. Keep isolated synthetic test character IDs to avoid confusion with real Level 1 Alice.
14. Pasted test `target_url` is Markdown link syntax, not a plain HTTPS URL.

## Integration order
1. Merge and independently test secure Batch 1B migrations, event ledger, permissions, and isolated test DB.
2. Implement pure read-only encounter preview with official-versus-homebrew output.
3. Implement crafting eligibility preview and negative tests, no mutations.
4. Implement server-authoritative crafting command, mandatory idempotency and revision, transactional outbox.
5. Implement webhook worker only after security review and approved destination configuration.
6. Run complete test suite, capture logs, update OpenAPI and documentation.

## Required negative tests
Unauthorized craft, forged inventory, missing/stacked ingredients, negative/NaN multipliers, duplicate idempotency key, stale revision, missing alignment or quest prerequisite, wrong location or historical DR, locked recipe, no event/reward on rollback, outbox retry/deduplication, SSRF blocked, webhook never marked delivered without verified HTTP response.

No game state, private save, route, or release was changed by this review.
