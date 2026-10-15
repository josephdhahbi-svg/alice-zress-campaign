# Alice U01 — read-only Underdark vertical slice contract v1

Status: **PROPOSED UI CONTRACT; NO LIVE SAVE CONNECTOR OR PLAYER ACTIONS**.
Repository reference: `data/master_roads_atlas.json` is a seeded design graph; `data/visual_codex_manifest_v1.json` has planned assets, not published images.

## Display-only state
- Character ID: `CHAR_ALICE_ZRESS`; female drow, Great Old One warlock, level **1**.
- Patron: Ghaunadaur; Eilistraee acolyte influence.
- Three custom origin gifts: Mystra **Shield**, Ghaunadaur **Acid Splash**, Eilistraee **Light**. These are narrative/homebrew origin gifts; do not infer ordinary spell-slot costs or extra feats from this display contract.
- Save marker: `U01_SILVER_COURIER`. Safehouse/courier/refugee/medicine context is a campaign scenario; historical DR date remains **unknown** until verified.
- Choice status: **none selected**. Five visible options in order: `LAWFUL_GOOD`, `NEUTRAL_GOOD`, `CHAOTIC_GOOD`, `UTILITY`, `ACTION`.
- Routes: display `locked` or `unverified` with explanations; do not expose a travel action without an approved temporal/route evaluator.
- Art: use only `ART_ALICE_L1_PORTRAIT_V1` as a **planned slot**, never claim the image file exists; fallback to a labeled silhouette/placeholding card.

## Safe read model
```json
{
  "schema_version": "1.0",
  "status": "DESIGN_ONLY_NO_LIVE_SAVE",
  "scene_id": "U01_SILVER_COURIER",
  "character": {
    "character_id": "CHAR_ALICE_ZRESS",
    "level": 1,
    "class": "Great Old One Warlock",
    "species": "Drow",
    "origin_gifts": ["Shield", "Acid Splash", "Light"]
  },
  "historical_context": {"dr_year": null, "date_precision": "unknown"},
  "choices": [
    {"id": "LAWFUL_GOOD", "selected": false},
    {"id": "NEUTRAL_GOOD", "selected": false},
    {"id": "CHAOTIC_GOOD", "selected": false},
    {"id": "UTILITY", "selected": false},
    {"id": "ACTION", "selected": false}
  ],
  "art_asset_id": "ART_ALICE_L1_PORTRAIT_V1",
  "art_state": "planned",
  "mutates_game_state": false
}
```

## Implementation gates
1. Resolve the authoritative U01 state source and validate ownership; the above is **not** a database snapshot.
2. Verify source/edition and DR chronology before rendering location-specific historical assertions.
3. Build accessible, responsive five-option choice cards as **disabled preview** until a server-authoritative choice command is ready. No accidental selection on view.
4. Do not conflate choice categories with a mechanical alignment score.
5. Test read-only purity, no reward/level mutation, five-option order, locked route gating, absent art fallback, and unknown-date rendering.
6. All live UI reads must use versioned projections, not direct writes to character tables.

## Integration ownership
Copilot: typed UI/read-model and continuity fixtures. Gemini: authenticated projection endpoint and eventual command service. ChatGPT: integration, canon checks, art production, and final review.

No code deployment, actual illustration, route unlock, or save mutation is asserted by this document.
