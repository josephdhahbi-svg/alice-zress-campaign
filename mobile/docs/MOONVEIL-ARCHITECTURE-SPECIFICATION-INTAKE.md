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


# Ultimate Omni-Edition Intake — 2026-10-14

Status: **NEWER USER-SUPPLIED BRAINSTORM / PROPOSED ARCHITECTURE + COSMOLOGY. NOT AUTOMATICALLY IMPLEMENTED OR CANONIZED.**

## Newly proposed cosmology
- Material Realm (Books 1–12) -> proposed Netherese Cities layer -> Astral Orrery (Books 13–22) -> Primary Archive (Books 23–30).
- Six proposed Prime Architects: Vaellus/WHO, Khaenos/WHAT, Aeridia/WHERE, Chronosis/WHEN, Mystavel/WHY, Methodis/HOW.
- Proposed Great Desync and Aethelgard storyline.
- Proposed Mystryl + Vecna + Mok'slyk paradox.
- Proposed legendary item: Compilation-Eye.

These are **Moonveil-original/candidate constructs unless independently source-verified**. They do not override the established ten-trilogy roadmap, the canon-guarded Mystryl integration, the unresolved Patchwork Architect, or the Book 30 Convergence brainstorm.

The names **Khaen, Valdek, Nyx, Deep Drift** are not accepted here as verified Netherese cities. They require provenance/source review before historical placement.

## Book 30 candidate mechanics
Aethelgard remains a candidate homebrew boss:
- proposed CR 26;
- proposed HP 680;
- proposed AC 22;
- damage-over-80 rollback;
- DC 22 Wisdom / 10 Sanity-per-turn aura;
- three-round Master Ledger Purge;
- four proposed commits WHO / WHAT / WHERE / WHEN.

Before CANONIZED, reconcile this with the richer existing final ledger:
WHO -> WHAT -> WHERE -> WHEN -> WHY -> HOW -> COST -> EVIDENCE -> CONNECTION -> CONSEQUENCE -> CHOICE.

The four-node purge can therefore work as **Phase 3's emergency stabilization puzzle**, while the eleven-node ledger remains the full narrative resolution.

## Synchronization correction remains mandatory
The supplied `resolveConflict()` still compares scalar counters. It is not yet a complete vector-clock algorithm despite the specification label.

Required implementation model:
- clock = map of node_id -> counter;
- component-wise causal comparison;
- component-wise max on merge;
- explicit CONCURRENT state;
- entity-specific conflict policy;
- idempotency/event IDs;
- no generic JSON-spread resolution for gold, inventory, unique artifacts, deaths, quest completion or provenance.

## Implementation truth
This Omni-Edition block updates the **target specification only**. No database migration, backend service, Flutter debug screen, Socket.io synchronization, Kubernetes deployment, Prometheus/Grafana stack, Aethelgard encounter implementation, or new cosmology data is marked implemented by this intake.


# Ultimate Omni-Edition + 10 Trilogies & 9-Alignment Pantheon — Intake

Status: **USER-SUPPLIED ALTERNATE SPEC / BRAINSTORM. NOT AUTOMATICALLY CANON OR IMPLEMENTED.**

The supplied specification introduces:
- proposed Level 21–30 Epic Mod;
- proposed Elder Eye Audit Daemon;
- alternate three-hero structure: Kaelen Vance (Books 1–10), Lyra Nightwhisper (Books 11–20), Infinite Company (Books 21–30);
- proposed nine-alignment pantheon using Prime Architects, Elder Eye, Aethelgard, Mok'slyk and Unbound Weave;
- Book 30 seven-phase Convergence structure.

## Continuity ruling

This does **not** replace the established Moonveil 10-trilogy / 30-book roadmap or its principal cast. Kaelen Vance and Lyra Nightwhisper are retained as candidate NPCs, alternate protagonists, historical figures, or modular-campaign leads pending later placement.

The Elder Eye is **not locked as True Neutral**, a software daemon, the source of all madness, or the objective final cosmic enemy. In narrative canon its identity and relationship to Ghaunadaur/Far Realm remain deliberately unresolved. A technical service may be nicknamed `elderEyeDaemon` without proving cosmological identity.

The nine-alignment matrix is retained as a candidate symbolic/gameplay matrix, not objective divine hierarchy.

The supplied claim that Mystryl returns in Phase 5 remains a hypothesis/ending branch, not established fact. The Patchwork Architect likewise remains unresolved.

## Technical ruling

The shown `elderEyeDaemon.js` is a proposed audit service. It quarantines repeatedly failing outbox packets and checks negative scalar counters; it does not establish true vector-clock causal auditing.

The existing synchronization correction remains required:
- per-node vector maps;
- component-wise comparison;
- explicit concurrent state;
- component-wise max merge;
- entity-specific conflict resolution;
- idempotency;
- no generic merge for currency, unique items, deaths, quest completion, custody or provenance.

No code from this pasted specification is marked deployed or implemented merely by recording this intake.
