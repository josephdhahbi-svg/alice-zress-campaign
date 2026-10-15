# Alice Z'ress — Three Divine Armories, Item Reskins and Purification
Date: 2026-10-15
Status: design proposal recorded from user direction; inventory NOT awarded, full repository catalog NOT audited.

## User direction
Keep GitHub as the accessible source of truth. User expects >1000 campaign items overall; this is a TARGET/EXPECTATION, not a verified count. Build reusable item templates so an existing D&D item can be renamed, re-themed, illustrated and mechanically adapted, while tracking source provenance, edition, original mechanics, new mechanics, rarity and balance. Never mislabel homebrew reskins as official D&D items. Preserve previous 777 divine treasury target separately.

## Three deity armories
Deities: Eilistraee (moonlight, dance, freedom), Mystra (Weave, magic, protection), Ghaunadaur (Far Realm, ooze, eldritch). For each deity, proposed 13 core items: 1 signature artifact requiring attunement; 3 legendary; 3 very rare (purple); 3 rare (blue); 3 uncommon (green). Thus 3 artifacts + 9 legendary + 9 very rare + 9 rare + 9 uncommon = 39 core items. Plus 1 book/grimoire for each deity = 42 catalog entries (book rarities TBD, avoid double counting). Interpret 'three attuned items that are artifacts for [three deities]' as one artifact per deity, three total; user can revise.

## Vecna-inspired parallel relic sets — PROPOSED, do not overwrite already approved names
Vecna source archetypes: Eye of Vecna (sight/price), Hand of Vecna (body/power/price), Book of Vile Darkness (forbidden knowledge/corruption). These are distinct published artifacts; the divine variants below are HOMEBREW inspired by them, not literal official variants. Avoid suggesting a literal copy of original text or statistics without checking edition and licensing.
- Ghaunadaur / Gonnador: Eye of Gonnador (user-approved exact title; Eye analogue); Mark of Gonnador (user-approved exact title; Hand/body analogue); Grimoire of the Elder Eye (user-approved exact title; Book analogue). Keep the three separate, even though only ONE is assigned the armory's primary artifact attunement slot until user chooses which.
- Mystra: Eye of the Weave, Hand of the Weave, Grimoire of the Living Weave — PROPOSED names, not confirmed.
- Eilistraee: Eye of the Moonlit Dance, Hand of the Liberator, Book of Silver Song — PROPOSED names, not confirmed.
- A deity's trio of Eye/Hand/Book are NOT necessarily three artifacts each; treat Eye, Hand/Mark and Book as thematic linked relics, with rarity and attunement to be decided individually, to avoid conflict with the 1-artifact-per-deity core collection.

## Sacrificial purification system — campaign homebrew
Each divine book/grimoire can be ritually OFFERED/CONSUMED to cleanse a linked item or another deity's cursed relic, suppressing or transforming specified negative effects without stripping its positive abilities. Do NOT silently guarantee that every curse can be removed; each item needs an explicit cleanseable_drawbacks list, forbidden_drawbacks list (if any), cost, ritual prerequisites, quest outcome and balancing review. A sacrifice consumes the designated book's ritual charge, or the book itself if explicitly chosen, with irreversible confirmation and event ledger. Preserve an archival knowledge copy only if quest conditions justify it. Consider 3-way reciprocal purification and a final non-sacrificial reconciliation path so completionist collecting remains feasible. Divine themes: Eilistraee freedom/mercy, Mystra stabilization/restoration, Ghaunadaur symbiosis/mastery; the evil patron's gifts need not force evil acts.

## Core item schema
item_id, source_item_id, published_title, reskin_title, deity, slot, tier, official_rarity, custom_color, canon_status, edition, source_citation, attunement_required, attunement_slots_used, power_budget, positive_effects, drawbacks, cleansable_drawbacks, cleanse_recipe, sacrifice_item_id, sacrifice_consumed, ritual_duration, quest_id, prerequisites, discovered, acquired, equipped, purified, timeline_DR, plane, location, illustration, game_state_event_id.

## Important limits
D&D attunement ordinarily allows up to 3 items, but confirm rules/edition and artifact-specific attunement requirements. No actual item inventory count, live backend, sourcebook coverage or running game is verified from these design documents. User expects >1000 items; audit repository item manifests and imported libraries before asserting that count. Distinguish 'planned catalog', 'authored item', 'verified imported item', and 'owned'. Existing 777 divine reward catalog is a separate goal and should not be added to the 42 core armory entries without de-duplication.

## Next work
1. Inventory actual repository data and count unique items, with sources.
2. Identify official base templates, license/edition and conversion rules.
3. Author 42 unique divine item cards and consistent three-slot attunement rules.
4. Implement book sacrifice/purification logic with preview, confirmation, cost and quest log.
5. Add tests for curse removal, no duplicated rewards, book consumption, and three-slot attunement.
