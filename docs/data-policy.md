# Data, storage, graphics and calculations

## Source-of-truth rule
- Structured JSON is the primary editable source for game records.
- Markdown holds authored narrative, source commentary and decisions.
- CSV, XLSX, SVG, dashboards and statistics are derived from source data when practical.
- No blind merge: import each existing document with a manifest, source path and hash.

## Storage
Git tracks small source files and changes efficiently. Large art, video, audio and binary exports should use Git LFS or a suitable asset store; do not commit duplicated exports on every revision. GitHub is not a relational database or unlimited media archive. Do not store personal credentials, tokens or private information in commits.

## Graphs and math
- Python analytics creates CSV and SVG summaries.
- Mermaid shows flow and dependency diagrams.
- Simulation scripts must specify seed, model assumptions, input parameters and results.
- For D&D combat, distinguish simplified estimates from official encounter rules.

## Quality controls
- Check schemas, missing timestamps, DR continuity, cross-reference IDs and source citations.
- Label uncertain historical dates as unknown, not guessed.
- Record manual review for canon/homebrew collisions.
- Gate release publishing on successful tests and rights review.

## Publishing
Repository visibility was public at last inspection. Keep private manuscripts and unlicensed imagery out until visibility and rights are reviewed. GitHub Pages hosting is optional and must be explicitly enabled.
