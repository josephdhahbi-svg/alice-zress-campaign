# MEGA-002 — Sword Coast Five: The Second Deck

Status: **ROUGH DRAFT / PLAYTEST CAMPAIGN**
Scope: Baldur's Gate -> Sword Coast -> Underdark
Purpose: stress-test a five-character optimized party through a second connected Deck campaign while preserving dialogue, morality, professions, STEAM, side quests, treasure consequences, and cumulative character development.

## Party: PARTY-SC5
- **SC5-001 Dame Aurelia Dawnshield — TANK** — Paladin. Heavy front-line protection, interception, saves, leadership, diplomacy.
- **SC5-002 Sister Amara — HEALER** — Cleric. Healing, restoration, Medicine, Religion, Insight, community support.
- **SC5-003 Captain Elara Voss — MELEE DPS** — Fighter. Sustained weapon damage, Athletics, tactics, soldier/guard profession.
- **SC5-004 Seraphine Vale — RANGED DPS** — Ranger. Ranged pressure, scouting, Survival, Nature, navigation/cartography.
- **SC5-005 Professor Ilyra Venn — UTILITY** — Wizard. Arcana, Investigation, languages, rituals, control, technical/STEAM problem solving.

Exact subclasses, legal 2024 backgrounds, ability scores, equipment, spells, HP and AC must be finalized before observed combat statistics are treated as valid.

## Second Deck architecture
Use a separate campaign namespace so it cannot overwrite MEGA-001:
- Campaign: MEGA-002
- Dungeons: SC-DNG-001 onward
- Main quests: SC-MQ-001 onward
- Side quests: SC-SQ-001 onward
- Scrolls: SC-SCR-001 onward
- Moral decisions: SC-MOR-###-A through I
- Maps: SC-MAP-###
- Encounters: SC-ENC-###
- Combat: SC-CBT-###
- Treasure: SC-ITM/LEG-###
- Outcomes: SC-OUT-###
- Relationships: SC-REL-###

The second deck travels geographically and narratively from Baldur's Gate through the Sword Coast and ultimately into the Underdark. Do not invent exact Forgotten Realms dates or historical states without continuity verification.

## Scroll-chain law
Every dungeon contains exactly one primary story scroll.
- SC-SCR-001 establishes the mystery.
- SC-SCR-002 must directly decode, contradict, identify an author/location, or expose a missing portion of SC-SCR-001.
- Each later scroll must meaningfully connect to the immediately previous scroll and at least one earlier scroll.
- The final scroll resolves the chain.
A scroll is never filler treasure. It must alter knowledge, unlock a route, change an NPC interpretation, expose a lie, modify a quest, or affect an ending.

Schema:
`SC-SCR-### -> found_in -> refers_to_previous -> new_information -> quest_unlock -> NPC_reaction -> morality_link -> future_callback -> final_significance`

## Connected quest law
Each main dungeon quest must have:
- a cause created or revealed by the prior dungeon;
- at least one unresolved thread carried forward;
- one side quest that intersects another dungeon;
- one profession/tool obstacle;
- all five STEAM dimensions across the dungeon;
- at least one relationship scene;
- a treasure consequence.

Side quests must not be isolated errands. At least one result from SC-SQ-N must modify SC-DNG-(N+1) or later: NPC survival, map route, merchant inventory, enemy reinforcements, defenses, clue availability, prices, faction trust, boss weakness, treasure, or ending.

## Nine-choice morality engine
Important scenes present **nine genuinely different moral approaches**, not nine cosmetic dialogue phrasings:

1. **Mercy** — protect/redeem/forgive where feasible.
2. **Justice** — accountability under evidence/rules.
3. **Duty** — prioritize oath, mission, institution, or responsibility.
4. **Freedom** — preserve individual choice and consent.
5. **Community** — prioritize the many/local society.
6. **Truth** — reveal facts even when disruptive.
7. **Pragmatism** — choose the workable compromise/cost.
8. **Sacrifice** — accept a personal cost to protect others.
9. **Power** — seize/control the dangerous resource to prevent others using it.

