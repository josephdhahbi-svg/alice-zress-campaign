# Incoming v46: Five-Tier Quest, Workbench and Spatial Module

Status: **candidate for integration, not deployed**. Source: user-supplied two versions of the v46 JavaScript engine (2026-10-16). Preserve the working backend; do not paste both into one module because const/class declarations conflict.

## Candidate quest data
| ID | Artifact | Location | Coordinates | Stat reward | Ability |
|---|---|---|---|---|---|
| Q-01-GADOR | Core Stone of Gador | Subterranean Enclaves | [12,33,0] | CON +2 | Tectonic Stability |
| Q-02-ELISTRAEE | Moon-Silver Blade of the Silver Maiden | Nhal'Ruun Grove | [15,35,5] | CHA +2 | Redeeming Grace |
| Q-03-MYSTRA | Tear of the Weave-Mother | Fallen Academy of Arcane Arts | [88.1,12.3,40.5] | INT +2 | Weave Attunement |
| Q-04-NETHER | Codex of Nether Scroll Fragments | Netherese Sunk Enclave | [89,15,42] | INT +2 | Arcane Overcharge |
| Q-05-MYSTRYL | Primal Spark of Mystryl | Dead-Magic Anomaly Core | [0,0,99.9] | WIS +2, CON +2 | Primal Flow |

Fusion: Cosmic Synthesis Matrix, requires Primal Spark of Mystryl + Codex of Nether Scroll Fragments, candidate +3 INT/+3 CON, unlock Weave-Engine Synthesis. Do not automatically consume ingredients or grant benefits until recipe rules are approved.

## Endpoint inventory from supplied code
- POST /api/spatial/entity; GET /api/spatial/proximity; POST /api/spatial/logs/clear
- POST /api/quest/complete; POST /api/workbench/craft; GET /api/character/state

## Integration blockers and required fixes
1. Merge candidate with existing Express app/routes instead of creating another server or duplicate module declarations.
2. Remove hard-coded fallback master key, avoid URL query credentials, never print secrets, use existing session/auth middleware; authorize ownership of entityId on each route.
3. Replace all in-memory Maps and pseudo-WAL array with persistent transactional SQLite tables; ensure atomic idempotent quest/reward/craft transactions, migrations, recovery and restart tests.
4. Do not trust a direct questId request to award treasure. Enforce prerequisites, quest objectives, chronological state, verified encounter outcomes, spatial eligibility and server-side rewards.
5. Validate finite numeric coordinates and nonnegative finite radius, cap radius and response sizes, enforce same-world/plane/campaign context, avoid unbounded linear proximity scans, make actual spatial grid indexing useful.
6. Never default actual character attributes to 10 or apply cumulative permanent +2/+3 buffs to canon D&D sheets. Define custom boon/buff mechanics, caps, duration, attunement, stacking and approval separately.
7. Restrict destructive log clearing to privileged roles, ensure file exists, rotate without losing audit data, avoid logging sensitive content.
8. Add tests for unauthorized entity access, invalid coordinates, repeated quest/craft, concurrent requests, missing ingredients, restart persistence, partial failures, exact spatial boundary, wrong plane and reward accounting.
9. Standardize spellings: supplied candidate uses Gador, Eilistraee, Mystra, Nether, Mystryl; earlier lore has Ghaunadaur, Mistral, Netherese. Do not silently conflate these or replace existing twin-artifact pair. User approval required for mapping.
10. Keep these five proposed rewards in a separate candidate catalog until reconciled with the established 1 Mistral + 1 Netherese grand artifact per trilogy, 20 total, and separate 111-relic goal. No retroactive grants from narrated cinematic ending.

## Acceptance gates
- Design reconciliation approved
- Existing app integration tests passing
- Auth/ownership enforced
- Persistent transactions verified after restart
- All loot ledger invariants preserved
- CI passing on development branch
- No deployment without explicit approval
