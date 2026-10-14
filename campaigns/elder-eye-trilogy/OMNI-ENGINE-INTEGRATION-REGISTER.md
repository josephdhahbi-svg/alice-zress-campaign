# Moonveil Omni-Engine Integration Register

**Status:** ORGANIZED / CANDIDATE IMPLEMENTATION MATERIAL  
**Updated:** 2026-10-14  
**Active story priority:** Foundational Elder Eye Trilogy

This register organizes imported V88-V100 code/material without allowing generated version labels to overwrite the repository's verified implementation state or the Elder Eye story bible.

## Authority order

1. Locked user decisions and Elder Eye trilogy paperwork.
2. Verified repository code on `feature/moonveil-playable-core`.
3. Official D&D lore after edition/date/location verification.
4. User-supplied homebrew/reference material.
5. Imported V88-V100 generated modules as candidate architecture.

A pasted file calling itself "production-ready" does **not** make it authoritative. Before implementation, compare database versions, migration order, table names, imports, existing helpers, and compile/test behavior.

## Imported package register

| Package | Primary contribution | Classification | Elder Eye use | Status |
|---|---|---|---|---|
| V88 | SQLite V35-V47 coordinator + Omni-HUD | candidate code architecture | schema ideas / UI grouping | HOLD FOR CODE AUDIT |
| V90 | Advanced planar quest engine | campaign-original/homebrew | later cosmic-route quest structure | REFERENCE |
| V92 | Aberrant bestiary/dossier | mixed names + homebrew mechanics | Alice MADNESS / Elder Eye aberration research | REFERENCE + LORE AUDIT |
| V95 | Demilich necropolis/soul-vault engine | mixed official names + campaign-original content | undead/ascension and soul-gem systems | REFERENCE + LORE AUDIT |
| V100 | cumulative V35-V58 Omni-Core | candidate consolidation | master schema inventory only | HOLD FOR CODE AUDIT |

## V100 schema inventory

The imported V100 package proposes these ledgers:
- V35 multiverse archive anomalies
- V36 Eilistraee apex tiers
- V37 eldritch horror afflictions
- V38 Ravenloft domains
- V39 divine patron loot vault
- V40 planar cosmology
- V41 multiversal cameos/quests
- V42 Spelljammer pirates
- V43 Alice Underdark Wonderland
- V44 Frankenstein Ravenloft
- V45 mummy lord tombs
- V46 Cthulhu Mythos
- V47 narrative tone
- V48 planar cosmology quests
- V49 advanced planar quests
- V50 Far Realm quests
- V51 aberrant bestiary
- V52 draconic hoards
- V53 pantheonic deities + duality champions
- V54 demilich soul-vaults
- V55 cult/idol treasuries
- V56 chrono-planar paradoxes
- V57 gem-draconic vaults
- V58 triple-realm mythos

These numbers are **import labels**, not approved database migration numbers, until reconciled with the live database helper.

## World-building placement

Imported systems map into the locked 15 x 15 world-building framework rather than creating a competing cosmology.

- **Far Realm / Boundary:** anomalies, Far Realm quests, aberrant bestiary, madness.
- **Astral Sea / Divine Dominions / Upper Planes:** planar quests, pantheonic authority, divine rewards.
- **Material / Underdark / Elder Eye Depths:** Alice Wonderland ledger, Elder Eye cult/treasury candidates, aberrations.
- **Shadowfell / Ravenloft:** Ravenloft ledger, Gothic systems, Frankenstein references, undead vault ideas.
- **Elemental / Lower Planes / Nine Hells / Abyss:** later-route context only while Elder Eye trilogy remains active priority.
- **Infinite Doors / Convergence:** chrono-planar and multiversal quest concepts after continuity gates are satisfied.

Every adopted record must answer: **LIGHT → STAR → COLOR → PILLAR → SOURCE → CONTINUITY → CONSEQUENCE → CALLBACK.**

## Lore/source quarantine

Do not silently promote generated claims to official canon. Examples requiring verification include:
- invented titles, realms, vaults, rewards, DCs, and monster abilities;
- crossover material such as Carcosa/Cthulhu;
- generated deity power rankings;
- altered locations/origins for official monsters or named characters;
- any DR date, divine status, planar prison, historical participant, or travel route.

Use repository canon-status values: `official`, `homebrew`, `crossover`, `mixed`, `unverified`.
Use continuity-status values: `pending_review`, `confirmed`, `contradiction`, `alternate_timeline`.

## Elder Eye extraction priorities

Only extract material that strengthens the active foundational trilogy now:

1. **Cosmology:** Far Realm/Elder Eye boundary ideas, but preserve Ghaunadaur guardrails.
2. **Bestiary:** aberration dossier structure; verify each creature separately.
3. **Quest design:** multi-stage planar/existential trial structure adapted into five-choice scenes.
4. **Progression:** soul/relic/treasury tracking as earned consequences, never starting equipment.
5. **UI/data:** reusable ledger concepts with stable IDs and consequence/callback fields.

Later Ravenloft, Avernus, Spelljammer, Cthulhu/crossover, mummy, Frankenstein, and broad multiverse material stays indexed but does not displace Book I production.

## Required normalization before code adoption

Candidate schemas are missing fields required by the campaign's continuity system. Before adoption, normalize records with:
`record_id, era, canon_date_dr, campaign_timestamp, location, plane, earliest_availability, prerequisites, duration, source, canon_status, continuity_status, consequence_now, consequence_later, future_callback`.

World-building records additionally link:
`cosmic_station, spectrum_identity, star_route, pillar_id, local_authority, opposing_power, philosophical_conflict, door_id`.

## Next implementation gate

Do **not** paste V100 wholesale into the app. First inspect the live database helper and current schema version. Then create a migration map showing:
**existing live table/version → imported candidate table → conflict → keep/merge/rename/reject → test**.

Only after that audit should code be merged and compiled.


## V101 imported package

| Package | Primary contribution | Classification | Elder Eye use | Status |
|---|---|---|---|---|
| V101 | Cthulhian Dracano-Lich apex hybrid boss ledger + proposed V59 migration | crossover/homebrew candidate | possible late cosmic MADNESS boss framework only; not foundational trilogy canon | QUARANTINE + LORE/CODE AUDIT |

### V101 handling rules

V101 proposes `cthulhu_dracano_lich_ledger` as import-label migration V59 with apex name, hybrid threat, resting domain, hazard, loot, and defeated/sealed state.

Do **not** treat its sample entities as official D&D continuity. The supplied fusions (for example Cthulhu/Sardior, Acererak/Azathoth, and Yog-Sothoth draconic forms), their realms, damage values, immunities, loot, and transformations are crossover/campaign-original concepts unless independently sourced.

For world-building, retain only the reusable structure:
**apex entity -> domain -> threat/hazard -> encounter resolution -> consequence -> reward -> future callback**.

If eventually adopted, normalize it to the campaign continuity schema and map it primarily to Far Realm/Boundary, Astral routes, Madness, Conflict/Security, Story/Myth/Theme, and Navigation/Exploration cells. It must not redefine Sardior, Acererak, Realmspace, crystal-sphere cosmology, or official Great Old One lore.
