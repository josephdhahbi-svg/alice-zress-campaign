# Moonveil Universe — Architecture Specification Intake

Status: **PROPOSED / NOT YET IMPLEMENTED**
Updated source: user-supplied master specification, 2026-10-14.
Scope: 30-book Moonveil campaign ecosystem.

> This records intended architecture and candidate encounter data. It does not claim the listed schemas, backend, vector synchronization, UI, Kubernetes resources, monitoring, or Book 30 mechanics are implemented or canonized.

## Target architecture
- Flutter offline-first client.
- Local SQLite + FTS5.
- Transactional outbox over Socket.io.
- **Vector clocks / causal consistency proposal.**
- Proposed Express.js + better-sqlite3 backend.
- Proposed Kubernetes deployment.
- Proposed Prometheus/Grafana monitoring.

Core design law: **single-player/offline gameplay remains functional when all remote services are unavailable.**

## Proposed database additions

### world_entities_5w1h
Tracks entity identity, book, status and WHO / WHAT / WHERE / WHEN / WHY / HOW plus metadata and timestamps.

### district_state_modifiers
Proposed fields:
district_id; district_name; active_crisis_type; economy_price_multiplier; hospital_sanity_multiplier; updated_at.

### city_shops / banking_accounts / player_vital_states
City services and economy state. The supplied specification currently uses HP and a custom Sanity resource. Sanity is therefore a **Moonveil game subsystem candidate**, not a claim about core D&D rules.

### entity_vector_clocks
Proposed fields:
entity_id; node_id; logical_counter; vector_state_json; updated_at.

### sync_outbox
Expanded proposal:
outbox_id; event_type; payload_json; node_id; logical_counter; status; retry_count; created_at; updated_at.

## Vector synchronization review

The supplied `resolveConflict` function is useful as a prototype but is **not yet a true vector-clock implementation**. It compares one scalar `incomingCounter` against one stored scalar `logical_counter`. Equal scalar counters from different nodes do not, by themselves, establish vector-clock concurrency.

Before implementation:
1. Store a vector such as `{nodeA: 4, nodeB: 7}`.
2. Compare vectors component-wise to determine BEFORE / AFTER / EQUAL / CONCURRENT.
3. Increment only the local node's component for local events.
4. Merge clocks using component-wise maxima.
5. Define entity-specific conflict policies rather than generic object spread.
6. Never silently merge money, inventory quantities, unique-item ownership, deaths, quest completion, or artifact provenance.
7. Add event/idempotency IDs so retried outbox messages cannot duplicate rewards.
8. Preserve conflict records for debugging and player/GM resolution where necessary.

This is particularly important because Moonveil's persistent archaeology depends on trustworthy custody and chronology.

## Hospital/economy service review

The supplied treatment transaction:
- finds a hospital and district modifiers;
- computes price and Sanity restoration;
- checks bank funds;
- debits the player;
- credits the hospital;
- restores HP/Sanity.

Required hardening:
- explicit hospital bank account rather than assuming shop ID is an account owner;
- treatment-type validation;
- receipt/TXN ID;
- before/after balances;
- idempotency key;
- audit/event record;
- defined rounding rules;
- local/offline conflict behavior;
- campaign rules for HP/Sanity restoration and caps.

## Flutter target

New proposed screen:
### DebugSyncScreen
Developer inspector for:
- local outbox packets;
- node IDs;
- vector state/counters;
- retries;
- force flush;
- conflicts.

Production safety: destructive purge controls should be debug/admin gated and should not allow silent deletion of unsynchronized player history.

Existing target UI remains:
WorldState5W1HScreen; CityEconomyScreen; ShopCheckoutBottomSheet; Character Tracker; Story Tracker; Artifact Puzzle Tracker; Maps/Roads; Documents/Scrolls; Treasure Markings.

## Book 30 candidate integration

The supplied architecture proposes:
**Aethelgard, Arch-Architect of the Void**
candidate CR 26; HP 680; AC 22.

Candidate phases:
- Atomic Transaction Integrity / rollback;
- Sanity Corruption Aura;
- Master Ledger Purge;
- final node commitment.

This is **HOME BREW / UNBALANCED CANDIDATE DATA**, not established D&D canon and not yet the locked identity of the Patchwork Architect or final Moonveil antagonist.

The strongest concept to preserve is the **Master Ledger climax**. Instead of only four database-like nodes, Moonveil can ultimately require reconciliation of:

**WHO -> WHAT -> WHERE -> WHEN -> WHY -> HOW -> COST -> EVIDENCE -> CONNECTION -> CONSEQUENCE -> CHOICE**

That makes Book 30 pay off the actual campaign record rather than merely a programming metaphor.

## Campaign tier overlay supplied

Candidate overlay only; it does not replace the ten-trilogy roadmap:
- Tier 1 / Books 1–5 / Levels 1–4: local services and rumors.
- Tier 2 / Books 6–12 / Levels 5–10: district crises, healthcare/economy, heists.
- Tier 3 / Books 13–22 / Levels 11–16: world ledger, Void Spire ruins, observatories.
- Tier 4 / Books 23–30 / Levels 17–20+: Primary Archive, ledger re-stitching, ascension.

**Oakhaven, Void Spire, Primary Archive and Aethelgard remain candidate locations/entities until reconciled with the established campaign map and chronology.**

## Persistent-universe connection

Vector clocks are not merely backend infrastructure. If implemented correctly, they can support the campaign's fiction-facing chronology:
- which party changed an entity first;
- whether two offline campaigns made concurrent changes;
- whether a scroll was edited before or after an artifact moved;
- whether two claimed owners conflict;
- which world-state facts are authoritative vs unresolved.

Do not expose raw vector-clock mechanics as lore unless intentionally represented through the 5W1H Master Ledger, Redactor, Fate Engine, Patchwork Archive or another explicit story device.

## Implementation states

**PROPOSED -> SCHEMA-DESIGNED -> IMPLEMENTED -> MIGRATED -> TESTED -> INTEGRATED -> PLAYTESTED -> PRODUCTION-READY**

Separate campaign content additionally uses:
**BRAINSTORM -> CONTINUITY-CHECKED -> SOURCE-VERIFIED -> BUILT -> SIMULATED -> AUTOPSIED -> CANONIZED**.
