# Books 1–3 development batch 2 — 2026-10-15
Status: NONCANONICAL DESIGN AND LOCAL TESTS. Alice remains Level 1; no inventory, quests, Wishes or character status changed.

## Built and tested in the working container
- 14 route nodes, 13 directed connections linking Underdark, Abyss and Avernus through explicit planar gates.
- 30 proposed missions: ten each for Book 1 Underdark, Book 2 Abyss and Book 3 Avernus.
- Canon continuity review ledger and development-only simulation scenarios.
- Python 3 stdlib validation of route IDs, prerequisites, directed reachability and quest state.
- Actual local test output: GRAPH_OK 14 13; STATE_OK locked rewards, three Wishes consumed, fusion gated.

## Proposed route nodes
Underdark: Eilistraeen Refuge (homebrew placement), Mantol-Derith, Gracklstugh, Neverlight Grove, Blingdenstone, Illithid Observatory (homebrew).
Abyss: border waystation (homebrew), Endless Maze, Demonweb frontier (adaptation, edition/plane check), Azzagrat envoy court (adaptation).
Avernus: foothold (homebrew), infernal depot (homebrew), Styx ferry (adaptation), redemption sanctuary (homebrew).

## Proposed connected route
Eilistraeen Refuge -> Mantol-Derith -> Illithid Observatory -> keyed planar portal -> Abyss border waystation -> Blood War supply gate -> Avernus foothold -> infernal depot -> Styx ferry -> redemption sanctuary.
Side routes: Mantol-Derith -> Gracklstugh -> Neverlight Grove -> Blingdenstone; Abyss waystation -> Endless Maze, Demonweb frontier and Azzagrat court.
Travel times, DR dates, exact canon placement and route permissions UNVERIFIED. Each crossing must require a key, guide, ward or quest.

## Mission design template, applied ten times per book
1. Arrival and rumors
2. Refuge and supplies
3. The hidden road
4. A faction bargain
5. A prisoner to rescue
6. The sealed archive
7. A guardian challenge
8. The missing gate key
9. The return anchor
10. The planar threshold
These are proposed narrative skeletons, not 30 fully authored adventures or played missions.

## Simulated story decision panel
Courier rescue vs Lolth patrol: Lawful Good defend openly; Neutral Good arrange sanctuary; Chaotic Good distract patrol; Utility study map and patrol routes; Action intervene immediately. All unplayed.

## Canon flags
Verify full 30-book roadmap before locking Books 1–3 mapping; Qilue Veladorn and Promenade status at selected DR; Demonweb Pits cosmology by edition; Avernus/Zariel adventure era; exact published Underdark travel distances; high-CR aberration bosses must be gated away from level-one Alice.

## Next steps
Expand each mission into a full one-shot; reconcile chronology; integrate route graph into UI; add dice-based combat tests and item data; design Ghaunadaur ring quest maps, then Mystra and Eilistraee. No GitHub files should be treated as proof of a complete two-hour background run.
