# OMNIPOTENT EXCELSIOR MASTER BUILD — INTAKE & RECONCILIATION

Status: **USER-SUPPLIED ARCHITECTURE / FEATURE SPEC — NOT PROOF OF IMPLEMENTATION**

This intake expands the proposed Moonveil software ecosystem with Flutter Material 3 interfaces, BLoC, local SQLite, Node/Express/Socket.io, Kubernetes/HPA/Prometheus, dynamic campaign generation, item inspection, minigames and CI/CD targets.

## Preserve from the supplied specification
- 5W1H world-entity ledger and FTS concept.
- player vitals/character-state concept.
- transactional outbox.
- campaign generator registry.
- convergence-road, Netherese-enclave, infinity-battle and Promenade state concepts.
- dynamic campaign expansion modules.
- item inventory/catalog UI target.
- test/CI automation target.

## Technical corrections before implementation

### Vector clocks
The supplied service compares one scalar `logical_counter`. That is not sufficient for a true vector clock. Production design requires a node->counter map, component-wise comparison, explicit BEFORE/AFTER/EQUAL/CONCURRENT states, component-wise max on reconciliation and entity-specific conflict policy.

Generic object spread must NOT resolve concurrent:
- currency;
- unique artifacts;
- inventory quantities;
- deaths/resurrections;
- quest completion;
- artifact provenance/custody;
- irreversible player choices.

### Outbox
Events require stable event IDs/idempotency keys, retry policy, acknowledgement state and causal metadata. Fixed counters such as 999 or 1 are narrative/demo placeholders, not synchronization logic.

### Elder Eye Audit Daemon
The software service name does not establish that the mythological Elder Eye is a database auditor, True Neutral cosmic being or single identified entity. The Alice/Elder Eye mystery remains evidence-gated.

### Dynamic campaign generator
Generated adventures must query legacy state and persistent archaeology rather than inventing disconnected content. Generation inputs should include party tier, chronology, geography, unresolved threads, factions, economy, ecology, artifact custody, Road state, evidence confidence and prior consequences.

## Narrative reconciliation

The supplied alternate hero structure:
- Kaelen Vance Books 1–10;
- Lyra Nightwhisper Books 11–20;
- Infinite Company Books 21–30;

is retained as **alternate/candidate campaign architecture**, not a replacement for the established Moonveil 30-book roadmap or Alice Z'ress and the principal cast.

The supplied nine-alignment pantheon/classes remain **Moonveil homebrew/candidate doctrine**. In particular, "Elder Eye = True Neutral Iris of Infinite Ledger" remains one interpretation, not objective cosmological truth.

The 100 spells and 100 items are **candidate catalogs**. They are not automatically official D&D content, acquired inventory, balanced mechanics or implemented Flutter records.

## UI target

Candidate Flutter experience:
- Material 3 adaptive navigation.
- campaign/book/trilogy catalog.
- character sheet/vitals.
- five clickable encounter choices.
- ItemInventoryScreen with filters and inspection.
- MAP / TIME / WEB / WEAVE / LIGHT / LEDGER views.
- archaeology/cache browser.
- evidence-confidence badges.
- offline-first pending-sync indicator.

UI existence must be verified in repository code before being described as implemented.

## CI/CD claim guardrail

The supplied text names `init_workspace.sh`, `.github/workflows/deploy.yml` and `new_tests.yml` and claims full coverage. Those are **requirements to verify**, not established facts. Repository inspection/tests are required before claiming seamless integration or full test coverage.

## Relationship to Infinity Codex

This material belongs in the future Infinity Codex under:
- Architecture & Runtime;
- Dynamic Campaign Engine;
- Inventory/UI;
- Synchronization;
- Testing/Deployment;
- Candidate Cosmic Classes.

It must not silently override the canon-guarded campaign chronology.

## Master rule

**DESIGN SPEC != IMPLEMENTED FEATURE.**
**HOMEBREW COSMOLOGY != PUBLISHED CANON.**
**A DATABASE LABEL != COSMIC TRUTH.**
**A GENERATED ADVENTURE MUST INHERIT THE WORLD IT ENTERS.**
