# MOONVEIL — NEW CAMPAIGNS & HORIZONS

Status: **USER-SUPPLIED POST-INFINITY EXPANSION / CANON-GUARDED INTAKE**
Placement: **Series II candidate material after Book 30**
Does not replace the established 30-book / 10-trilogy Series I roadmap.

## Purpose

This expansion proposes fresh-hero and high-tier campaigns after the original Convergence. It is useful as a **second campaign series**, but its premises must remain conditional on the actual Book 30 ending. Series II must inherit consequences rather than assume that every cosmic power was stabilized, restored, destroyed, or harmonized.

## Proposed data model

Candidate tables:
- `new_campaign_arcs`
- `new_campaign_factions`
- `new_campaign_quest_lines`

Before implementation, production schema should add/consider:
- explicit foreign-key delete/update policy;
- chronology and geography fields;
- source/canon/homebrew status;
- provenance/evidence confidence;
- Series I consequence dependencies;
- persistent archaeology/cache links;
- campaign-state prerequisites;
- idempotent event IDs and true vector-clock state for synchronization.

The supplied `initializeNewCampaign()` is **proposal code, not verified/deployed implementation**. Its outbox event is marked COMMITTED immediately and uses a fixed logical counter of 1; production synchronization must follow the existing causal/idempotency guardrails.

## SERIES II — candidate arcs

### ARC II-01 — The Shattered Prism Chronicles
Proposed campaign slots: 31–35.
Fresh heroes, starting near level 1.
Theme: planetary shards, scattered prism phenomena, elemental combinations.
Core mechanic: **Prism Resonators**.

Continuity guardrail: Khaenos and the Prism Tempest are Moonveil homebrew/candidate cosmology. Do not state their post-Book-30 fate until Series I resolves it.

Living-world emphasis: fragmented governments, refugee movement, trade between shards, ecology under altered light, competing interpretations of prism technology/magic.

### ARC II-02 — The Underdark Renaissance
Proposed campaign slots: 36–40.
Fresh/advancing heroes, proposed levels 1–15.
Theme: rebuilding communities outward from the Promenade.
Core mechanic: **Sanctuary Management** — build, defend, negotiate and trade among subterranean settlements.

Continuity guardrail: do not assume “Eilistraee's cosmic stabilization” happened. The arc should import the actual state of the Promenade, Alice's choices, surviving communities, Ghaunadaur/Lolth consequences and EYE ROAD archaeology.

This is the strongest direct legacy arc for Alice's Elder Eye story. Old Eye marks remain evidence, not automatic proof.

### ARC II-03 — The Void-Sector Outpost
Proposed campaign slots: 41–45.
Proposed levels 10–20.
Theme: remote cosmic station, espionage, exploration and containment.
Core mechanics: oxygen, vacuum/static protection, psychological pressure and void corrosion.

Continuity guardrail: “Beyond-Boundary Aegis” and “pre-silicon void” remain homebrew concepts. Alien != evil; containment requires evidence and ethics, not species-based assumptions.

### ARC II-04 — The Chrono-Breaker Rebellion
Proposed campaign slots: 46–50.
Proposed levels 1–20.
Theme: temporal factions, personal history, causality and investigation.
Core mechanic: **timeline branching**.

Critical technical improvement: do NOT implement player timeline forks by casually duplicating entire SQLite databases. Prefer an immutable/event-sourced branch ledger or explicit branch IDs with parent events, snapshots/checkpoints, causal clocks and deterministic reconciliation rules. Unique artifacts, deaths, economy, quest completion and provenance require domain-specific merge policy.

Continuity guardrail: Chronosis is candidate Moonveil cosmology, not published D&D canon.

## Series I -> Series II inheritance contract

Every Series II arc should begin by importing a compact **LEGACY STATE** from Book 30:
- surviving/dead/transformed major characters;
- faction status;
- Promenade status;
- Road status;
- discovered/authenticated Eye evidence;
- artifact custody;
- unresolved debts/contracts;
- settlements and economies;
- ecology changes;
- important documents/paintings/marks;
- Mystryl/Mystra outcome;
- Patchwork Architect outcome;
- Elder Eye confidence state;
- final CHOICE.

Series II must never overwrite that state merely to fit a predetermined sequel premise.

## Five-choice standard

Major encounters continue:
**TALK | INVESTIGATE | SNEAK | RESCUE/BUILD | FIGHT**

For the Renaissance arc, BUILD can become a contextual sixth action where settlement management materially matters.

## Persistent archaeology

Series II is where the master law becomes most visible:

**NO ADVENTURE DISAPPEARS WHEN IT ENDS. IT BECOMES ARCHAEOLOGY FOR THE NEXT ADVENTURE.**

A Book 36 hero should be able to discover a repaired tunnel, song, grave, receipt, Eye rubbing, cache or political consequence produced by Alice's earlier campaign without requiring Alice herself to be present.

## CI/CD claim guardrail

The supplied text says new modules integrate seamlessly with `init_workspace.sh` and GitHub Actions with automated coverage. Treat that as a **target requirement**, not a current fact, until repository files, workflows and tests are inspected and the integration is actually implemented.

## Recommended expansion order

1. **Underdark Renaissance** — strongest continuity and living-world payoff.
2. **Shattered Prism Chronicles** — clean fresh-hero entry point.
3. **Void-Sector Outpost** — higher-tier cosmic expansion.
4. **Chrono-Breaker Rebellion** — last, because timeline branching has the greatest narrative/database complexity.

## Canon boundary

Series II is optional expansion architecture. Series I remains:
**10 trilogies -> 30 books -> Book 30 Convergence -> player-determined consequence state.**

Series II begins from that consequence state rather than declaring a single canonical Book 30 ending.
