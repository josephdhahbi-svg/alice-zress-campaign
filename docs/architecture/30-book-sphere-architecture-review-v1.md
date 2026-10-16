# Review: 30-Book Spherical Architecture and Core Python Proposals

Status: DESIGN REVIEW — not a canon approval or complete engine implementation.
Source: user-supplied architecture bundle dated 2026-10-16.

## Accepted as design direction
- A 30-book campaign organized as three 10-book tiers/passes, with a separate seven-traversal model retained by the existing project.
- Separate cosmic, spatial, temporal, character, and outer-campaign perspectives.
- Modular Python components and a protected Alice state projection.
- Pure hazard evaluation as a testable calculation, provided it does not mutate saves or automatically apply effects.
- World patches should be accepted through explicit, version-checked commands and recorded as append-only events.

## Important conflicts and gates
1. Three passes are not seven traversals. The supplied three-tier / three-pass architecture organizes books; the existing master contract separately specifies seven traversals. Keep both concepts distinct unless the project owner explicitly revises the design.
2. Book titles are proposed campaign titles, not automatically official published adventure titles. The road atlas describes book slots as placeholders; do not map these names to official adventures or verified routes without source review.
3. Level 20 is the ordinary 5e character-level ceiling. Levels 21–30+, Solar thresholds, lich/arch-lich transformations, and the named Avatar of Alustra progression require explicit homebrew/crossover classification and rules design. Do not put them into Alice's live progression.
4. Ganador, the Pitch, Mystryl's Heart, Verden, and Alustra remain user-supplied campaign concepts unless source evidence or explicit homebrew approval is recorded. Do not conflate Ganador with Ghaunadaur, or Mystryl with Mystra.
5. Hazard tuning is unresolved. DC 14 prone, 15 ft/round, 2d6 acid, and a 0.5 movement/viscosity multiplier are proposals, not verified rules. A multiplier without a defined quantity and unit is not executable mechanics.
6. The proposed SQLite ledger is not immutable. A primary key and unique idempotency key do not prevent UPDATE/DELETE. WAL does not provide immutability, and :memory: databases generally do not use WAL journaling. Do not integrate this snippet as the authoritative ledger.
7. Patch event design needs compare-and-swap. An accepted patch should be committed atomically with expected base version, event idempotency, and an append-only event. Reject stale versions and forbidden player-state fields.
8. Status separation matters. Keep workflow status separate from the existing canon_status enum. Use unverified unless homebrew has actually been approved.
9. Three passes and seven traversals must not rewrite historical DR dates. Traversal is campaign progression metadata, not in-world time.
10. Protected Alice baseline remains authoritative: Level 1 female drow Great Old One Warlock, Ghaunadaur patron, Eilistraee influence, custom origin gifts Shield/Acid Splash/Light, and five unselected U01 choices.

## Integration decision
Use the supplied architecture as a proposed narrative outline. Implement only pure, read-only Python helpers now. Keep database writes, patch application, route unlocks, and player-state changes disabled until a secure service and tests exist.

## Recommended file ownership
- moonveil_sphere/core/singularity.py: descriptive metadata only; no cosmology engine claims.
- moonveil_sphere/physics/cataclysm.py: pure proposed hazard calculations; no automatic damage/save changes.
- moonveil_sphere/character/alice_state.py: immutable reference projection only, not the authoritative player save.
- moonveil_sphere/multiverse/transit_engine.py: book-tier metadata only, not route eligibility.
- Ledger: defer until transactional event schema, append-only enforcement, idempotency, and expected-version concurrency are implemented.

## Next verification gates
1. Run unit tests in GitHub Actions.
2. Confirm these modules are clearly marked proposed/read-only.
3. Review all 30 titles, date windows, and locations with source references.
4. Design patch and connection schemas compatible with the existing entity contract.
5. Ask Gemini to supply real backend/event-ledger files; ask Copilot for source-attributed geography.
