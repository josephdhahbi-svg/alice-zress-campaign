# Copilot LEGO Master Bundle — WorldOS Field Mapping Review v1

Status: **REVIEWED PROPOSAL; fixture-only; no schema migration applied**.
Reviewed on branch `dev/alice-three-chosen-roadmap`:
- `data/living_world_integration_schema_v1.json`
- `data/master_roads_atlas.json`
- `tests/fixtures/copilot_lego_master_bundle_v1.json`
- `tests/test_copilot_lego_master_bundle.py`

## 1. Fields reusable unchanged

The bundle's `canon_status` values are compatible with the existing enum: `official_verified`, `homebrew_approved`, `crossover_approved`, `unverified`. The bundle currently uses `unverified`, which is appropriate for synthetic proposals.

These fields align by name with `living_world_integration_schema_v1.json.shared_fields` when present at the top level:
- `entity_id`
- `entity_type`
- `canon_status`
- `source_reference`

The following are semantically reusable but currently nested under `temporal`; the current shared contract expects flat fields:
- `temporal.timeline_id` → `timeline_id`
- `temporal.dr_start` → `dr_start`
- `temporal.dr_end` → `dr_end`
- `temporal.date_precision` → `date_precision`

Do not flatten them silently in the fixture; use an explicit projection/adapter or reviewed migration. `temporal.traversal_id` is campaign traversal metadata and is not in the current shared-fields list; keep it in a traversal-specific extension or extend the schema deliberately.

## 2. Bundle-to-WorldOS mapping

| Bundle record | Existing model | Reuse / gap |
|---|---|---|
| Milestone | Closest existing type: `event` | `milestone` is not in current `entity_types`. Either model a milestone as an `event` with a milestone subtype in extensions, or add `milestone` through a reviewed schema version. Never interpret these records as completed gameplay events. |
| Book | `data/master_roads_atlas.json.books[]` | Reuse `book_id` (B01–B30), `title`, and sequence concepts. Atlas currently uses `trilogy_id`, `sequence`, `chronology`, `entry_routes`, `exit_routes`, `location_ids`, `character_ids`, `faction_ids`, `source_status`. Bundle instead uses `entity_id`, `book_number`, `tier`, `pass_tier`, `hazard_refs`, `route_refs`, and nested `temporal`. Adapter required; do not replace the atlas. |
| Hazard | Closest: `event` or domain-specific extension | `hazard` is not in current `entity_types`; add as a versioned extension/type only after review. Current hazard records are reference stubs, not rules/stat blocks. |
| Patch | No first-class patch type in the shared schema | Keep in the fixture-only patch contract until Gemini's append-only event envelope and expected-version command are reviewed. Never store a patch as a mutation of a world entity. |
| Connection | Existing `relations[]` concepts | Reuse relationship semantics such as `present_at`, `connects`, `unlocks`, `affiliated_with`, `depicts`, `delivers_via` when appropriate. Bundle's `from_entity_id`/`to_entity_id` differ from schema's `from`/`to` relation descriptor; an adapter is needed. Require both target entities to exist before integration. |
| Route | `master_roads_atlas.json.routes[]` | Atlas requires `origin_location_id`, `destination_location_id`, `travel_mode`, `prerequisites`, `time_window`, `source_status`, `player_choice_required`. Bundle route records use null endpoints and omit several required atlas fields. Keep them as locked route proposals until filled from evidence. |
| Status | Shared `canon_status` plus domain availability | Bundle `workflow_status` and `record_status` are extra fields, not replacements for canon status. Keep workflow, canon, and route availability separate. |
| Version | No universal record version listed in shared fields | `schema_version` is reusable as schema metadata. `record_version` and patch base/new versions need a versioned record/patch contract and concurrency service. |
| Extensions | Not a named shared field currently | `extensions: {}` is a useful additive convention, but requires a documented policy and validation to prevent protected-field override. |

## 3. Fields likely to require a schema revision or adapter

