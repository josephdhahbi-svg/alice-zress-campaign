# Moonveil Repository Inventory
**Updated:** 2026-10-15  
**Scope:** Initial inventory from repository tree and selected source files. This is not yet a complete line-by-line audit of every file.

## Repository
- Repository: `josephdhahbi-svg/alice-zress-campaign`
- Default branch: `main`
- Project: Alice Z'ress / Elder Eye campaign, with Moonveil 30-book architecture being integrated.

## Confirmed paths inspected
| Path | Purpose | Initial finding |
|---|---|---|
| `README.md` | Project entry point | Describes 30 books, seven circular traversals, Alice, current scaffold, and offline prototype. |
| `docs/master-development-board.md` | Master project board | Links architecture, admin process, catalog, and VTT audit. |
| `docs/administration-build-operations.md` | Development workflow | Lego build method, roles, priorities, component contracts, and done criteria. |
| `docs/vtt-technical-blueprint-audit.md` | VTT target architecture | Records target Flutter/API/SQLite design and code risks. |
| `docs/architecture.md` | Architecture plan | Describes JSON records, validators, relationship graph, exports, and game engine. |
| `docs/continuity.md` | Continuity rules | Separates historical dates from campaign timestamps; requires source and availability checks. |
| `docs/story-roadmap.md` | Story roadmap | Contains a foundational trilogy naming set that must be reconciled with the newer 30-book outline. |
| `data/schema.json` | Lore record schema | Defines required metadata and allowed canon/continuity status values. |
| `data/books.json` | 30-book catalog | 30 stable book IDs created; all records pending continuity review. |
| `data/development_components.json` | Lego component registry | 12 components registered; registry is a separate JSON shape from lore records. |
| `data/characters.json` | Character records | Includes Alice and Qilué Veladorn starter records. |
| `data/locations.json` | Location records | Includes Promenade of the Dark Maiden starter record. |
| `data/rituals.json` | Ritual records | Includes homebrew Alice lich/archlich ascension entries. |
| `data/relationships.json` | Relationship graph edges | Uses subject/predicate/object fields rather than the general lore schema. |
| `data/story_phases.json` | Older story phase grouping | Uses title/order/books/status fields and a different structure from the 30-book catalog. |
| `data/spells.json`, `data/items.json`, `data/quests.json` | Starter collections | Empty or starter data; do not mistake empty files for completed systems. |
| `scripts/validate.py` | Data validator | Updated to use separate profiles for lore records, relationships, story phases, and development components. |
| `scripts/analytics.py`, `check_links.py`, `score_story.py`, `simulate.py` | Utility scripts | Present; full behavior and test coverage not yet audited. |
| `game/index.html` | Browser game prototype | Offline local-storage character/quest/choice prototype with import/export; not the proposed Flutter/backend stack. |
| `.github/workflows/validate.yml`, `analytics.yml` | CI workflows | Present; workflow configuration and run history need a separate verification pass. |

## Architectural gaps and risks
1. The newer book catalog, older story phases, and README use differing structures/titles. Keep the records, but add explicit decision links and migration rules.
2. The seven-traversal model and one 30-book closing loop are unresolved as a relationship, not automatically mutually exclusive.
3. The new component registry needs its own validation profile; it must not be treated as a lore-record list.
4. Relationship edges need validation against a unified entity index once deities, factions, locations, and other entities have stable IDs.
5. The inspected tree exposes an offline browser prototype. The Flutter client, Express backend, SQLite database, and migrations in the supplied blueprint are target architecture until located and tested.
6. The new validator has been inspected and its rules mirrored against current JSON contents through repository tool results, but the Python script itself has not yet been run in a local checkout or verified by a GitHub Actions run.

## Next inventory actions
- Inspect the full contents of every script and workflow.
- Confirm CI runs `python scripts/validate.py` and inspect the latest run result.
- Add a schema profile for each record family rather than forcing every JSON file into one schema.
- Produce a decision log for book titles, traversal structure, and level numbering.
- Test the offline prototype's save/export/import and compare its data contract with the planned VTT.
