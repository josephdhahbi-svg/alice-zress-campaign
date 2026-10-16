# Moonveil Administration & Build Operations
**Status:** Active operating plan  
**Date:** 2026-10-15  
**Companion documents:** `master-development-board.md`, `vtt-technical-blueprint-audit.md`

## Operating mandate
Organize, brainstorm, build, connect, expand, test, and grow the Moonveil Universe in small reusable components ("Legos"). Each component should have a clear purpose, stable ID, dependencies, state, acceptance criteria, and links to the components it affects.

## The Lego method
1. **Capture:** Record the idea in the backlog without losing its original wording.
2. **Classify:** Choose domain (story, character, world, rules, artifact, quest, UI, API, data, test), status, priority, and canon confidence.
3. **Connect:** Add explicit links to prerequisite and dependent records.
4. **Build:** Implement one small vertical component that can be inspected and tested.
5. **Test:** Verify rules, chronology, state transitions, error paths, and user experience.
6. **Integrate:** Connect it to the master book catalog, story state, and VTT as appropriate.
7. **Review:** Record what changed, what is still open, and which components need follow-up.
8. **Grow:** Reuse successful patterns rather than cloning slightly different versions.

## Administrative roles
- **Universe architect:** owns cross-book structure, dependencies, and system coherence.
- **Canon editor:** distinguishes official source material, homebrew, crossovers, unverified claims, and conflicts.
- **Narrative designer:** builds dramatic arcs, meaningful choices, callbacks, and consequences.
- **Rules editor:** checks edition-specific mechanics, prerequisites, balance, and progression.
- **World simulator:** develops culture, politics, economy, ecology, logistics, and faction response.
- **Technical architect:** maintains data contracts, API boundaries, migrations, and state ownership.
- **QA / continuity tester:** runs schema checks, link checks, chronology audits, save/restore tests, and regression checks.

These are functional responsibilities, not claims that separate agents or automated services are currently running.

## Shared status vocabulary
- `LOCKED_CANON`: explicitly approved; change only through a decision record.
- `WORKING_CANON`: preferred current interpretation, still auditable.
- `PROPOSED`: idea waiting for review.
- `SOURCE_CHECK_REQUIRED`: needs evidence.
- `RULES_CHECK_REQUIRED`: needs mechanics verification.
- `IMPLEMENTATION_TODO`: accepted concept not built yet.
- `BLOCKED`: dependency or decision prevents progress.
- `CONFLICT`: two sources or decisions disagree.
- `TESTED`: acceptance criteria passed in the named environment.
- `DEPRECATED`: superseded, retained for history.

## Lego component contract
Each reusable component should record:
- `id`, `name`, `type`, `status`, `priority`, `owner_role`
- `purpose`, `inputs`, `outputs`, `dependencies`, `dependents`
- `book_ids`, `character_ids`, `location_ids`, `artifact_ids` as applicable
- chronology/geography, source and canon status when lore is involved
- data contract/API contract when software is involved
- acceptance criteria, test results, risks, open questions, change history

Do not require irrelevant fields to be filled with invented values. Use `unknown`, `not_applicable`, or an explicit pending state.

## Current starter components
- `COMP-BOOK-CATALOG`: 30-book index and trilogy mapping.
- `COMP-CANON-LEDGER`: decisions, conflicts, approvals, and supersession.
- `COMP-CHRONOLOGY`: historical date and campaign timestamp separation.
- `COMP-LOOP-LEDGER`: setup/payoff links across Books 1–30.
- `COMP-U01-PACKET-LEDGER`: packet grant/spend/reversal event history.
- `COMP-LENS-LIFECYCLE`: Weeping Obsidian Lens origin, limits, appearances, owners, and payoff.
- `COMP-GUVNER-AXIOMS`: cosmic-law rules, jurisdiction, exceptions, and costs.
- `COMP-CHOICE-ENGINE`: five choices, checks, outcomes, and persistent consequences.
- `COMP-DICE-ENGINE`: roll definitions, modifiers, results, and audit events.
- `COMP-SAVE-SYNC`: local pending changes, API validation, persistence, retry, and hydration.
- `COMP-LIVING-WORLD`: settlement and faction state transitions.
- `COMP-QUALITY-GATES`: schema, references, chronology, mechanics, and gameplay tests.

## Priority board
### P0 — Preserve and reconcile
- Keep the 30-book outline and the seven-traversal model as a documented conflict until a decision is made.
- Reconcile foundational trilogy title sets without deleting either history.
- Verify whether "Levels 1–30" means book numbers, narrative tiers, or a homebrew character progression beyond level 20.
- Keep Alice's level-one Great Old One Warlock / Acolyte origin and custom three divine gifts distinct from ordinary rules.

### P1 — Make data dependable
- Create the initial 30-book catalog with stable IDs and explicit pending continuity status.
- Extend validation to detect duplicate IDs, missing links, invalid enums, and malformed records.
- Keep gameplay save state separate from immutable canon records.
- Define versioning and migration rules before bulk importing more lore.

### P2 — Build a playable slice
- Character creation and save/load.
- Book 1 opening scene and five selectable choices.
- Dice checks with declared DC, modifiers, outcome, and logged event.
- Quest journal and inventory events.
- Choice consequence and U01 packet ledgers (packet changes only when valid campaign rules permit).
- Export/import and restart recovery.

### P3 — Connect and grow
- Add Book 1 setup/payoff records that point to later books.
- Add one location with culture, leadership, resources, economy, factions, and reactive world state.
- Add one artifact lifecycle, beginning with the Weeping Obsidian Lens.
- Add one end-to-end save/sync integration test before expanding the client.

### P4 — Scale safely
- Expand books in groups of three after the shared patterns work.
- Add test fixtures and automated checks for each new record family.
- Track technical debt and continuity debt separately.
- Re-run the full quality gate after any change to canon, schemas, state transitions, or core rules.

## Administration meeting template
For each build session, record:
1. What was added?
2. What existing components does it connect to?
3. What is its canon and implementation status?
4. What changed in the data model or player-visible behavior?
5. Which tests passed or failed?
6. What is blocked?
7. What is the next smallest valuable build?

## Definition of done
A component is not done merely because a document or code file exists. It is done when its status is explicit, dependencies are connected, relevant checks pass, failure modes are documented, and a player or maintainer can understand how to use it.

## Decision record format
- **Decision ID:**
- **Question:**
- **Options considered:**
- **Evidence / constraints:**
- **Decision and rationale:**
- **Affected component IDs:**
- **Migration / rollback:**
- **Date and status:**

## Important technical note
The Flutter + Node.js + SQLite WAL architecture is the target. The currently inspected repository includes an offline browser prototype and lore data/documentation; the proposed Flutter/backend files must be verified or implemented before synchronization is described as operational.
