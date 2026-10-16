# Moonveil Spherical Space-Time Contract v1

Status: **PROPOSED ARCHITECTURE CONTRACT — NOT AN OPERATIONAL ENGINE**.
Purpose: model the campaign as one connected universe across space, time, causality, and traversal without treating these dimensions as interchangeable.

## Design rule
The “sphere” is a conceptual navigation and dependency model, not a claim that every D&D plane is literally spherical. Each entity/event can connect to multiple dimensions, but each dimension retains its own semantics.

## Four independent axes
1. **Space**: `plane_id`, `world_id`, `region_id`, `location_id`; optional coordinates only when sourced or explicitly homebrew.
2. **Time**: `timeline_id`, `dr_start`, `dr_end`, `date_precision`; unknown dates remain null and must not be guessed.
3. **Causality**: `cause_event_ids`, `prerequisite_event_ids`, `consequence_event_ids`; edges require provenance and cannot silently rewrite history.
4. **Traversal**: `traversal_id` in 1..7, `book_id` in B01..B30, `book_sequence`; traversal is campaign progression, not historical time.

## Shared entity reference
This contract extends, rather than replaces, `data/living_world_integration_schema_v1.json`:
- `entity_id`
- `entity_type`
- `canon_status`
- `source_reference`
- `timeline_id`
- `plane_id`
- `location_id`
- `dr_start`, `dr_end`, `date_precision`
- `availability_status`
- `prerequisite_event_ids`

Use the existing canon statuses: `official_verified`, `homebrew_approved`, `crossover_approved`, `unverified`. Do not introduce competing status enums without a reviewed migration.

## Proposed event record
```json
{
  "schema_version": "1.0",
  "event_id": "EVT_PROPOSED_EXAMPLE",
  "event_type": "cosmological_disturbance",
  "canon_status": "unverified",
  "source_reference": "user_supplied_story_brief",
  "timeline_id": null,
  "plane_id": null,
  "location_id": null,
  "dr_epoch_date": null,
  "date_precision": "unknown",
  "traversal_id": null,
  "book_id": null,
  "cause_event_ids": [],
  "prerequisite_event_ids": [],
  "consequence_event_ids": [],
  "availability_status": "unverified",
  "state_effect": "none"
}
```

This is a template, not a claim that the example event exists in official canon or has occurred in Alice's save.

## Book traversal rules
- There are 30 book slots and seven traversal IDs.
- Within a traversal, B01 → B02 → ... → B30 is the structural sequence, subject to campaign design and explicit player choices.
- B30 in traversal N may lead structurally to B01 in traversal N+1.
- This structural transition does **not** set, rewind, or infer `dr_epoch_date`.
- Traversal 7 has no implied traversal 8.
- A book slot is not a published adventure title unless the roadmap explicitly verifies that mapping.

## Availability and fail-closed rules
- Unknown dates never auto-unlock routes, quests, characters, or items.
- Spatial proximity does not establish a traversable route.
- A route must be directed, sourced, historically available, and prerequisite-valid.
- A causal edge requires an identified event and a stated relationship; narrative similarity is not proof of causation.
- Generated artwork cannot establish geography, chronology, or route availability.
- Mutable player state is owned by Gemini's authoritative command/event service; this document grants no write authority.

## Ownership boundaries
- **Copilot / WorldOS**: source-attributed static definitions and read-only world projections.
- **Gemini / game authority**: authenticated commands, mutable character/party state, immutable gameplay event history, revisions, saves.
- **ChatGPT / integration**: contract reconciliation, canon review, adventure/UI/artwork, test coordination.
- **Player**: final choice, progression, and story decisions.

## U01 protection
Alice Z'ress remains Level 1, female drow Great Old One Warlock, Ghaunadaur patron, Eilistraee influence, with custom origin gifts Shield, Acid Splash, Light. `U01_SILVER_COURIER` retains the five unselected choices in their established order. The scene date stays unknown; routes stay locked; no save changes are authorized.

## Acceptance tests for future implementation
1. Reject `traversal_id` outside 1..7.
2. Reject book IDs outside B01..B30.
3. Permit B30→B01 only as a structural transition to the next traversal; do not mutate historical date.
4. Preserve null dates and unknown precision.
5. Reject an unverified or undirected route as traversable.
6. Reject references to nonexistent prerequisite/cause event IDs.
7. Preserve the existing canon-status enum.
8. Ensure read-only projections cannot mutate character state.
9. Ensure asset metadata cannot unlock routes.
10. Keep Alice's five choices unselected unless a separate authorized player command is implemented and explicitly confirmed.

## Open decisions
- Canonical campaign timeline IDs and the complete book-to-trilogy mapping require review.
- The Pitch of Ganador and the Triad remain campaign proposals unless independently sourced/approved.
- No universal DR baseline is defined.
- Exact geography for the Netherese Enclave Collapse remains unverified pending Copilot source review.

## Next implementation order
1. Add synthetic contract fixtures.
2. Extend existing validators without changing current schema semantics.
3. Test the current road atlas and read model against this contract.
4. Obtain Copilot's source-attributed locations and Gemini's secure event interfaces.
5. Integrate only after tests run against a complete checkout.
