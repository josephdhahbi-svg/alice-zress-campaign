"""Pure validators for synthetic LEGO entity/patch/connection contracts.

These checks are design-time validation only. They do not mutate game state,
apply patches, unlock routes, or write to the immutable event ledger.
"""
from __future__ import annotations

WORKFLOW_STATUSES = {"proposed", "under_review", "accepted", "integrated", "rejected", "deprecated"}
CANON_STATUSES = {"official_verified", "homebrew_approved", "crossover_approved", "unverified"}


def validate_entities(entities):
    errors = []
    seen = set()
    for i, entity in enumerate(entities):
        entity_id = entity.get("entity_id")
        if not entity_id:
            errors.append(f"missing_entity_id:{i}")
        elif entity_id in seen:
            errors.append(f"duplicate_entity_id:{entity_id}")
        else:
            seen.add(entity_id)
        if entity.get("canon_status") not in CANON_STATUSES:
            errors.append(f"invalid_canon_status:{entity_id or i}")
    return errors


def validate_connection(connection, known_entity_ids):
    errors = []
    if connection.get("from_entity") not in known_entity_ids:
        errors.append("missing_source_entity")
    if connection.get("to_entity") not in known_entity_ids:
        errors.append("missing_target_entity")
    if connection.get("canon_status") not in CANON_STATUSES:
        errors.append("invalid_canon_status")
    return errors


def validate_patch_version(patch, current_entity_version):
    if patch.get("target_entity") is None:
        return ["missing_patch_target"]
    if str(patch.get("base_version")) != str(current_entity_version):
        return ["incompatible_version"]
    if not patch.get("patch_id"):
        return ["missing_patch_id"]
    return []


def validate_route_patch(route_entity, patch):
    """An unverified route cannot be made traversable by a patch alone."""
    proposed = patch.get("fields_changed", {})
    makes_traversable = proposed.get("extensions.traversable") is True
    if route_entity.get("entity_type") == "route" and route_entity.get("canon_status") == "unverified" and makes_traversable:
        return ["cannot_traverse_unverified_route"]
    return []
