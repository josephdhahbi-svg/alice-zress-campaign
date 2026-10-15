# Moonveil Living World Integration Layer — v1
Status: **proposed contract**, not a running engine. D&D canon first.

## One world, many systems
Use stable IDs to connect characters, locations, planes, dates, quests, event ledger, directed transport, postal services, factions, inventory, and the Visual Codex. Each module is a Lego; the shared identity and time model are its connection points.

The authoritative source of a state change is an authenticated, transactional, append-only event. Materialized views (character sheet, city status, route map, merchant stock, postal inbox) are derived from events and can be rebuilt. A visual asset is a depiction, not proof of location, route existence, or historical availability.

## Availability contract
Evaluate the actor, campaign/traversal/timeline, plane, verified location, historical date precision, existence window, completed prerequisite events, forbidden events, permission, operational status, resources, and explicit player confirmation. Unknown or unverified prerequisites **fail closed**. Preview never mutates. Expired opportunities may produce a separately authored alternate branch, never retroactive rewards.

## Example living-city causal chain (homebrew design illustration, NOT a live quest)
A caravan's arrival event may restock a merchant, deliver a letter, change faction influence, and open a rescue quest. Each consequence is a separately validated event or projection; weather delays cannot secretly override user choice. The city's visual state is rendered from a dated snapshot, not generic future art.

## Integration adapters
- Existing `data/master_roads_atlas.json` stays the route registry; do not duplicate or promote locked edges.
- `docs/architecture/immutable-event-ledger-v1.md` governs immutable audit and campaign sequence.
- `data/gemini_omni_engine_module_registry.json` is an **unverified proposal registry**, not implemented endpoints.
- `data/living_world_integration_schema_v1.json` defines entity types, relations and conservative availability.
- `data/visual_codex_manifest_v1.json` is the initial artwork queue, not actual images.
- D&D official / approved homebrew / approved crossover / unverified must be visible on all content records.

## First vertical slice
Read-only Underdark location screen with date/era and canon status, Alice Level 1 portrait slot, five unchosen decision buttons, map with unverified connections visibly locked, and a timeline panel. Do not send a choice event until the user actually selects an option. The next slice adds verified time-gated NPC arrivals and a courier, then battle-map/dice integration.

## Integration test checklist (NOT YET EXECUTED)
- A future-dated NPC does not appear in earlier eras.
- A proposed road never becomes operational through an art asset.
- One-way portal cannot be traversed in reverse.
- Two concurrent clients cannot double-award the same reward.
- A quest missed before a deadline does not grant its reward.
- A save at U01 Silver Courier preserves Alice's Level 1 and all five unselected choices.
- Unknown dates and source statuses fail closed.
- All rendered art is tied to a location/era/asset ID.

## Scope boundaries
No automatic NPC spawn, route unlock, gold transfer, spell consumption, advancement, release, or user decision. Engineering Batch 1 source code from Gemini is still pending independent review.
