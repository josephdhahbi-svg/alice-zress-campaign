# Alice Z'ress — Three Chosen System: Design Checkpoint
Date: 2026-10-14
Status: USER-DIRECTED DESIGN; NOT IMPLEMENTED GAME MECHANICS; no reward acquired.
Branch: dev/alice-three-chosen-roadmap

## Character continuity
Alice Z'ress is a level-1 female drow Great Old One Warlock, Acolyte, devoted to Eilistraee, with Mystra's protection and Ghaunadaur as established patron. Do not replace the Warlock foundation. Skilled feat, lyre and proficiency commitments must be reconciled with original character sheet. Rabbit-hole sequence not yet played. Three separate cinematic origin gifts: Mystra Shield; Ghaunadaur Acid Splash; Eilistraee Blade Ward. Do not conflate these with standard Magic Initiate spell picks.

## Three independent homebrew Chosen progressions (each level 1-20)
- LEFT: Ghaunadaur / Elder Eye / Far Realm — aberrations, psychic damage, ranged Eldritch Blast, summoning, control.
- CENTER: Mystra / Weave — magical intelligence, healing, protection, restoration, utility; minimal damage. Most frequent contact; intermediary between Alice and the other two.
- RIGHT: Eilistraee / Moon and Light — swords, armor, melee damage, sword dance, radiant techniques; second-most frequent contact.
- Ghaunadaur contact is rare, generally through an incomprehensible avatar. Do not portray direct ordinary conversation with its true form.
- The term Ganador has appeared separately as a Prime Architect in older drafts; do not silently merge it with Ghaunadaur. Current Alice left pillar is Ghaunadaur pending any explicit revision.

## Level-up rule
At each level, Alice is offered one Chosen advancement from each of the three paths and selects ONLY ONE. The other two options for that level are forfeited. This is a separate custom progression to be balanced against baseline 2024 Warlock rules. Features listed in prior chat roadmap are draft titles, not approved mechanics. Keep chosen, offered, forfeited, quest_pending, quest_completed and acquired distinct.

