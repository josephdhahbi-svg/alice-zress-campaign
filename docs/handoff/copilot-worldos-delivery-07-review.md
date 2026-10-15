# Copilot WorldOS delivery — integration review 07

Status: **REVIEWED PROPOSAL; NO IMPLEMENTATION OR TEST CLAIMS**.
Source: user-pasted Copilot WorldOS Delivery (entity registry, chronology/geography validators, settlement/NPC schedules, route/postal read models, OpenAPI paths, fixtures, integration matrix). Copilot explicitly reported no repository access, tests or commits. ChatGPT independently fetched the current master handoff, `data/living_world_integration_schema_v1.json`, Living World architecture, Alice U01 contract and route planner.

## Retain / adapt / reject

| Copilot Lego | Decision | Repository contract / required correction |
| --- | --- | --- |
| Stable entity IDs | RETAIN | `entity_id`, `entity_type`, `canon_status`, `source_reference` already in living world schema; do not replace with `canonical_status: official`. |
| Expanded entity types | RETAIN AS EXTENSION | book, chapter, monster, settlement, district, building, room, vehicle, station, portal, artifact, message need schema version and explicit type review; never imply all exist in DB. |
| First-class relationships | RETAIN | Preserve directed, time-scoped `present_at`, `connects`, `unlocks`, `affiliated_with`, `depicts`, `delivers_via`; map `member` to typed faction affiliation, not free text. |
| Temporal validation C001–C009 | REVISE | Use integer DR dates/date precision and explicit timeline/traversal IDs. Death does not automatically mean nonappearance (undead, resurrection, flashbacks, echoes). Handle missing dates as unverified, never auto-unlock. Book 30 to Book 1 changes traversal ID, not historical DR. |
| Geography G001–G006 | RETAIN | Require verified planes, historical validity, directed edges and provenance; location IDs and planar membership cannot be inferred from names. |
| Settlement / building / NPC schedules | RETAIN AS HOME BREW WORLD SIM | Prosperity, security, crime and NPC schedule values are proposed, not official canon. Schedules need era, time zone/plane-local calendar, valid window, exceptions, and provenance. |
| Waterdeep–Neverwinter route | REJECT AS LIVE FIXTURE | `36 hours`, `12` cost, `85` safety, `55` story score, `available:true` are fabricated example values. Use synthetic `LOC_TEST_A` and `LOC_TEST_B` in tests; no live route unlock. |
| Postal preview | RETAIN | Require valid directed operational route or verified magical channel, sender/recipient authority, temporal availability and event-based delivery state. Risk is optional homebrew. |
| OpenAPI read-only paths | REVISE | Prefer versioned `/v1/world/...` paths; POST preview is acceptable only when stateless/read-only, authorized and rate limited. Keep errors stable. |
| Seven traversals | RETAIN | Test distinct traversal IDs and Book 30→Book 1 transition without chronology rewrite or reward duplication. |
| Authority matrix | REVISE | **Entity identity and static canon registries are not authored by Gemini's event ledger.** Event ledger is authoritative for mutable gameplay history; approved versioned source registries are authoritative for immutable definitions. WorldOS projections are rebuildable. |
| Five-option alignment | PRESERVE | Five U01 choices are player UI options, not a mechanical alignment score. |
| Art | RETAIN PLANNED ONLY | Visual Codex manifests contain planned slots, no approved image files; art cannot establish history or routes. |

## Minimum Alice vertical slice
Use `docs/architecture/alice-u01-read-only-slice-v1.md`. Display Alice Level 1, GOO Warlock, Shield/Acid Splash/Light, five unselected choices, unknown DR date and locked routes. Show placeholders for unavailable lore, postal and art data. Do not invent NPC schedules, locations, postal delivery, inventory or rewards.

## Ownership
- Gemini: secure migrations, event command service, authorization, transactional outbox, test evidence.
- Copilot: schema extensions, temporal/geographic validator fixtures, WorldOS read models, versioned OpenAPI proposals, no live state mutations.
- ChatGPT: integrate reviewed files, D&D source/chronology research, source classifications, Visual Codex art and UI, verify tests/commits.

## Next concrete implementation order
1. Validate existing source schema and registry naming; map Copilot fields to current IDs.
2. Add a small **synthetic** WorldOS continuity fixture set (not live routes).
3. Add read-only validator for temporal and geographic invariants, with negative tests.
4. Version the read API contracts; leave POST previews side-effect-free.
5. Only then connect authenticated event-ledger projections and Alice U01 UI.

No tests were executed in this intake. No new WorldOS engine or route was activated.
