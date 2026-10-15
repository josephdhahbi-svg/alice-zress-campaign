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

## 2026-10-15 continued: automated tests and event ledger
- `a79b0f7` added `tests/test_temporal_route_planner.py` with seven unittest methods for directed routes, locks/disruptions, DR windows, missing events, player confirmation, character restrictions, forbidden events, and unknown locations. **Tests committed, NOT executed on a full checkout.**
- `d80daf7` added `docs/architecture/immutable-event-ledger-v1.md`, a proposed append-only event ledger across DR chronology, campaign tick, timeline, and seven traversals. This is a design, not an operational database.
- `4f8e155` registered `data/temporal_route_scenarios.json` in `scripts/validate.py` to prevent false registry errors.
- Run: `python scripts/validate.py`; `python scripts/validate_netheril_routes.py`; `python scripts/validate_temporal_scenarios.py`; `python scripts/route_planner.py --demo`; `python -m unittest discover -s tests -v`. Do not claim these passed until executed.
- The route planner remains a static same-DR-year planning prototype, not a departure/arrival-time-aware transport solver. Before production, require explicit `continuity_review=approved` and allowlisted `source_status` rather than merely excluding some values; test unknown status fail-closed.
- Source-verification priority: published Underdark geography and Promenade chronology; never treat visual concept route lines or fictional book assignments as canonical.

## Gemini Omni-Engine cumulative manifest intake (Parts 1–17)
- User supplied a **42-module file-path and description manifest only**, not module source code, tests, migrations, or proof of runtime operation. Do not call it 42 implemented endpoints.
- `97335b3` created `data/gemini_omni_engine_module_registry.json` listing all 42 proposed paths, engineering priority, and unverified status. `78f12a7` registered the new JSON registry in `scripts/validate.py`.
- Engineering order: P0 database/migrations, character state, saves, socket auth, backups, CI, tests, portal chronology; P1 remaining gameplay systems and visual asset integration; P2 optional world simulation.
- HOLD: `cronEvents.js`, `deploy_production.sh`, `webhookDispatcher.js`, `github_autosync.sh`, `macroAutomation.js` pending explicit security and player-agency review. `auditPurge.js` is REJECTED AS DESCRIBED: immutable gameplay audit history cannot be purged via a routine gameplay endpoint.
- The manifest asserts a universal 1495 DR epoch. **Reject universal 1495 DR assumption**: DR chronology must be per-event, with separate monotonic campaign sequence and UTC audit clock. Ancient Netheril (e.g. -339 DR) is not in 1495 DR.
- The next intake must request actual Gemini code in reviewable batches (start with `backend/db/database.js`, `backend/routes/characters.js`, `backend/routes/savestates.js`, `backend/routes/portalSync.js`, `backend/tests/server.test.js`, `package.json` and migrations). Review source before integration.
- Do not assert any of these 42 modules exist or are operational until independently fetched and tested. Existing Alice Level 1 save and all five player options remain unchanged.

## Living World Integration Layer / Visual Codex (2026-10-15)
- `37e0234`: added `data/living_world_integration_schema_v1.json` defining cross-system entity IDs, time-scoped relationships, and fail-closed availability. Design only, not runtime.
- `d5b7a7b`: added `data/visual_codex_manifest_v1.json` with four **planned** Alice/Underdark art slots and chronology/source metadata. No images are embedded in this JSON.
- `b4437bb`: added `docs/architecture/living-world-integration-v1.md` covering event-driven living-city projections and first read-only Underdark vertical slice.
- Generated one Moonveil Living World infographic in the chat. It is **concept art only**: displayed years, availability, character designs, quest names, city faction rosters, and route lines are not verified canon or gameplay data. The infographic has not been uploaded to the repository and must not be treated as an authoritative source. In particular, Alice remains Level 1 with unchosen U01 Silver Courier options; any pictured "locked" level is UI decoration, not an in-game change.
- Next: review and correct infographic factual labels before production use; execute repository validation in a checkout; register new JSON schemas in master validator; create asset metadata validators; source-check Promenade chronology and Menzoberranzan maps; implement an actual read-only location UI.

