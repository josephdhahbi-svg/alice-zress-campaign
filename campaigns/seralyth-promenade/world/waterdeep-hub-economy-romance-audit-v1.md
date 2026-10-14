# Waterdeep Hub — Economy, Shops, Romance, Maps, Monsters, Playtest Audit
Date 2026-10-14. Status: DESIGN/STATIC REVIEW ONLY. Do not claim playable implementation, economy balance, or dice playtesting.

## Findings from current repository
- connected-world-slice-v1.json: 10 draft shops S01-S10, nine linked quests, map coordinates absent, shop prices explicitly TBD. Not a functional economy.
- promenade-living-city-cast-v1.json: 20 homebrew NPCs, 18 romance-eligible records, 6 conceptual districts; all exact home locations, DR dates and coordinate anchors TBD. Generic orientation labels do NOT establish actual lesbian romance scenes or dialogue.
- shop-atlas-implementation-plan-v1.md: 100 shops are a TARGET, not created; inventory pricing, restocks and economic test cases not executed.
- companion-romance-narrative-standard-v1.md: design only; no executable approval engine, dice logs or romance state persistence.
- Monsters: no verified current encounter-position index, CR-by-level audit or complete monster stat-block spreadsheet confirmed.

## Geography: proposed Waterdeep major hub
Waterdeep surface hub (City of the Dead, Castle Ward, Dock Ward, Trades Ward, Sea Ward, North Ward and Southern Ward where relevant) -> Mount Waterdeep / Undermountain access through Yawning Portal (route must be verified) -> Skullport -> Promenade of the Dark Maiden vicinity. Do not assume direct short walk or open route; every underground transition needs map node, travel time, hazards, toll/permit and quest flags. Promenade is canon sanctuary, NOT the invented six-district city. Proposed six-district homebrew settlement must have a distinct name, coordinates and development history, or remain a schematic design.

## Proposed Waterdeep functional districts and venues (original game additions, NOT confirmed canon establishments)
WD-C01 Dock Ward: River Lantern Tavern satellite; Maris Thorne (C14) proposed adult woman romance contact, homebrew venue; tavern dialogue and shift schedule TBD.
WD-C02 Trades Ward: Moonlit Supply Counter trade outlet, mundane gear, taxes and stock to be priced.
WD-C03 Castle Ward: civic hearings, permits, watch oversight.
WD-C04 Sea Ward: Sune-associated arts/romance festival venue; consent-first social events.
WD-C05 Southern Ward: travelers' inns and relief kitchens; safe lodging and charity quests.
WD-C06 Dock Ward: licensed/adult-only fantasy pleasure house, homebrew, no coercion or underage workers, with independent NPC agency, safety and city consequences. Sex work is background social worldbuilding; not an automatic romance unlock or explicit content requirement.
WD-C07 Yawning Portal / Undermountain: expedition gateway, verified exact route to Skullport and Promenade TBD.

## Economy acceptance and starting policy
Currency: 10 cp=1 sp, 10 sp=1 gp, 10 gp=1 pp (D&D standard). Adopt one edition for official item price baselines; do not mix 2014 and 2024 price systems unmarked. Every merchant must have inventory_id, quantity, buy/sell price, source, rarity, date/DR, tax/markup, restock, trade disruption flag, cash-on-hand and item provenance. No purchases can be simulated until actual price records and inventory exist. Gold ledger fields: event_id, timestamp, character_id, balance_before, debit, credit, balance_after, source, quest_id, merchant_id, transaction_id. Validate nonnegative funds, no duplicate sale, buy/sell anti-arbitrage, restock idempotence, quest gold reward scaling and party wealth by level. Not yet tested.

## Proposed female-female romance scene: Maris Thorne (original homebrew, pending NPC details)
Maris is an adult woman, woman-attracted-to-women (proposed explicit orientation; player choice and mutual consent mandatory), works in proposed Waterdeep tavern. First meeting choices: (1) offer help with a lost traveler (heroic), (2) ask about her favorite song (friendship), (3) respectfully ask if she'd like to share a drink after work (romantic inquiry; no guaranteed yes), (4) ask about routes to Skullport (investigation), (5) decline and leave politely (neutral). All are available as UI dialogue specs, NOT implemented. Romance starts only after mutual attraction, schedule compatibility and her independent quest. Rejecting romance does not penalize the player's standing. Other adult women can have their own distinct lesbian/bi identities, not universally playersexual by default.

## Monster registry acceptance
Per monster: monster_id, official/homebrew, edition/book/page, stat block licensing, CR, XP, initiative, AC, HP, resistances, senses, spells, loot, location map_id, 5-ft grid anchor, elevation, DR date, encounter window, faction, quest trigger, respawn rules, patrol route, balance tier, player choice consequences. Until verified, all positions UNKNOWN. No fabricated monster counts or completed monster sheet.

## Test plan: no completed run claimed
T1 Buy 5gp item with 10gp -> balance 5gp, stock -1, merchant cash +5gp.
T2 Attempt 5gp purchase with 4gp -> reject, no state change.
T3 Repeat same transaction ID -> no duplicate debit/credit or item.
T4 Finish 3xp approval event once -> +3, replay -> +0; only witnessed resolved actions count.
T5 Woman PC asks Maris on a date -> invitation, not auto-acceptance; refusal and friendship branches persist.
T6 Monster spawn must have map node, level/CR legality, clock and trigger; no phantom monster.
T7 Travel Waterdeep to Skullport to Promenade -> validated contiguous route, date/time advances, safe rest sites and route unlocks.
T8 Save/load restores money, relationships, monster positions and flags.

## Priority implementation order
1. Lock date/era, official rules edition, Waterdeep-to-Promenade route and original town name.
2. Create 10 actually stocked/priced shops and gold ledger with tests.
3. Map Waterdeep and underground travel nodes, encounter spawn table with verified CRs.
4. Implement Maris's adult women-loving-women romance, plus 4 other distinct romance paths, with consent and 5-choice interactions.
5. Run deterministic state tests and human playthrough; publish logs and scores, not estimates.
