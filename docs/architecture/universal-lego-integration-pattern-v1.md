# Universal LEGO Integration Pattern v1

Status: PROPOSED SHARED CONTRACT. This document operationalizes Copilot's integration guidance while preserving the existing Moonveil schema and safeguards.

## Principle
Everything is LEGOS: build small, connected, versioned components. Growth means adding meaningful relationships, not disconnected content.

## Six LEGO elements
1. ENTITY: stable identity and domain-specific payload.
2. PATCH: reviewed change with author, reason, version, evidence, and affected IDs.
3. CONNECTION: typed relationship with provenance, direction, and temporal scope.
4. STATUS: workflow status is distinct from canon status. Workflow values: proposed, under_review, accepted, integrated, rejected, deprecated. Preserve existing canon values: official_verified, homebrew_approved, crossover_approved, unverified.
5. VERSION: schema version and record revision; breaking changes require migration and tests.
6. EXTENSIONS: optional namespaced fields that cannot override protected fields or silently change behavior.

## Universal record template
```json
{
  "schema_version": "1.0",
  "entity_id": "ENC_NETHERESE_ENCLAVE_COLLAPSE",
  "entity_type": "encounter",
  "status": "proposed",
  "canon_status": "unverified",
  "version": 1,
  "source_reference": "user_supplied_encounter_brief",
  "timeline_id": null,
  "plane_id": null,
  "location_id": null,
  "dr_start": null,
  "dr_end": null,
  "date_precision": "unknown",
  "connections": [],
  "patch_history": [],
  "extensions": {},
  "state_effect": "none"
}
```

This is a template, not a replacement for the current shared schema.

## Editable does not mean automatically playable
- Content can be revised through reviewed, versioned patches.
- Canon claims require sources.
- Unknown dates remain unknown.
- Unverified routes remain non-traversable.
- Player saves change only through authorized commands and explicit decisions.
- Immutable event history is corrected through compensating events, not overwritten or deleted.
- Artwork never unlocks a quest or route.

## Patch lifecycle
`draft -> proposed -> review -> accepted/rejected -> integrated -> deprecated`

Acceptance requires stable IDs, schema/dependency checks, source review where needed, chronology/geography review where needed, tests for behavior changes, and documentation updates.

## Ownership
- Gemini: authenticated commands, mutable game state, saves, revisions, inventory/rewards, immutable event ledger.
- Copilot: source-attributed WorldOS definitions/read models for geography, chronology, NPCs, factions, settlements, routes, postal, and trade.
- ChatGPT: integration review, canon/rules reconciliation, encounters, adventure, interface, artwork, asset manifest, and acceptance coordination.
- User/player: final authority over player choices, progression, story decisions, and releases.

## Example
ENTITY: `ENC_NETHERESE_ENCLAVE_COLLAPSE`, proposed homebrew and read-only.
PATCH: revise ooze movement only after rules review, recording old/new values and rationale.
CONNECTION: encounter `has_hazard` `HAZ_SEISMIC_TREMORS`.
STATUS: encounter remains proposed; route remains locked.
VERSION: track schema and record revisions separately.
EXTENSIONS: future art IDs and STEAM calculation references.

## Alice protection
Alice remains Level 1, female drow Great Old One Warlock, patron Ghaunadaur, Eilistraee influence, origin gifts Shield, Acid Splash, Light. Five U01 choices remain unselected. Scene date and exact location remain unknown. This contract does not authorize save mutation.

## Acceptance checklist
- IDs are stable and unique.
- Workflow status is distinct from canon status.
- Sources and temporal metadata exist or are explicitly unknown.
- Connections reference entities or are marked unresolved.
- Patches are versioned and reviewable.
- Immutable history is not silently overwritten.
- Unverified routes remain locked.
- Player state changes require authorized commands.
- Art is not canon evidence.
- Tests and handoff are updated when behavior changes.