Do not migrate until the contract owners agree. Likely additions or formalization:
- Add or explicitly subtype `book`, `milestone`, and `hazard` (current `entity_types` does not list them).
- Define a first-class patch proposal/event contract and record-version semantics.
- Define a normalized connection instance schema referencing two registered entity IDs.
- Define `workflow_status`, `record_version`, and `extensions` semantics separately from canon/availability status.
- Define how `tier`/ `pass_tier` map to the 10-trilogy / 30-book roadmap. These are not traversal IDs.
- Add/define `hazard_refs` only after target IDs are registered, or retain unresolved references explicitly.
- Route records need atlas-required endpoints, mode, prerequisites, time window, source status, and player-choice requirement before they can enter the route atlas.
- Define source citation fields more granularly (source title, edition, page/section) if the project wants audit-grade canon evidence; `source_reference` alone does not enforce that structure.

## 4. Target-resolution plan

1. Build an ID inventory from authoritative registries and the fixture bundle.
2. Classify each reference as registered, candidate, or missing.
3. Never auto-create a canonical entity solely because an ID is referenced.
4. Create missing hazard targets as `unverified` reference stubs only in a separate candidate registry, with no mechanics and no gameplay activation.
5. Resolve deity/location targets against source-backed registries; do not use labels such as `deity_alustra`, `transit_nodes`, or `astral_sea` as proof of a verified entity.
6. For routes, require registered origin/destination IDs, a verified connection, availability window, travel mode, prerequisites, and an explicit player-choice requirement.
7. Reject route activation while source status is `unverified`, endpoints are missing, or historical availability is unknown.
8. Keep all 9 connections `integrated: false` until endpoint resolution and source review complete.
9. Keep all 9 patches `applied: false`; accepted patches require Gemini's authorized command, expected-version compare-and-swap, and append-only event.
10. Record each resolution as a reviewable patch; do not overwrite old evidence.

## 5. Additional negative tests recommended

1. Duplicate `entity_id` across milestones, books, and hazard stubs.
2. Duplicate `patch_id` or replayed idempotency key.
3. Patch `expected_base_version` mismatch.
4. Patch `new_version` not greater than base version.
5. Patch field path attempts to modify `player_state`, `inventory`, `xp`, `rewards_granted`, or `route_unlocks`.
6. Patch tries to set an unverified route `traversable: true`.
7. Connection source missing.
8. Connection target missing.
9. Connection endpoint exists but is wrong entity type (e.g., route connects to a hazard where a location endpoint is required).
10. Connection uses invalid canon status.
11. Unknown date paired with non-null DR date.
12. Book number and book ID disagree (e.g., number 2 but B03).
13. Tier/pass_tier outside 1..3 or tier inconsistent with book number.
14. A traversal ID is inferred from tier/pass_tier.
15. Milestone is mistakenly inserted as a completed gameplay event.
16. Route lacks endpoints, travel mode, time window, or player-choice requirement.
17. A referenced hazard is silently auto-promoted from stub to authoritative entity.
18. An asset reference changes route availability.
19. A stale patch retries after another version has been accepted.
20. A failed transaction leaves a patch event without the corresponding version transition, or vice versa.

## 6. Alice and campaign safeguards

- The fixture milestone list is not permission to advance Alice. Level 5–30+ records are future narrative proposals only.
- Alice remains Level 1; Shield, Acid Splash, and Light remain the custom origin gifts; five U01 choices remain unselected.
- Three book tiers are separate from seven traversal cycles.
- The 30 bundle titles are campaign-proposed titles, not automatically official published adventure titles.
- No routes are traversable from this bundle.
- No gameplay ledger events are created by fixture validation.

## Decision

**Reuse the existing shared fields and canon-status enum. Use an adapter for nested temporal metadata. Defer schema migration until Copilot maps its actual WorldOS records and Gemini confirms the patch/event contract.** The bundle is valid as a synthetic test input, not ready for promotion into authoritative production registries.
