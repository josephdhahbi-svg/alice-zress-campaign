# Sprint 01 — Playable Book 1 state contract

Status: PROPOSED implementation contract. Do not mark browser functionality verified until exercised.

## Source of truth
- `data/scenes.json` contains authored choices and checks.
- `data/characters.json` contains Alice's canonical character record.
- Browser-local saves are local only; do not claim cloud synchronization.
- Existing saves must not be overwritten without a versioned migration.

## State envelope (version 1)
```json
{
  "schema_version": 1,
  "campaign_id": "moonveil-elder-eye",
  "character_id": "alice-zress",
  "scene_id": "scene-book01-rabbit-hole-01",
  "hp_current": 5,
  "hp_max": 9,
  "choice_history": [],
  "journal": [],
  "clues": [],
  "flags": {},
  "inventory": [],
  "updated_at": null
}
```

## Choice resolution
1. Read the five authored choices in their declared order.
2. Require an explicit user click; do not silently choose.
3. Use the approved character modifier when available. If unavailable, block or label a provisional roll; never fabricate the modifier.
4. Append an immutable event with scene ID, choice ID, roll, modifier, DC, total, outcome and timestamp.
5. Derive clues and flags from validated consequence mappings; never invent rewards.
6. Save atomically to a versioned browser key, retaining a recovery copy of the previous save.
7. Restore and validate the state before rendering; reject malformed imports with a visible error.
8. Never advance the campaign clock, grant XP, or grant U01 packets automatically.

## Acceptance tests
- Five choices appear in lawful_good, neutral_good, chaotic_good, utility, action order.
- Only a clicked choice can change state.
- Reload restores selected choices, event history, clues, and HP.
- Export/import round-trip reproduces state.
- Corrupt save does not erase last known good save.
- Alice remains Great Old One Warlock; custom origin gifts are not silently changed to ordinary spell grants.
- Keyboard navigation works and status messages are announced accessibly.
- No local save is represented as synchronized with GitHub or server.

## Canon conflict to resolve before implementation
`data/scenes.json` currently labels Eilistraee's gift as Blade Ward while the established project decision calls it Light. Preserve the original record for review and implement the approved Light gift only after updating the canon record and regression tests together.

## Next engineering batch
1. Audit `game/book1.html` persistence behavior.
2. Audit `scripts/test_book1.py` for coverage gaps.
3. Add schema validation for the state envelope.
4. Implement versioned save/restore with recovery.
5. Add deterministic choice event tests.
6. Test import/export round trip.
7. Validate origin-gift correction against canonical character records.
8. Run GitHub Actions and browser QA.
9. Document results in `docs/task-status.md`.
10. Open PR for review; do not merge without verification.
