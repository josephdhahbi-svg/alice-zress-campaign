# 25 practical GitHub uses for Alice Z'ress

## Planning and organization
1. Folder taxonomy: ten trilogies, thirty books, lore, data, game, tests, assets.
2. Commit history: audit every change.
3. Branches: prototype alternate plotlines safely.
4. Pull requests: review canon-sensitive changes.
5. Issues: track unresolved continuity problems.
6. GitHub Projects: roadmap and milestones.
7. Markdown: readable narrative and notepad master files.
8. Mermaid: render character relationships and chronology.
9. JSON: machine-readable world records.
10. CSV: Excel-friendly exports.

## Building
11. Python: spreadsheet and reference-book generation.
12. Actions: run validations automatically.
13. Tests: regression checks for choices, spells and quest gates.
14. Timeline checker: identify impossible DR-date combinations.
15. Relationship checker: find broken cross-references.
16. HTML: interactive story scenes.
17. GitHub Pages: publish browser builds after approval.
18. JavaScript: state, dice and battle logic.
19. Monte Carlo simulation: test encounter outcomes.
20. Procedural content: generate maps and encounters from seeded inputs.
21. SVG and graphics: render maps and diagrams from structured sources.
22. Save-state schemas: persist decisions, inventory and quests.
23. Git LFS: store large art/media where needed; avoid unnecessary repository bloat.
24. Releases: package playable builds and exported artifacts.
25. Changelog and documentation: make historical revisions auditable.

## Recommended operating model
**Single source of truth**: versioned JSON/Markdown records with stable IDs, links and citations.
**Derived outputs**: XLSX/CSV, diagrams, printable reports, game UI and statistics are regenerated from those records.
**Verification**: record provenance and DR dates; flag unknown dates, don't fabricate them.
**Safety**: this repository was public at last check. Do not upload full unpublished manuscript/notepad archives or private files until repository visibility is intentionally reviewed.
**Scope**: GitHub hosts code and versions; it does not itself generate images, research canon, or perform simulations without scripts and services.

## Audited material (local working files; not uploaded)
- Universal Chronology Tracker: 10 sheets including Cast & Deities, Spells & Powers, Items & Artifacts, Rituals & Ascensions, Monsters & Champions, Locations & Events, Quests & Rewards, Continuity Ledger and prior CSV.
- Campaign Notepad: roughly 5,600 lines.
- Trilogy master draft and master v1.1: roughly 5,800–6,000 lines each.
- Historical chronology CSV and policy Markdown.
- Existing repository: structured starter JSON, continuity rules, validator and choice prototype.

## Migration policy
1. Preserve originals untouched.
2. Create an inventory with file name, type, source, size and content hash.
3. Identify duplicate and conflicting versions.
4. Extract stable canonical entities into structured data only after review.
5. Generate spreadsheet views from structured data.
6. Validate references, chronology and homebrew status.
7. Publish only approved text/art and game assets.
