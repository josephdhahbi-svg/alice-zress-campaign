# Moonveil Canon-First Transportation Network — Phase 1
Date: 2026-10-15
Status: design-only; no player saves or routes unlocked.

## Existing baseline
30 book slots in 10 trilogies and 7 planned traversals. Book titles and chronology remain unassigned in the atlas. All-book transportation/mail inventories are templates, not operating services. The Waterdeep-to-Dagger Falls stagecoach is a homebrew proposal, not a confirmed through-service.

## Directed network schema
Location: stable location ID, name, plane, setting, region, map reference, DR start/end, canon status, source citation, verification.
Route: route ID, origin/destination location IDs, direction, transport mode, operator, DR availability, source and edition/page, canon status, operational status, prerequisites, check requirements, hazards, duration, fare, capacity, player-choice gate.
Operational statuses: proposed, source_verified, operational, seasonal, disrupted, blocked, historical_only, retired.
Traversal requires source-verified operational route, chronology match, satisfied requirements and authorized player choice. Never infer reverse routes. Unknown dates, operators, fares, and road existence remain unknown, not invented.
Mail can use eligible operating physical transport edges or separately verified magical communication channels.

## First research areas (candidate nodes, NOT asserted links)
- Underdark: Menzoberranzan, Promenade of Eilistraee, Pit of Ghaunadaur. Verify geographic and historical coexistence.
- Surface: Waterdeep, Dagger Falls, Candlekeep, Elturel, Lantan.
- Netheril: distinguish -339 DR from later eras; time crossings remain locked homebrew.
- Ravenloft: Barovia and Krezk; the Mists are not ordinary road links.
- Spelljammer and Planescape: verify edition-specific cosmology and portals.

## Map production contract
Separate layers for canonical geography, proposed dashed links, confirmed operational links, blocked routes, magical gates, chronology, and courier service. A drawn line never itself establishes an operational route.
Gemini researches primary lore and map references. Copilot implements directed route models and automated tests. ChatGPT owns canon review, visual assets and integration.

## Gates
Verify sourcebook -> confirm era and place -> assess route evidence -> validate and test -> approve visual layer -> integrate. Alice Z'ress remains Level 1 in U01 Silver Courier; no choices or inventory modified.