## Feat-level divine treasury
Proposed feat-level checkpoints: 4, 8, 12, 16, 19 (reconcile 2024 Warlock feat and Epic Boon rules).
At each checkpoint each deity offers a candidate in EACH category:
1. feat
2. boon
3. magic item
4. spell
5. spell gem
6. ring
7. blessing (PROVISIONAL interpretation of user's second 'feat' mention; confirm if distinct).
21 candidates = 3 deities x 7 categories per checkpoint. Alice may mix deities across categories, but selects ONE candidate per category. On CONFIRMED choice, competing two candidates in that category at that checkpoint become unavailable. Selection creates a quest; reward is NOT acquired until quest completion and prerequisites are met. Keep declined offers and acquisition logs for continuity. Proposed counts: 5 checkpoints, 35 quests selected, 105 candidate offers.
Every record should carry level, deity, category, source/homebrew status, prerequisites, acquisition quest, timeline/DR/plane/location, selection and lock status, reward ownership, cooldown and duration as relevant.

## Story and interface requirements
Mobile-friendly clickable three-column cards, images, clear labels and color, one-click choices, explicit confirmation before irreversible lock. Comic pages: four story panels above a full-width five-choice decision panel (Lawful Good, Neutral Good, Chaotic Good, Utility, Action). Blue=hero, red=villain, green=neutral/mixed for NPC moral classification, not divine-tree color.
Do not advance story or award rewards during character creation. Do not claim any code implementation or testing before it happens.

## Workflow
Use GitHub as durable project record; read existing files before modifications, work on development branch, commit incremental design/code/tests, read back after writes, and report commit and status. GitHub is not a continuous memory or runtime by itself; future sessions should reopen this checkpoint and related canonical files. No background coding without a scheduled automation or active session.

## Next implementation milestones
1. Draft data schema and three 20-level progression catalogs.
2. Draft seven-category offers at feat levels and quest prerequisites.
3. Implement choice exclusivity and quest-unlock logic with automated tests.
4. Build mobile selection UI and connect to persistent game state.
5. Review balance, chronology and canon/homebrew distinction before merging to main.

## Scene choices, items, quests, and ending causality — confirmed design direction
- During relevant story scenes as well as level-ups, offer differentiated choices tied to Ghaunadaur, Mystra and Eilistraee. Offers may include items, rings, spell gems, spells, feats, boons, blessings and quest opportunities. Distinguish ordinary five-choice story panels from three-deity reward selection screens.
- A confirmed reward selection closes the other two deity offers for that same category and offer event. It creates a quest, not immediate ownership. On completion and prerequisite verification, grant the selected reward and record how Alice obtained and used it.
- Endings are determined by cumulative choices, which rewards and quests Alice pursued/completed, relationships and moral conduct, and decisive final actions. Do not reduce endings to raw deity pick counts. Choosing aberrant powers alone is not proof of evil alignment.
- Proposed (not canon-locked) ending families: Herald of the Beyond, Guardian of the Weave, Champion of the Dark Maiden, and difficult secret Threefold Ascendant. Design heroic, redemption, sacrifice and corruption variants after user review.
- Implement a traceable event ledger: scene_id, offer_event_id, category, deity, chosen_offer_id, rejected_offer_ids, lock_timestamp/sequence, quest_id, quest_status, reward_acquired, use/consequence flags, relationship deltas, ending flags, DR/plane/location and source. Never retroactively grant rewards or invent completed quests.

## Confirmed epic milestone revision
User confirmed: Level 20 = Chosen of Eilistraee (completion of 1–20 path); Level 21 = Visage of the Dark Maiden (first epic divine transformation, homebrew). Supersedes prior provisional Level 20 Visage entry. Level 21 mechanics, prerequisites and parallel Mystra/Ghaunadaur epic paths remain to be designed. No transformation has been earned.

## OVERRIDING CORRECTION — universal three-heroine ascension (2026-10-14)
USER CORRECTED PREVIOUS TRIADS: ALL THREE heroines share UNDEAD (each becomes a lich) and LIGHT (each eventually becomes an angel/Solar); each has exactly ONE distinct third essence.
1. Alice Z'ress: UNDEAD + LIGHT + FAR REALM (Ghaunadaur/aberrant eldritch).
2. Female Aasimar Paladin: UNDEAD + LIGHT + FIEND / NINE HELLS (Zariel's absorbed infernal essence; Zariel is an archdevil of Avernus, not an Abyss demon). Supersedes earlier LIGHT+FIRE+ABYSS interpretation. The paladin remains female, main tank, redemption-focused.
3. Female Dhampir Undead Warlock / Moonveil Witch: UNDEAD + LIGHT + MAGIC (Mystra/Weave as third essence); preserve previously established Selune patron/devotion unless user explicitly changes it.
Solar ascension is custom and requires quests; not automatic creature-type stacking. Preserve existing differing timelines, especially Moonveil's final full Solar only after Mission 30. Alice's proposed Level 21 Solar/Visage remains distinct. This correction is authoritative over earlier triad draft.

## Confirmed supernatural power palette (2026-10-14)
- FAR REALM = PURPLE (#8B5CF6 proposed UI hex).
- UNDEAD = GREEN (#22C55E proposed UI hex).
- LIGHT / SOLAR = WHITE (#FFFFFF).
- MAGIC / WEAVE = BLUE (#3B82F6 proposed UI hex).
- FIEND / NINE HELLS = color not yet chosen; infernal red is only a suggestion, not approved.
These are essence/UI coding colors and must remain separate from NPC morality colors (BLUE hero, RED villain, GREEN neutral/mixed). Use labels/icons alongside color to avoid ambiguity and for accessibility.

## Vecna's three-artifact chain — user-directed campaign adaptation
Vecna's custom campaign objective includes obtaining and uniting three published D&D artifacts: (1) Book of Vile Darkness (forbidden secrets), (2) Hand of Vecna (necromantic might), (3) Eye of Vecna (supernatural sight/secrets). Their combined role in enabling his multiverse-remaking plan is HOMEBREW CAMPAIGN PLOT, not a claimed printed prerequisite of Vecna: Eve of Ruin's Ritual of Remaking. Alice's heroic counter-quest tracks each artifact separately: discover -> confront guardian/Vecna agent -> secure -> study -> purify or safeguard, with prerequisites and continuity metadata. None acquired at Level 1. Clarify later whether Vecna starts with any of the three or is seeking all three; user phrased 'His chain is to get the book and eye and hand'.

## USER-APPROVED Far Realm artifact names (2026-10-14)
Alice's three separate Gonnador-named Far Realm relics are EXACTLY: **Eye of Gonnador**, **Mark of Gonnador**, **Grimoire of the Elder Eye**. These supersede unapproved Eye/Hand/Book of Gondor labels and are distinct from Eye of Vecna, Hand of Vecna, Book of Vile Darkness. Earlier desired 3-5-7 word-count convention does not match these approved titles; use the user's explicitly approved names instead of silently expanding them. These are future quest-gated items, NOT equipped at Alice's Level 1 acolyte prologue. The Mark relates to her hand/arm and the Eye to her eye, with exact transformations to be designed. Preserve 'Gonnador' spelling in these titles as approved; do not silently rename to Ghaunadaur, whose role as Alice's patron remains a separate continuity issue pending clarification.

## Secret ending completionist requirement (user-confirmed 2026-10-14)
Alice's true/secret ending requires collecting ALL designated items, Dark Gifts, blessings, and spells from ALL THREE patron/divine paths: Ghaunadaur (Far Realm), Mystra (Weave), and Eilistraee (moonlight). She must ultimately become all three rather than permanently forfeit unselected tracks. Reconcile earlier 'one choice per level, other two forfeited' milestone design: choices can determine the immediate reward/order, but all three paths must remain ultimately obtainable via quest gates, later discoveries and/or the seven campaign traversals. Do not award unearned gifts or assume collection is complete. Track available/locked/discovered/earned/mastered separately, along with sources, quest prerequisites, DR chronology, and any mutually incompatible effects that require a reconciliation quest. Existing Threefold Dark Maiden Path of Balance ending remains the target, with undead/light/Far Realm essences and Mystra's separate Weave path respected; exact ascension synthesis mechanics pending design. The secret ending is not unlocked at Level 1.

## User correction: EXACT 7/7/7 balance (2026-10-14)
The Threefold progression target is **7 Ghaunadaur gifts + 7 Mystra gifts + 7 Eilistraee gifts = 21 divine gifts**, NOT 7/7/6. Alice was an ordinary nonmagical Eilistraee acolyte before entering the portal; Skilled represents pre-portal vocational training. At the Level 1 portal transition she becomes a Level 1 Great Old One Warlock, receives custom Magic Initiate, and simultaneously receives one origin gift from EACH deity: Ghaunadaur Acid Splash, Mystra Shield, Eilistraee Blade Ward. Those three gifts are a special Level 1 exception. A consistent **proposed** allocation is six further gifts per deity through 18 choices at Levels 2–19, with Level 20 reserved for a Threefold ascension/completion milestone rather than a standard extra gift. This allocation is provisional until user confirms exact Level 20 handling; do not present Level 20 allocation as a settled rule. Quest-based full collection remains necessary for secret ending; gifts are distinct from all spells/items/blessings in the larger collection catalog.
