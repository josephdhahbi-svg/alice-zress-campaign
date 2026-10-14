# Moonveil Companion, Romance and Living Narrative Standard v1
Date: 2026-10-14
Status: design requirements; not implemented or tested
Source: user-supplied 25-point BG3-inspired narrative framework; original Moonveil writing required.

## Core cast and companions
1. Private agendas and ticking clocks
2. Dynamic approval and disapproval on resolved actions
3. Flaws, trauma and earned growth without compulsory fixing
4. Found-family rivalries, humor and evolving friendships
5. Romance eligibility based on chemistry, agency and consent rather than gender locks

## Romance and intimacy
6. Slow-burn vulnerability and earned trust
7. Camp and downtime sanctuary scenes
8. Consequential partner interjections, jealousy handled without coercion
9. Personal-quest milestones for romantic commitment
10. Ascendancy/power versus healing choices without forcing either path

## Worldbuilding
11. Shared group threat and pressure clocks
12. Culturally stratified living cities
13. Factions with understandable motives and internal disagreement
14. Active deities and patrons with real costs
15. Distinctive reactive Underdark societies

## Narrative and dialogue
16. Cinematic close-up emotional scenes
17. Meaningful skill checks with fair DCs and non-arbitrary consequences
18. Humor and levity alongside trauma
19. Spell-enabled dialogue branches such as Speak with Dead and Speak with Animals
20. Origin and background-specific internal perspective

## Gameplay and agency
21. Consequences can close paths; telegraph foreseeable permanent loss
22. Temptations to use dark power and companion trust effects
23. Race/background-sensitive reactions without stereotyping
24. Memorable reactive side quests and minor characters
25. Earned ending accounting for survival, relationships, sacrifices and world flags

## Mandatory integration contracts
- Every named companion: stable character_id, source/canon status, moral color BLUE/GREEN/RED, era and DR date range, plane and map position, agency, personal quest, private agenda, clock, fears, aspirations, friendship and romance states, approval changes, consent boundaries, departure triggers, ending variants.
- Every approval delta records event_id, action taken, witness eligibility, old/new score, rationale and idempotent persistence. Previewing a choice never changes approval.
- Romance is optional, adult, mutually consensual, non-explicit and not a reward for simply accumulating approval. Support friendship and rejection without punishment.
- Each major scene offers exactly five distinct clickable choices with action category, morality, foreseeable risks, companion/world effects and heroic completionist recommendation. Do not spoil hidden twists.
- Camp scenes are scheduled at in-world times and places, and NPC travel/chronology must be possible.
- Quest giver, shop and map records reference stable character IDs and state flags, not just display names. NPC survival, allegiance, work shifts and travel must agree across systems.
- Consequential permanent failures must be legible and avoid hidden unfair single-roll disasters. Use meaningful fail-forward when appropriate.
- Companion decisions affect shops, factions, city conditions, reputation, available quests, prices, and ending slides.
- Dice logs must record roll provenance, modifiers, DC and 2024 D&D rules adjudication; no fabricated rolls.
- Endings must query actual recorded flags, not scripted assumptions. Distinguish canonical BG3 ending, user-selected custom continuity and future Moonveil homebrew.

## Companion integration examples (not invented save facts)
- Karlach: confirmed alive in Avernus; infernal engine rescue creates clock, engineering investigations, romance/friendship scenes, Hell faction repercussions. Engine repair is NOT yet earned.
- Astarion: user's good-ending vigilante stopping criminals in Baldur's Gate; criminal guild investigations can trigger his approval and personal moral choices. No ascension assumed.
- Gale: user's good-ending professor in Baldur's Gate with Tara; research, mentorship, E-STAM and infernal-engine theory connect to universities, shops and quests.
- Halsin: possible return to grove, location PROVISIONAL until confirmed; nature restoration quest hooks must remain conditional.
- Hope: House of Hope future dedicated quest chain; exact current location and prior BG3 outcome unknown, so gate appearance until established.
- Alice Z'ress and other campaign PCs: preserve separate campaign timelines and relationship canon; crossovers only when chronology and user approval allow.

## Scoring and acceptance
- New narrative rubric: 25 requirements x 4 points = 100, awarding 1 for documented design, 1 for implemented playable scene, 1 for automated verified behavior, 1 for observed user playtest. Never claim implementation/test points without evidence.
- This file documents requirements, not proof that each has been satisfied. Do not increase BG3 /100 baseline or /600 parity scores merely for adding prose.
- Initial build: one companion clock, two reactive camp scenes, one romance-or-friendship fork, one map/merchant/quest consequence, and deterministic save/reload test.
- Future test cases: approval once, witness gating, consent gating, jealousy without forced romance, time progression, race/background variant, origin perspective, spell branch, no impossible NPC location, endings match flags.