## Gemini Engineering Batch 1 + Copilot charter intake
- User supplied proposed `backend/package.json`, `backend/db/database.js`, `backend/routes/characters.js`, `backend/routes/savestates.js`, `backend/routes/portalSync.js`, `backend/tests/server.test.js`, plus a Copilot governance charter.
- Verified these six backend paths are **absent** on the working branch at intake. **No tests executed.**
- `ac19dc1` added `docs/handoff/gemini-copilot-engineering-batch-1-review.md`, with 12 integration blockers and acceptance tests.
- Do not integrate pasted routers unchanged: unauthenticated writes, client-controlled level/resources, spoofable portal keys, unsafe restores, unverified Alice 1495 DR seeding, mutable audit, missing server.js, persistent test DB, and unsupported “tests verified” assertion.
- Keep SQLite WAL/foreign keys, dependency-injected router factories, default-closed portals, transaction patterns and Copilot audit-first charter **as design inputs**.
- Next: implement a **test-only** pure domain policy + isolated SQLite migrations with authenticated, event-sourced commands and no player save writes. Require full test logs before claiming operational.

## 2026-10-15: Living World registry validation
- `1630b66` created `scripts/validate_living_world.py`, a read-only validator for the proposed 30-book/7-traversal world schema, four Visual Codex planned records, and 42 unverified Gemini modules. Does not mutate gameplay.
- `03b1a3e` created `tests/test_living_world_validation.py` with six unittest cases: current registry, unknown-date gate, duplicate asset ID, fictional asset file path, unverified module promotion, and traversal count.
- **Execution blocked:** a container `git clone --depth 1 --branch dev/alice-three-chosen-roadmap https://github.com/josephdhahbi-svg/alice-zress-campaign.git ...` failed with `Could not resolve host: github.com`. No full checkout validators or unittest run; do not claim tests passed.
- Next: run `python scripts/validate.py`, `python scripts/validate_living_world.py`, `python scripts/validate_netheril_routes.py`, `python scripts/validate_temporal_scenarios.py`, `python scripts/route_planner.py --demo`, and `python -m unittest discover -s tests -v` on a complete checkout; fix any failures.
- Build first **read-only** Alice Underdark UI; continue source-verified Visual Codex artwork, no route unlocks or Alice save changes. Gemini/Copilot new deliverables remain pending.

## Gemini Engineering Batch 2 intake (2026-10-15)
- User supplied source proposal for `backend/db/migrations/batch2_schema.sql`, `backend/services/encounterScaler.js`, `backend/routes/craftingMatrix.js`, `backend/services/webhookDispatcher.js`, and `backend/tests/batch2.test.js`.
- `783bcf4` added `docs/handoff/gemini-engineering-batch-2-review.md`. All three Lego concepts are **retained for redesign**: opt-in homebrew encounter previews, server-authoritative crafting, and secure outbox webhook relay.
- Repo audit: Batch 1B database and Batch 2 service files are absent from branch. No test executed here; Gemini's “ALL TESTS PASSED” assertion has no independent evidence.
- Blocking: unauthenticated crafting, optional revision, ignored alignment requirement, hardcoded 1495 DR, unsafe inventory semantics, fake webhook HTTP 200, no actual delivery, unvalidated destinations, absent dependency API. **Do not integrate pasted source unchanged.**
- Next: implement pure read-only encounter and crafting eligibility previews, independently test them, then add mutation endpoints only after authenticated event-ledger/migration foundation. No Alice save changes or rewards.

## Batch 2 read-only previews and secure outbox contract (2026-10-15)
- `b277eaa` added `scripts/preview_encounter.py`: pure, bounded preview preserving base stats and labeling optional scaling as homebrew; no CR recalculation or gameplay mutation.
- `6dd4f50` added `scripts/preview_crafting.py`: conservative read-only eligibility for actor permissions, explicit choice, source status, DR date, time window, location, plane, timeline, quest events, level, resonance, earned alignment tier, and aggregated ingredient quantities.
- `6637eaf` added `tests/test_batch2_previews.py`: ten unittest methods for safe preview and exploit-related denials.
- `b79e728` added `docs/architecture/crafting-event-outbox-contract-v1.md`: mandatory auth/revision/idempotency and transactional crafting + secure asynchronous webhook outbox design; not implemented.
- **Tests not independently executed** in this session. GitHub file commits are verified; full checkout still needed for all validators and tests. No production server, network webhook, item grant, or Alice save mutation.
- Known prototype limitation: read-only Python eligibility trusts passed actor dict and `confirmed_choice` as input, so only a server-authoritative authenticated command handler may use it for future actual crafting. Review stricter input schema and recipe validity before integration.
- Next: run `python -m unittest discover -s tests -v` plus all validators on full checkout, fix issues, build Batch 1B event-ledger service, then implement crafting command and outbox under tests. Continue D&D canon research and Visual Codex.

