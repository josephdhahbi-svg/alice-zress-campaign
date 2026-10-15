# Crafting command and webhook outbox contract v1
Status: DESIGN ONLY; no network dispatcher or gameplay mutation implemented.

## Server-side crafting transaction
1. Authenticate user; authorize campaign membership and ownership of actor.
2. Validate explicit player command, mandatory idempotency key and expected save revision.
3. Resolve recipe from approved registry and authoritative inventory/resources; reject unknown DR date, plane, location, timeline, status, quest prerequisites, and expired availability.
4. Verify ingredient stacks, bound/unique item restrictions, crafting time, recipe output item ID, earned features and rule edition. Five narrative choice categories are **not** a substitute for earned mechanical alignment prerequisites.
5. Atomically compare-and-swap save revision, consume resources, append immutable `CRAFT_ITEM` event with campaign tick, materialize inventory and resources, and insert a minimal outbox notification. Roll back everything on failure.
6. Repeated idempotency key returns the original outcome without re-awarding. No user-controlled resource delta or raw SQL error is returned.

## Outbox worker
- Delivery states: `PENDING`, `IN_FLIGHT`, `DELIVERED`, `RETRY_WAIT`, `DEAD_LETTER`.
- The worker reads committed outbox rows; it does not run inside the gameplay transaction.
- Destination registration is admin-only; enforce HTTPS, DNS/IP SSRF protections, explicit allowlist, payload minimization, signing, and timeouts.
- Persist attempt count, response status and last error. Never mark `DELIVERED` until a real HTTP success response is verified.
- Bounded exponential backoff and event ID deduplication. Never assume ChatGPT exposes an arbitrary public webhook endpoint.
- Private player state must not be sent to third-party endpoints without appropriate permission.

## Acceptance tests
Unauthenticated craft denied; stale revision denied; missing ingredient/stack denied; wrong DR/plane/location denied; duplicate idempotency key awards once; concurrent requests cannot both win; failed outbox insert rolls back crafting; failed HTTP request remains pending/retry; forbidden network target blocked; immutable ledger remains append-only.

The pure Python read-only previews in `scripts/preview_encounter.py` and `scripts/preview_crafting.py` are **prototypes**, not substitutes for these server controls.
