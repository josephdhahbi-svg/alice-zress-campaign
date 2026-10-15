# MOONVEIL — START HERE / NEXT-CHAT HANDOFF
Updated: 2026-10-15. Project owner delegates routine development and dev-branch commits to assistant; user retains player decisions, story approval, advancement, and public release authority.

## Immediate instruction to next assistant
You are project manager and developer for Moonveil Universe. **Read this file and linked source files from GitHub before editing.** Continue proactively: BUILD -> CONNECT -> TEST -> VERIFY -> DOCUMENT -> RELEASE. Do not ask the user to restate the entire project. Never imply a proposed feature is operational, or a committed script has been executed without evidence. Do not modify player saves or publish without authorization.

Repository: https://github.com/josephdhahbi-svg/alice-zress-campaign
**Working branch: `dev/alice-three-chosen-roadmap`**
Branch URL: https://github.com/josephdhahbi-svg/alice-zress-campaign/tree/dev/alice-three-chosen-roadmap
Commit new work to this branch, not the default branch. Fetch current file content and SHA before updates. Do not overwrite unrelated work.

## Primary files / folders
- `data/master_roads_atlas.json`: 30 book slots / 10 trilogies; nine provisional locations, five Netherese test characters, ten **locked** travel connections; links to infrastructure sheets.
- `data/all_30_books_transport_and_mail.json`: all 30 book-specific planning sheets; 18 travel modes, nine messaging-service categories. **Templates**, not verified routes.
- `data/book_transport_master_sheet.json`: route record template and one unverified Waterdeep-to-Dagger Falls corridor.
- `data/world_communications_network.json`: courier, Sending-style magic and future OTHLOS concept records.
- `data/netheril_route_graph.json`: six quest nodes N01–N06, five character routes, branching options; design-only.
- `data/netheril_character_travel_network.json`: character origins, arrivals and proposed exits to other adventures.
- `data/cosmic_monsters.json`: cosmic creature source audit entries.
- `data/schema.json`: schema for entity-record arrays (not infrastructure registries).
- `scripts/validate.py`: distinguishes known infrastructure registry objects from entity record arrays; full checkout execution pending.
- `scripts/validate_netheril_routes.py`: checks Netherese quest graph; full checkout execution pending.
- `scripts/route_planner.py`: read-only fewest-hop search of **operational** directed routes; includes `--demo` assertions, not yet confirmed executed on full checkout.
- `docs/living-infrastructure-operating-rules.md`: infrastructure availability, route and messaging rules.
- `docs/transport-and-messaging-design.md`: transport/mail design.
- `docs/netheril-route-network-expansion.md`: quest routing and crossover policy.
- `docs/netheril-levels-1-4-five-character-dry-run.md`: conceptual dry run, not full combat.
- `docs/moonveil-systems-consolidated-2026-10-15.md`: broader Moonveil systems, story and safety.
- `docs/cosmic-monster-codex-v1.md`: monster references and narrative tier audit.

## World design / user requirements
Build a living interconnected world across **ten trilogies, 30 books, seven circular traversals**. Every book needs an incoming/outgoing road and communications master sheet. Every character must record origin, travel path, why they arrive, departure possibilities, relevant sourcebook links, historical DR era, and continuity checks. The same locations, infrastructure and NPCs can recur in different books. Keep official published source, original homebrew, and crossover proposals explicitly distinct.

Travel types: walking, horses/buggies, wagons, caravans, railroads, subways, ships, boats, ferries, airships, flying mounts, Spelljammer vessels, tunnels, portals, teleportation, ley lines, planar/time gates. Transport network also supports commerce, trade, mail and news. Mail: physical couriers, magical messaging, and future OTHLOS. Routes can be planned, under construction, operational, disrupted, retired, locked. No invented fares or timetables. No assumed unrestricted teleportation. **Book slots are not yet assigned authoritative book titles**; do not invent mappings.

## First character/quest test area
Netherese crossroads near Dagger Falls, N01 Scholar's Letter (homebrew L1), N02 Road to Fool's Needle (homebrew L2), N03 A Point of Pride (published L3), N04 The Missing Gnome (published L3), N05 Attack of the Phaerimm (published L3), N06 Proof and the Paradox (homebrew L4).
Five **original test characters**, not earned player characters: Seralyth Moonveil Wizard (Candlekeep), Kaelis Silverstep Rogue (Waterdeep), Brinna Dawnward Paladin (Elturel), Nym Tinkerspark Artificer (Lantan), Vaelis Duskwatch Warlock (Underdark). Origins and exit links are *proposed*, require geography, era and source checks. Full edition-specific sheets and combat tests not completed.

