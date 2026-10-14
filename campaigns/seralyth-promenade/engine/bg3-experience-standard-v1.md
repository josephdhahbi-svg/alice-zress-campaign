# Moonveil — BG3-Inspired Game Experience Standard v1
Date: 2026-10-14
Status: User-approved DESIGN BENCHMARK; NOT a claim of implemented functionality.
Scope: Seralyth Promenade and all Moonveil stories (Alice, Underdark, Abyss, Avernus, Ravenloft, Spelljammer, Planescape), subject to separate chronology and campaign-specific character builds.

## North star
Build an original Moonveil Universe RPG that evokes the experience of Baldur's Gate 3 on Android: cinematic conversations, portraits, five actionable dialogue choices, meaningful branching, character approval and optional romance, 2024 D&D-inspired transparent dice, tactical encounters, party management, inventory, journals, lore, accessible voice/buttons, and reliable resume exactly where the player stopped. BG3 is a benchmark, not a source of copied script, character art, voice acting, UI assets, proprietary code, or trademarked branding.

## Reference research registry (unverified external references; verify access, completeness, license, provenance and version before using)
- https://krazplay.github.io/bg3/ — fan dialogue/approval browser.
- https://www.nexusmods.com/baldursgate3/mods/17671 — claimed Patch 8 parsed dialogues; verify availability.
- https://github.com/danielsamuels/bg3-savefile-parser/blob/master/FORMAT.md — community save format notes.
- https://www.tumblr.com/roksik-dnd/740122520642093056 — claimed dialogue archive pointer.
Use references to understand general data patterns (conditional dialogue, flags, approvals, state transitions), not to import/reproduce the full copyrighted dialogue, assets or voice recordings. External links were not independently verified in this commit.

## Required choice contract — all stories
Five distinct buttons per decision (plus custom spoken/typed action):
- short action title, moral preview (BLUE good/hero, GREEN neutral/mixed, RED evil/villain), tactical type (attack/defense/utility/investigation/engineering/diplomacy/romance/other)
- foreseeable impact on player (HP, spells, items, experience, reputation, safety); companions (approval, relationships, consent, romance); world (refugees, factions, economy, territory, quest flags); ending tendencies (heroic, neutral, dark)
- risks, prerequisites, DC and verified modifiers when applicable; indicate uncertain outcomes and avoid spoilers
- explicitly marked **recommended** option with brief rationale based on user's heroic completionist goals; recommendations never remove agency or conceal known severe harms
- [companion approval/disapproval] only after an actual resolved choice; preview as *possible* before resolution
- romance choice explicitly marked, only when eligible, mutual and consensual; friendship remains valid
- show meaningful moral consequences, conceal mysteries and twists; never guarantee an outcome before dice/conditions
- avoid forced binary morality or penalizing lawful creative solutions
- mature tone with optional controls for violence, gore, nudity, intimacy; game age ratings require jurisdiction/platform assessment.

## Gameplay state and resume contract
Persist schema_version, campaign_id, book, quest, scene_id, node_id, chronology (DR and sequence), location/map, party, level/class, hp, conditions, resources, spell slots, inventory, attunement, gold, NPC life/death/status, faction clocks, approval scores, romance states and consent flags, quest flags, dice log (RNG provenance), encounter turn order/positions, E-STAM ledger, secrets discovered, ending flags, save checkpoint/version and content hash. Every action must be validated then applied atomically with an event_id; reload must reconstruct the same state without duplicate rewards. Keep separate campaign worlds unless crossovers explicitly approved.

## Implementation architecture
1. ChatGPT: DM narration, interactive choice panels, rules explanations, accessible dialogue.
2. Rules: versioned D&D 2024 vs labeled homebrew adjudication; test attack, saves, skill/tool proficiency, initiative, resources and action economy.
3. Dice: verifiable independent randomness and complete transparent roll audit; manually entered physical dice are labeled manual, not random-generated.
4. State: transactional persistent save store, checkpoint/rollback, backups, idempotent event log.
5. Presentation: mobile-first 2D UI prototype then optional Unity/Godot/Unreal 3D app, cinematic camera, 5-foot tactical map, character portraits, action hotbar, tooltips, loot and E-STAM popups.
6. Input: button and voice/text commands map to the same validated action; no promise of simultaneous native voice + custom UI until tested.
7. Content: GitHub versioned original quests, assets and lore; no automatic sync to Gemini/World Anvil without explicit integration.

## Genre and continuity
Fun highest priority. User-approved intensity TARGETS: Action 10/10, Comedy 8/10, Romance 7/10, Drama 7/10, Horror 5/10 (not earned scores). Heroic completionist preferred, villain paths permitted. Preserve Seralyth prequel chronology, BG3 pre/post-era gates (Karlach, Hope, Lae'zel/Orpheus, Shadowheart, Minthara etc), Qilue/Promenade uncertainty, and existing Underdark->Abyss->Avernus working trilogy. The alternate mixed nine-book Gemini roadmap is a PROPOSAL only. E-STAM educational points 0–5 per earned reasoning/craft moment, not D&D XP. Every world claim must have lore/date/source/canon status.

## Prototype milestone: The Unheard Bell
Five actionable labeled choices, approved level-1 character sheet, NPC dialogue and conditional approval, real dice service, one valid 5-foot tactical encounter, inventory + E-STAM popups, state changes, save/quit/reload exact restoration, Android usability test. Current in-chat mockups are NOT proof of these mechanics.

## Verification gates
A: Spec/document exists; B: implemented runnable build; C: automated deterministic tests pass; D: human Android playtest passes. Never award B/C/D for mere design text. Score independently for visuals, gameplay and actual playability.