Every option must have a plausible benefit, cost, NPC reaction, Peace/Hope/Wonder impact, relationship delta, quest flag, and future callback. “Power” is not automatically evil and “Mercy” is not automatically correct; context determines consequences.

## Five-character dialogue requirement
For each major morality scene:
- Aurelia speaks from protection/oath/leadership.
- Amara speaks from healing/faith/compassion/evidence of suffering.
- Elara speaks from tactical reality/soldier experience.
- Seraphine speaks from terrain/people/ecology/survival consequences.
- Ilyra speaks from magical evidence/history/technical consequences.
Their views can change through character development. Track disagreements and reconciliations.

## STEAM requirement
Every dungeon uses:
- Science: ecology, medicine, materials, observation, experiments.
- Technology: mechanisms, communications, magical devices/tools.
- Engineering: structures, defenses, logistics, repairs.
- Arts: music, language, culture, performance, visual symbols/story.
- Mathematics: maps, geometry, probability, measurement, optimization.

## Opening connected arc (prototype)
### SC-DNG-001 — BALDUR'S GATE: The Card Beneath the Gate
Main quest SC-MQ-001: a card-linked mechanism is discovered beneath a civic structure. Determine whether it is a weapon, lock, archive, or bait.
Scroll SC-SCR-001: **The First Fold**, a damaged message naming a coastal recipient but omitting the route.
Side quest SC-SQ-001: **The Missing Lamplighter**; rescue/investigate a worker who saw the mechanism activate.
Profession tests: guard/investigator, mason, smith, healer, cartographer.
STEAM: structural stress + arcane circuitry + evacuation logistics + mural/music cipher + load/sequence mathematics.
Treasure branches: preserve mechanism -> research key; dismantle -> rare components; surrender to authorities -> faction favor; hide it -> secret route but trust risk.
Outcome feeds SC-DNG-002.

### SC-DNG-002 — SWORD COAST: The Road Written in Salt
SC-SCR-002 decodes the missing route from SC-SCR-001 using salt-water exposure and reveals that the “recipient” is a title, not a person.
SC-SQ-002 connects the rescued lamplighter to a coastal signal network.
Choices can repair the network, expose it, commandeer it, or leave it independent. This changes navigation and reinforcements later.

### SC-DNG-003 — COASTAL RUIN: The Choir Below the Tide
SC-SCR-003 contains musical notation that completes a phrase hidden in SC-SCR-002.
Music/performance becomes a navigation and communication system rather than decoration.
SC-SQ-003 recovers missing singers/artisans; saving different groups changes which harmonies/skills are available later.
Treasure depends on whether the party restores, studies, sells, seals, or weaponizes the acoustic technology.

### SC-DNG-004 — DESCENT: The Broken Trade Road
SC-SCR-004 proves the choir's melody is a route-key into an old Underdark trade artery.
SC-SQ-004: competing surface/Underdark communities both need the road. Engineering repairs, trade negotiation, security, ecology and food logistics determine who benefits.
Nine-choice morality scene determines ownership/governance model. This materially changes prices, allies and enemies.

### SC-DNG-005 — UNDERDARK: The Market of Unspoken Names
SC-SCR-005 identifies the author chain behind SC-SCR-001–004 and reveals the second deck is being moved through legitimate and illicit trade networks.
SC-SQ-005: determine whether a supposedly stolen card was stolen, rescued, inherited, forged, or deliberately planted.
Treasure and faction relationships depend on evidence and the nine-choice ruling.

This opening five-dungeon chain is the template for the rest of MEGA-002. The final number of card dungeons must be based on the selected second-deck card roster rather than silently claiming a published deck has a different card count.

## Simulation rule
Run the same five PCs continuously. Update sheets after every dungeon. Preserve:
HP/resources/rests, damage/healing/prevention/control, spell telemetry, skills, tools/professions, STEAM, dialogue/relationships, moral flags, scroll knowledge, side quests, treasure, gold, faction standing, scars, promises, and character arcs.

Do not mark combat as observed until legal sheets, encounter statistics, maps, and raw rolls exist.
