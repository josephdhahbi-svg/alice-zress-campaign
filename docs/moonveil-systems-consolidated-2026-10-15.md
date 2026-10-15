# Moonveil Universe — Consolidated Systems (2026-10-15)

Status: approved design specification; not proof of implemented mechanics or earned character progression.

## Invariants
- Alice Z'ress remains a level-one drow Great Old One Warlock, Ghaunadaur patron and Eilistraee acolyte. Do not change player choices, levels, inventory or quest outcomes without play.
- Her three origin gifts are Shield (Midnight Mystra), Acid Splash (Ghaunadaur), Light (Eilistraee); custom origin, not three ordinary feat selections.
- Preserve 30-book / ten-trilogy roadmap and seven circular traversals; maintain historical DR chronology and canon/homebrew distinctions.
- Five decision choices: Lawful Good, Neutral Good, Chaotic Good, Utility, Action. Heroic redemption routes should remain meaningful.
- SQLite authoritative for private player saves; do not commit personal databases or session archives to GitHub.

## Five-tier faction encounter hierarchy
1. MINIONS_TRASH_MOBS: weak creatures and low-ranking followers.
2. ELITES_CULTISTS: specialist creatures and trained cult spellcasters.
3. CHAMPIONS_COMMANDERS: named lieutenants and battlefield leaders.
4. CHOSEN_HERALDS: empowered servants and emissaries.
5. ASPECTS_AVATARS: manifestations and final-tier boss encounters.

Narrative tier is NOT challenge rating; scale combat by actual stat blocks and party level. Apply to every major faction, not only cosmic entities.

## Cosmic antagonist track
Proposed boss order: Dendar -> Cthulhu -> Yog-Sothoth -> Azathoth -> Tharizdun. Tharizdun is final overarching Great Old One-side antagonist, not Alice's patron. The latter three Mythos-origin figures require explicit crossover/homebrew sourcing; do not misrepresent them as standard Forgotten Realms 5e stat blocks. Ghaunadaur remains separate. Zargon and star spawn are priority published D&D encounter resources. Track each creature's edition, book, CR, spells/actions, canonical affiliation, and direct-stat-block availability; distinguish lore-only from playable stat blocks.

## Triune divine crafting
Exactly one GOOD, one NEUTRAL, one EVIL alignment contributor, with lawful/neutral/chaotic variation within each: 3 x 3 x 3 = 27 alignment recipes before choosing deities or items.
- Good: protective/restorative input.
- Neutral: stabilizing mediator, catalyst, ritual or Wish-related component where rules permit.
- Evil: dangerous power/cursed artifact to be transformed.
- Output types: cleansed artifact, crafted weapon, blessing, spell, class synergy.
- Purification is an earned, validated homebrew ritual, not automatic Wish behavior. Check real deity alignments, history, rivalries, and sourcebook artifacts; no assumed perfect opposites. Mystra can be a narrative mediator without being reclassified as neutral alignment.
- Alice's Moonblade of Liberation, Book of Living Weave, and Eye of Ghaunadaur remain unearned; three Wish cleansings and other prerequisites remain locked.

## Three-path character development
Official D&D multiclassing already permits three or more classes. Moonveil distinguishes (a) actual multiclass level allocation and prerequisites from (b) three-source divine synergy unlocks earned through quests. No free full class progressions or retroactive upgrades.

## Roads & Railways navigation
Three player-selectable, switchable modes in ONE shared world: Railway (guided), Roads (branching), Wilderness (sandbox). Shared continuity, quest consequences, faction simulation and save authority; do not silently auto-resolve player decisions. Maintain five-option story panels.

## Alice prologue continuity
Hallway of Infinite Doors vision: Mystryl (original goddess), falling Netherese flying city, observing Larloch, and Tharizdun as a black-hole-like cosmic abyss unraveling the Weave. Temporal convergence is homebrew, not a claim Tharizdun canonically caused Karsus's Folly (-339 DR). Midnight Mystra giving Alice Shield is a distinct later incarnation.

## Implementation gates
Sourcebook verification -> normalized source records -> schema validation -> level-appropriate encounter generator -> three-source recipe validation -> branching/guided/sandbox navigation -> tests -> review. No public release, player-save edits, unencrypted backup uploads, or unverified claims of passing tests.
