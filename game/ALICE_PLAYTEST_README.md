# Alice Z'ress — Elder Eye interactive playtest

## Run

Open `game/alice-elder-eye-playtest.html` in a browser, or use a local static web server. This page is standalone HTML, CSS, and JavaScript with no build step and no external dependencies.

The original `game/index.html` remains unchanged. The playtest does not touch Vesper's campaign state or the main campaign database.

## Present features

- Four sequential, distinct story scenes: Pit of Ghaunadaur, Rabbit Hole, Hall of Infinite Doors, Elder Eye Threshold.
- Five actionable choices per scene, d20 + modifier checks, difficulty classes, persistent choices and outcomes.
- Character, quest, chronology-safe notes, log, schematic route map and spoiler-protected answer sheet.
- Local browser autosave, import/export of JSON saves, undo in the current tab, and reset.
- The game intentionally does not award magic items, grant disputed divine gifts, rewrite the historical canon or complete the official campaign quest.

## Smoke test checklist (not yet executed in an actual browser)

1. Open the file. Confirm first scene and five choices appear.
2. Select Utility. Confirm a single d20 outcome, one event and progress to scene 2.
3. Reload the page. Confirm scene 2 and event survive.
4. Enter notes and navigate away and back; confirm persistence.
5. Export JSON, reset the playtest, import JSON and confirm progress and notes restore.
6. Try to import malformed JSON and a save with a mismatched step and event count; confirm rejection.
7. Complete all four scenes; ensure no further rolls/actions can be awarded.
8. Verify on Android Chrome and a narrow viewport; ensure no controls are clipped.

## Open integration tasks

- Replace gradient placeholder with approved, correctly indexed cinematic photorealistic artwork.
- Wire this playtest into the existing navigation after checking the authoritative story file and avoiding duplicated state.
- Add automated tests that run the JavaScript and exercise save-state migration.
- Review the campaign-chronology conflict and divine gift dispute; **do not overwrite canon without creator approval**.
- Test a real mobile browser and Android build before announcing production readiness.

## Data-safety rule

The browser localStorage key is `moonveil-alice-elder-eye-playtest-v1`; the existing main game uses a separate key. This file is intentionally isolated while integration is audited.
