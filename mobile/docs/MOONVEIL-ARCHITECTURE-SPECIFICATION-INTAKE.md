# Moonveil Universe — Architecture Specification Intake

Status: **PROPOSED / NOT YET IMPLEMENTED**
Source: user-supplied consolidated architecture specification, 2026-10-14.
Scope: 30-book Moonveil campaign ecosystem.

> Important: this file records the intended architecture. It does not claim that every table, service, Flutter widget, Kubernetes resource, backup, monitor, or CI/CD pipeline currently exists in the repository.

## Target architecture

High-performance, offline-first, cross-platform RPG ecosystem.

- Flutter client.
- Local SQLite with FTS5.
- Transactional outbox synchronization.
- Proposed Node.js / Express / Socket.io backend.
- Proposed Kubernetes deployment.
- GitHub Actions CI/CD.
- Proposed better-sqlite3 server-side persistence/backup tooling.
- Proposed Prometheus/Grafana observability.

## 5W1H world-state ledger

Proposed table: `world_entities_5w1h`

Core fields:
- entity_id
- entity_name
- campaign_book_number
- status
- who_actor
- what_action
- where_location
- when_epoch
- why_motivation
- how_method
- metadata_json
- updated_at

Proposed FTS5 index: `world_entities_5w1h_fts` across identity and 5W1H narrative fields.

### Integration with current Moonveil trackers

5W1H should become a common query layer over:
- Character Tracker
- Story Tracker
- Artifact Puzzle Tracker
- Map/Road graph
- WEB / WEAVE / LIGHT
- Economy Ledger
- History/chronology
- Monster migration
- Document/scroll archaeology

A tracked event should be answerable as:
**WHO + WHAT + WHERE + WHEN + WHY + HOW + COST + EVIDENCE + CONSEQUENCE + NEXT CONNECTION.**

## City economy proposal

Proposed tables:
- `city_shops`
- `shop_inventories`
- `banking_accounts`
- `healthcare_records`

Initial shop categories supplied:
HOSPITAL | HERBALIST | ALCHEMIST | ASTRONOMER.

These should later expand through reference tables rather than hard-coded assumptions so Moonveil can support smiths, inns, temples, shipyards, booksellers, cartographers, engineers, magical services, guilds, markets and planar merchants.

Economy integration must preserve the existing Moonveil transaction-ledger requirement: every purchase, sale, toll, wage, treatment, repair, crafting expense and treasure conversion receives a transaction record and reconciles balances.

## Atomic shop purchase service

Supplied design uses a better-sqlite3 transaction:
1. fetch inventory row;
2. reject insufficient stock;
3. calculate total;
4. fetch player bank account;
5. reject insufficient funds;
6. debit player;
7. credit shop;
8. decrement stock;
9. return success/error.

### Required hardening before production
- Validate quantity as positive bounded integer.
- Resolve account identity explicitly rather than assuming `owner_id = shopId`.
- Add transaction/receipt ID.
- Record price-at-purchase.
- Record before/after balances.
- Add idempotency key for synchronized retries.
- Add audit/event row.
- Define concurrency/version semantics.
- Connect to offline outbox and server acknowledgement.
- Preserve item provenance for unique/artifact items.
- Never treat priceless artifacts as ordinary shop inventory without explicit story rules.

## Flutter target components

### MoonveilSyncEngine
Offline SQLite outbox; connectivity detection; in-flight locking; Socket.io transmission; `sync_ack` purge.

### WorldState5W1HScreen
Searchable 5W1H world ledger.

### CityEconomyScreen
Municipal services, shops, banks and economic information.

### ShopCheckoutBottomSheet
Quantity adjustment, live totals and purchase submission.

### Existing tracker UI that must join this architecture
- Characters: who is still on the board.
- Story: active/dormant/resolved narrative threads.
- Artifact Puzzles: discovered knowledge vs hidden GM truth.
- Maps/Roads: physical, planar and historical movement.
- Documents/Scrolls: papers and evidence left by prior adventures.

## DevOps target

Proposed GitHub Actions:
- backend Jest tests;
- native better-sqlite3 build/test;
- Flutter unit/integration tests;
- container build;
- staging rollout;
- production rollout with explicit safety gates.

Proposed Kubernetes:
- backend workload;
- persistent storage;
- scheduled SQLite hot backups every six hours.

Proposed monitoring:
- Prometheus metrics;
- Grafana dashboards;
- PVC utilization alert above 85%;
- backup CronJob health.

## Architecture caution

The current Moonveil project has been developed primarily as an offline Flutter/SQLite game. The Node/Express/Socket.io/Kubernetes layer supplied here is a **target architecture proposal**, not automatically a replacement for the offline-first core.

Design principle:
**Single-player/offline gameplay must remain functional when every remote service is unavailable.**

Remote infrastructure should add synchronization, backup, shared-world or administrative capabilities without making core campaign play dependent on a server.

## Connection to persistent universe archaeology

The 5W1H ledger should eventually store adventure footprints and historical evidence:
- who left an item;
- what happened;
- where it was abandoned;
- when it occurred;
- why it mattered;
- how it reached its later location.

This lets a scroll written during the Avatar era, damaged during the Spellplague, sold in Waterdeep, transported to Avernus and rediscovered in a later adventure remain one queryable object with a complete custody/history chain.

## Implementation states

Every architecture component should use:
**PROPOSED -> SCHEMA-DESIGNED -> IMPLEMENTED -> MIGRATED -> TESTED -> INTEGRATED -> PLAYTESTED -> PRODUCTION-READY**

Never promote a component merely because its specification exists.