## Gemini 100-item synchronization manifest review (2026-10-15)
- **Official project motto: EVERYTHING IS LEGOS.** Preserve plural spelling in future docs and instructions.
- `3267dc8` added `docs/architecture/master-100-item-audit-decisions-v1.md`, reviewing checklist items 1–75 and answering architecture questions 76–100. This is an architectural review, **not** evidence that all systems exist.
- Critical decisions: immutable gameplay events must not be purged; 1495 DR is not universal; 3000 BCE Netheril is not a verified universal era; cron world mutation, automated Git push, and production deploy remain HOLD; voice/transcripts require consent and privacy review; homebrew encounter scaling cannot silently alter official monster CR; five narrative choices are not automatic alignment scores; webhook `DISPATCHED` requires real HTTP delivery evidence.
- No tests or deployments executed during this architecture review. Continue with complete checkout tests, isolated database/ledger foundation, safe preview integrations, and Visual Codex.

## Directive 06 execution (2026-10-15)
- Verified master handoff, atlas, Visual Codex manifest, Living World validator, and Batch 2 tests by GitHub connector.
- Local full `git clone` failed: `Could not resolve host: github.com`. Therefore **zero tests executed** and no complete checkout verification. Do not claim tests passed.
- `2559a5a` created `docs/architecture/alice-u01-read-only-slice-v1.md`: design-only U01 projection, five unselected choices, L1 and custom gifts preserved, no save mutation, no route unlock.
- A concept infographic was generated in conversation only; **not committed to Visual Codex**, and its depicted test counts, file lists, repository status badges and art approval claims are **fictional placeholder text, not factual engineering evidence**. Do not use it as a report or approved asset. A verified standalone Alice portrait remains pending.
- Gemini secure backend and Copilot WorldOS implementation deliverables not supplied in this turn; no integration claimed.
- Next: actual checkout/test baseline, secure Batch 1B migrations, read-only U01 projection tests, verified standalone art, WorldOS contracts.

## Copilot WorldOS delivery 07 (2026-10-15)
- `aa21b19` committed `docs/handoff/copilot-worldos-delivery-07-review.md`: design review and field reconciliation. Copilot itself reported no repo access, tests or commits.
- No tests executed in this intake. Synthetic fixture file creation was attempted but blocked; do not claim fixture integration.
- Key fixes: preserve `canon_status`, separate static source registries from mutable event ledger, reject invented live travel metrics, support legitimate post-death appearances, retain seven traversal IDs and five unselected Alice choices.
- Next: synthetic chronology/geography fixture integration, negative tests, versioned read APIs, secure backend foundation. Motto: EVERYTHING IS LEGOS.

## Directive 08: synthetic WorldOS validation (2026-10-15)
- `c1c093b` created `scripts/validate_worldos_synthetic.py` (pure read-only chronology, directed geography, and 30-book/seven-traversal checks).
- `64a648e` created `tests/test_worldos_synthetic.py` with 10 unittest methods. A locally reconstructed matching copy was executed via `python -m unittest discover -s tests -v`: **10 passed, 0 failed**. The exact GitHub checkout was not executed.
- Full `git clone` again failed because the local environment could not resolve `github.com`; GitHub connector file fetch/create remains available.
- This synthetic validator is not a live portal authority, does not confer source verification, and does not modify Alice, unlock routes, or add event-ledger/database services.
- Copilot's reviewed proposals remain design inputs. Gemini's secure Batch 1B implementation was not supplied this turn.
- Next: run complete checkout tests when available; integrate synthetic fixture registry, strengthen input type validation, repair general `scripts/validate.py` registry handling, implement secure SQLite migrations/event ledger, build U01 read-only projection and standalone canon-reviewed art.