## Alice save protection
Alice Z'ress is a female drow Great Old One Warlock at Level 1, Eilistraee acolyte, Ghaunadaur patron. Custom divine origin gifts: Shield (Midnight Mystra), Acid Splash (Ghaunadaur), Light (Eilistraee). Alice is in the Underdark U01 Silver Courier scene, with five choices awaiting **user selection**. No option selected, no automatic level gain, gear reward, travel or save mutation. Her historical vision spans Mystryl's Netheril (-339 DR) and Midnight Mystra in a later era; do not conflate deities/timelines. Alice Netherese crossover remains locked until user approval and continuity checks.

## Known technical gaps / next priority
1. Check out or fetch the current dev branch; execute `python scripts/validate.py`, `python scripts/validate_netheril_routes.py`, and `python scripts/route_planner.py --demo`. Fix any failures, record actual results. Note some other legacy data files may need explicit registry handling.
2. Populate authoritative 30-book names/sequence only after checking the user's master roadmap. Then map actual geographic anchors and DR windows book-by-book.
3. Add a machine-readable transport service graph with verified stops and bidirectional legs where appropriate, separate from mere proposed cross-book connections. Add status, operators, dates, fare, capacity, time, and hazards.
4. Implement mail routing on **operational** routes with real postal operators; no private messages in public GitHub.
5. Test and document routes for the five Netherese sample characters, then scale across books. Keep route unlocking player-controlled and backend authoritative.

## Latest known commits
- `90a3574`: read-only route planner
- `fe01cb7`: living infrastructure operating rules
- `785f432`: all 30 book transport/mail templates
- `21c5e1b`: validator support for 30-book registry
- `0dcb78d`: master atlas linked to 30-book registry
- `c8b37f7`: world communications registry
- `6c1a785`: registry-aware validator
- `694d105`: populated master atlas starter
- `1d71e2f`: Netherese character travel network
- `57d7daa`: Netherese quest graph

## New-chat paste
"Continue the Moonveil Universe project as project manager. Read `docs/handoff/START_HERE.md` on branch `dev/alice-three-chosen-roadmap` of `josephdhahbi-svg/alice-zress-campaign`. Fetch the current source files and continue building, testing, documenting and committing to that development branch. Preserve Alice's Level 1 save and all player choices. Focus on the 30-book Roads, Railways, Transport, and Messaging Atlas. Distinguish verified canon, homebrew, planned routes and operational routes. Don't ask me to repeat the project."

## Development continuation: 2026-10-15, route safety and visual atlas
- Commit `039a69827fac8f88e988ee034f032fad1e4afd05` updates `scripts/route_planner.py`: removed `allow_locked` bypass, fail-closed DR year and event checks, directed operational routes, character gates and player-choice confirmation. Local seven-case demonstration passed; full checkout integration still pending. Date windows are inclusive DR-year bounds; travel durations/schedules not yet implemented. Route source-status verification requires further refinement.
- Commit `1cba2b92e69f159f2c559e8d1af5d49e45433fbe` added `scripts/validate_temporal_scenarios.py`; it was fetched and inspected, but has not yet been run against the full checkout. Companion data `data/temporal_route_scenarios.json` was committed in `bd003a4`.
- Commit `8d2b7a7` added `docs/temporal-spatial-continuity-contract-v1.md` for DR chronology, timelines, quest deadlines, location/plane availability, and immutable events.
- Commit `612cae6` added `docs/art/alice-underdark-cartography-brief-v1.md` with art requirements and research queues.
- A first visual Underdark atlas concept was generated in chat, not yet added to GitHub. **It is illustrative and not canon-verified**; speculative route lines, distance scale, dates, book numbers, and availability labels must not enter gameplay or canonical maps. Treat as layout inspiration only.
- User prioritizes **Dungeons & Dragons canon first**, with all homebrew and crossover content labeled. ChatGPT leads artwork and integration; Gemini and Copilot contribute coding, tests, writing, and lore. Preserve user control over decisions and releases.
- Next: execute full repository validators; add temporal availability unit tests; audit route schema and source-status enum; implement immutable event ledger contract; verify geographic anchors and DR windows; produce source-checked map art; map book slots only after authoritative roadmap verification.
