# Ghaunadaur Trilogy — Historical, Cast and Dialogue Audit
Audit date 2026-10-14. Status: partial sourced history review + new DESIGN dialogue, not playable or canon dialogue.

## Scope and historical evidence
- The Promenade is an Eilistraeen temple beneath Waterdeep near Skullport, NOT automatically the six-district homebrew Seralyth city. Its rebuilding in the 1490s was modest; Trelasarra Zuind led a small community. Source: https://forgottenrealms.fandom.com/wiki/Promenade_of_the_Dark_Maiden
- Qilué Veladorn historically served both Eilistraee and Mystra. She is NOT an ordinary living leader available in 1492 DR; later lore describes her as a Weaveghost with limited sacred-place interaction. Source: https://forgottenrealms.fandom.com/wiki/Church_of_Eilistraee
- Ghaunadaur's avatar escaped the 1379 DR Promenade assault and was trapped in a plane of endless mazes. Book II should investigate this historical prison, not claim it never happened. Sources: https://forgottenrealms.fandom.com/wiki/Church_of_Eilistraee and https://forgottenrealms.fandom.com/wiki/The_Lady_Penitent
- Second Sundering 1482–1487 DR; Mystra and Weave restored by end of 1487; Eilistraee regained her portfolio in 1489. Source: https://forgottenrealms.fandom.com/wiki/Second_Sundering
- PROVISIONAL campaign start 1492 DR (not locked); exact in-world date, travel times, divine manifestation mechanics, BG3 sequencing, Qilué's state, Sehanine's presence and Raven Queen's FR fit still require book-primary-source audit. No claims of exhaustive lore verification.

## Headline cast: roles, interaction entry points, original sample dialogue
All dialogue lines below are NEW ORIGINAL SAMPLE LINES, not published quotes or implemented branching scenes.

| Deity | Morality tier | Story role | Historical/story connection | Original dialogue sample | Player interaction | First circle |
|---|---:|---|---|---|---|---|
| Ghaunadaur | 5 | Primary antagonist | ooze cults and maze-avatar prison | “Your mercy will not unmake hunger.” | cult traces, ward corruption, emissaries | Book I onward |
| Eilistraee | 1 | Divine mentor and moral heart | Promenade, moonlit dance and liberation | “The path into light is walked, not inherited.” | moonlit song, priestesses, earned visions | Book I onward |
| Mystra | 1 | Magic and warding patron | Qilue's dual Chosen history, Weave and Netherese portals | “A broken ward is a question before it is a weapon.” | arcane sigils, research, messenger | Book I onward |
| Sune | 1 | Love and social bonds | adult romance and community festivals | “Love offered freely is stronger than any vow demanded.” | festival priest, consent-focused relationship quests | Book II onward |
| Lolth | 5 | Independent rival villain | drow politics, anti-Eilistraeen pressure | “Freedom is the first lie the weak tell themselves.” | spies, rival priestesses, bargains | Book II onward |
| Corellon Larethian | 1 | Elven legacy and reconciliation | ancient Seldarine and drow schism | “What was broken by pride need not stay broken.” | ancestral visions, elven envoys | Book III onward |
| Sehanine Moonbow | 1 | Dreams and passage guide | Seldarine mythology, moon and dreams | “The dream remembers what the waking world has buried.” | dream puzzles, ancestral memories | Book III onward |
| Selune | 1 | Lunar guidance | Eilistraee ally, moonlight | “A way through darkness is still a way forward.” | lunar omens, navigation | Circle Ten |
| Bahamut | 1 | Noble dragons and justice | platinum dragon tradition | “Strength is proven by whom you shelter.” | dragon emissary, honor trial | Circle Ten |
| Lathander | 1 | Renewal and second chances | post-Sundering divine return | “Dawn does not ask whether yesterday was worthy.” | temple aid, redemption trial | Circle Ten |
| Shar | 5 | Shadow intrigue antagonist | Second Sundering losses, Mystra/Weave opposition | “Every secret asks a price.” | shadow agents, counter-wards | Circle Fifteen |
| Tyr | 1 | Justice and law | justice and historical divine changes | “Justice without evidence is only certainty.” | tribunal, testimony | Circle Fifteen |
| Oghma | 3 | Independent knowledge authority | libraries and records | “A fact cannot defend itself; a scholar must.” | archives, scholarship | Circle Fifteen |
| Raven Queen | 3 | Death and memory outsider | setting-specific lore caution | “Memories have weight, even when names are gone.” | shadowfell dream envoy; cross-setting check | Circle Fifteen |
| Asmodeus | 5 | Infernal legal antagonist | Nine Hells bargains | “Every bargain begins with a definition.” | contracts, infernal agent | Circle Fifteen |

