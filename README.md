# Alice Z'ress — The Elder Eye Campaign

An original interactive Forgotten Realms-inspired D&D campaign development project. The repository is being expanded into the Moonveil Universe: a connected 30-book story architecture, living lore database, and interactive VTT.

## Project scope
- Ten connected trilogies / 30-book working catalog.
- Seven circular traversals remain an unresolved structural decision to reconcile with the current 30-book loop outline.
- Alice Z'ress: heroic drow Great Old One Warlock, Ghaunadaur patron, Eilistraee goddess.
- 25 hero and 25 villain roster slots, cult champions, and divine mythology.
- Historical and campaign timestamps, locations, canon sources and availability checks for lore records.
- Five-choice scene design and meaningful short-, medium-, and long-term consequences.

## Start here
- [Master development board](docs/master-development-board.md) — current priorities and architecture links.
- [100-task status tracker](docs/task-status.md) — evidence-based progress and blockers.
- [Repository inventory](docs/project-inventory.md) — inspected assets and current gaps.
- [Administration and build operations](docs/administration-build-operations.md) — Lego workflow, component contract, and definition of done.
- [Project inventory](docs/project-inventory.md) — inspected repository assets and gaps.
- [100-task status tracker](docs/task-status.md) — evidence-based execution status.
- [Setup/payoff ledger](data/setup_payoffs.json) — proposed cross-book story connections.
- [Decision ledger](data/decisions.json) — unresolved structure and technical decisions.
- [VTT technical blueprint audit](docs/vtt-technical-blueprint-audit.md) — target stack and implementation risks.
- [Continuity policy](docs/continuity.md) — chronology, canon status, and source requirements.
- [Story roadmap](docs/story-roadmap.md) — earlier foundational trilogy and campaign phases.

## Data and tools
- `data/schema.json` — lore-record requirements and allowed status values.
- `data/books.json` — initial structured 30-book catalog; continuity review remains pending.
- `data/setup_payoffs.json` — proposed cross-book setup/payoff links.
- `data/decisions.json` — explicit unresolved decisions; no conflicts are silently overwritten.
- `data/development_components.json` — reusable component registry.
- `data/characters.json`, `data/locations.json`, `data/rituals.json`, `data/relationships.json`, `data/story_phases.json` — current starter lore and relationship records.
- `data/spells.json`, `data/items.json`, `data/quests.json` — starter collections.
- `scripts/validate.py` — record-family validation; run with `python scripts/validate.py`; CI status must be checked separately.
- `game/index.html` — offline five-choice browser prototype with local character/quest save and import/export.
- `.github/workflows/validate.yml` — CI validation and deterministic simulation check.

## Current implementation status
The browser prototype is local/offline and is not automatically synchronized with GitHub or ChatGPT. The Flutter + Node.js/Express + SQLite WAL architecture is a target design until its source files and tests are located and verified. The Python validator has been updated for lore records, relationships, story phases, and the component registry; check the latest GitHub Actions run before describing the validation pipeline as passing.

Historical dates, official lore facts, the relationship between the seven traversals and the 30-book loop, and the foundational trilogy title sets still require review. Book catalog entries are planning records, not assertions that every plot event is official canon or complete.

Fan-made project, not affiliated with or endorsed by Wizards of the Coast. Do not upload copyrighted book content or artwork without appropriate rights.
