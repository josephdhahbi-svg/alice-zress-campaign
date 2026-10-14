# Moonveil 100-Shop Economic Atlas — Implementation and Integration Plan v1
Date: 2026-10-14
Status: DESIGN REQUIREMENTS / INVENTORY NOT YET POPULATED OR TESTED
Targets: 25 wandering traders, 25 monstrous bazaars, 25 small/middle shops, 22 lore/canon-linked, 3 war shops = 100. These are target counts, NOT completed shops.

## Every shop record requires
shop_id; name; category; canon/homebrew and source; campaign/book/quest; era and DR start/end; plane, region, settlement, coordinates, map_id and 5-foot grid anchor; open hours and traveling route; shopkeeper ID, species, role, moral BLUE/GREEN/RED, life status and schedule; staff and customers; faction; level bracket; reputation and quest prerequisites; starting stock with item_id, source, rarity, quantity, price/currency, restock date and trigger, demand, taxes, trade route, scarcity; quest giver IDs, quest prerequisites and rewards; relationships and romance only if eligible/consensual; dialogues and five morality-labeled options; world-state clock hooks; theft/security/consequences; chronological and geographic consistency tests.

## Required level tiers (proposal, pending balance)
1-4 mundane/common/uncommon; 5-10 uncommon/rare; 11-16 rare/very rare conditional; 17-20 very rare/legendary as quest-earned or restricted stock; epic 20+ custom and earned only. Never sell locked endgame divine treasury artifacts as ordinary starting goods. Official rarity separate from color labels. No automatic item availability solely by level.

## Integration
- Attach each shop to a verified map node and travel network.
- Shops respond to refugees, cult corruption, trade disruptions, wars and NPC death.
- Inventory and price snapshots are date/quest dependent, not global constants.
- Quests link both ways: shop -> giver -> mission -> world flag -> restock/closure/migration.
- Pre-BG3 vs post-BG3 NPC presence gated by DR chronology and user heroic continuity.
- Track source license; original Moonveil assets and dialogue.
- Preserve independent Seralyth/Alice world states except explicitly authorized crossover.
- UI: shop screen with inspect, compare, buy, sell, stock counts, prices, restock clock, quests and merchant reputation.

## Verification plan
A01 IDs unique and 25+25+25+22+3 distribution exactly 100 when populated.
A02 Every record has location/map/date/level/merchant/quest hooks.
A03 Inventory legal and never grants locked rewards.
A04 Prices and quantities conserved on buy/sell; no duplication on reload.
A05 Time advances and restock triggers exactly once.
A06 Merchant NPC cannot appear after confirmed death or across impossible planes.
A07 Quest state changes shop availability and map marker.
A08 Mobile interaction test, save/quit/reload, merchant dialogue choices.
A09 BG3-like merchant feel comparison: visuals, inspect, trade, consequences.
A10 Human playtest and evidence-backed score.
None of these tests have been executed. First milestone: populate 10 fully grounded shops for Book I and wire into The Unheard Bell before scaling to 100.