## Heroic lead and mortal cast
- Seralyth Moonveil: MAIN PLAYER PROTAGONIST; female drow Paladin 3/Celestial Warlock 17 intended target. This is a player-build DESIGN, not automatically legal 5e progression. Player writes her own dialogue, chooses action and earns blessings; no forced lines.
- Qilué Veladorn: HISTORICAL LEGACY NPC, not alive as an ordinary priestess in provisional 1492 DR. Allow only carefully verified sacred-memory/Weaveghost interaction; no fabricated physical presence.
- Trelasarra Zuind: historical restoration-era Promenade contact in the 1490s; verify precise date and status before scene.
- Proposed homebrew city NPCs Mira Silverskein, Dara Bellwright, Velis Duskward, Nymm, Rusk Ironhook, Tella Quickstep, Elen Songglass, Jessa Threadwell, Harrin Vale, Orren Ink, Ilyra Fen, Neris Valecrest and others: role and relationship goals documented in promenade-living-city-cast-v1.json, but NO completed dialogue trees, validated schedules, exact DR timestamps, fully mapped homes or playable romance engine yet.
- The 20 homebrew city NPCs must not be presented as historical canon or inserted into the tiny restored 1490s Promenade without settlement-expansion justification.

## Proposed Book I five-option dialogue standard (not implemented)
NPC: Trelasarra (provisional chronology) or an original Eilistraeen priestess if historical verification fails. Situation: ward near the sealed Pit is failing.
1. HERO: 'We'll evacuate the novices first. Show me the safest passage.' -> unlock evacuation route, no alignment coercion.
2. HERO: 'Can we mend the ward without harming anyone trapped beyond it?' -> arcana/religion research path.
3. HERO-LEANING NEUTRAL: 'I'll help, but the council must share the records with everyone.' -> negotiated public record.
4. TRUE NEUTRAL: 'I'll investigate the disturbance, then decide whom to support.' -> information-first route; no forced alignment change.
5. INSIGHT: 'What are you not telling me about the old maze portal?' -> roll only after check declared; no invented roll result.
6. CUSTOM: player-written dialogue.

## Interaction state contract
Each encounter stores npc_id, date_dr, sequence marker, plane/location, player_choice_id, dice source, required check/DC, quest prerequisites, dialogue branch, witness flags, faction reactions, approval deltas after resolution, relationship consent, cooldown and next schedule. No dialogue line auto-selects for the player. Gods primarily interact through avatars/agents/visions with setting limitations, not permanent party membership.

## Important gaps and contradictions
1. Current seven-ascension file still has obsolete stage-one 'Moonlit Initiate' even though user renamed it EYE and later requested 1–7 word titles. Must reconcile before release.
2. The five-word Book II title and seven-word Book III title are approved; emblem is exactly 'I · MOONS · HEAVENS' (letter I, not EYE).
3. The living-city JSON says 'pre-BG3 campaign' with date TBD while some notes place Seralyth post-Second Sundering and others use post-BG3; needs ONE chronological anchor or explicit separate campaign eras.
4. Existing city NPCs have role summaries and quest IDs, not actual executable dialogue or interactions. Explicit female-female romance identities have not been individually authored despite generic 'not gender locked' field.
5. The Raven Queen's nature and place in Forgotten Realms differ across D&D editions; cross-setting import must be flagged and dated.
6. Divine ranks are narrative roles, not canonical D&D alignment; Corellon, Sune, Sehanine and others need edition-specific source checks.
7. The actual labyrinth prison and avatar escape should be the continuity spine of Books I–III.

## Acceptance criteria for next implementation
Verify exact DR year; select canon Promenade vs adjacent homebrew town; reconcile ascension stage titles; create dialogue state machine with 5 clickable choices plus custom; add quest flags and NPC location/time schedules; define adult women interested in women with consent-driven individual romance arcs; run tests of chronology, reachability, role completeness, player agency, and earned approval.
