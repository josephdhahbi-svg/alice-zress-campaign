# Books 1–3: route atlas and continuity gates
Status: PROPOSED / UNPLAYED. Date: 2026-10-15. No player state changes.
## Mapping assumption
Working hypothesis Book 1 Underdark, Book 2 Abyss, Book 3 Avernus. Confirm numbering with 30-book canonical roadmap before locking. Planar geography is not a literal continuous road; portals, spells and story gates connect planes.
## Book 1 — Underdark
Hubs: Menzoberranzan (drow politics, hostile Lolth institutions), Eilistraeen refuge (location/date needs verification), Sloobludop (kuo-toa, Out of the Abyss), Gracklstugh (duergar trade), Neverlight Grove (myconid ecology), Blingdenstone (svirfneblin), Mantol-Derith (cross-faction trade), an original illithid observatory (HOMEBREW).
Route U01: Menzoberranzan outskirts -> Eilistraeen safehouse, secret tunnel; gated by guide or intelligence; patrol danger; nonviolent disguise alternative.
U02: Safehouse -> Mantol-Derith, caravan passage; gated by trade permit; drow scouts and fungus hazards; smuggler trail alternative.
U03: Mantol-Derith -> Gracklstugh, guarded deep-road; faction toll and political checks; subterranean river alternative.
U04: Gracklstugh -> Neverlight Grove, fungal trail; spores and environmental survival; myconid escort alternative.
U05: Neverlight Grove -> Blingdenstone, winding underpass; requires guide; cave collapse; abandoned mining tunnel alternative.
U06: Trade network -> original illithid observatory, psychic waypoint; requires translated map and protective ward; mental intrusion; rescue-based infiltration alternative.
All distances and travel times TBD; do not assert exact canonical adjacency.
## Book 2 — Abyss
Hubs: Demonweb Pits (Lolth, edition/planar placement verify), Endless Maze (Baphomet), Graz'zt's realm Azzagrat, Ghaunadaur-tainted planar pocket (HOMEBREW), neutral waystation (HOMEBREW). Avoid implying these layers are walkably adjacent.
A01: Underdark illithid observatory -> Abyssal border waystation, unstable keyed portal; gate: planar coordinates, stabilized by Mystra; psychic backlash.
A02: Waystation -> Endless Maze, guarded gate; gate: recovered maze token; minotaur pursuit; astral route alternative.
A03: Waystation -> Demonweb-linked frontier, dangerous one-way web portal; gate: Eilistraeen intelligence and anti-domination ward; Lolth agents.
A04: Waystation -> Azzagrat envoy court, negotiated planar transit; gate: safe-conduct; deceptive contracts; independent portal alternative.
A05: Endless Maze -> exit anchor, homebrew portal; gate: rescue captives and defeat or bypass champion; exit may lead back to Material Plane rather than Avernus.
## Book 3 — Avernus
Hubs: Elturel/Baldur's Gate narrative gateway (date and adventure continuity verify), Avernus arrival foothold, infernal war machine depot, River Styx crossing, Zariel-related redemption site. Names and specific routes should be validated against Descent into Avernus before claiming canon.
V01: Abyss border -> Blood War crossing -> Avernus foothold, high-risk portal (HOMEBREW); gate: coordinates, permission or seized key; avoids automatic direct layer adjacency.
V02: Foothold -> war machine depot, wasteland route; gate: fuel and guide; infernal raiders; stealth alternative.
V03: Depot -> Styx ferry, guarded route; gate: ferry fare/contract; memory-loss hazard; aerial passage alternative.
V04: Styx -> redemption sanctuary (HOMEBREW), celestial ward route; gate: rescue and oath; infernal pursuit; hidden shrine alternative.
## Cross-book causal chain
Alice's Eye detects traces -> observatory reveals a breach -> Abyss waystation tracks Lolth/Baphomet threats -> Blood War clues expose Avernus logistics -> redemption choices influence alliance access. Each book has return portals so the 30-book circular campaign can revisit routes in later passes. No boss loot granted automatically.
## Canon warnings
Qilue Veladorn and the Promenade must be checked against exact DR date; do not presume active status. Lolth/Ghaunadaur/Eilistraee theological tensions are narrative opportunities, not proof all avatars coexist in one place. Menzoberranzan travel to Sloobludop is not automatically a short road. Abyss and Nine Hells are distinct planes; no ordinary physical road between them. The 'Alice Gray' transcription is not a new character without confirmation.
## Data specification
Node: id, name, book, plane, region, official_source, source_edition, canon_status, earliest_availability, dr_start, dr_end, faction, npc_status.
Edge: id, from, to, method, prerequisite_ids, risk, alternative_edge_id, quest_id, dr_constraints, travel_time_tbd, canon_status.
