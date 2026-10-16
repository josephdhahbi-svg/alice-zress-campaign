"""Fail-closed validation helpers for the proposed spherical space-time contract.

Pure validation only: no writes, route unlocking, or player-state mutation.
"""
CANON_STATUSES = {"official_verified", "homebrew_approved", "crossover_approved", "unverified"}


def validate_space_time_context(context):
    errors = []
    if not isinstance(context, dict):
        return ["space_time_context_must_be_object"]
    for axis in ("space", "time", "causality", "traversal"):
        if not isinstance(context.get(axis), dict):
            errors.append(f"missing_or_invalid_axis:{axis}")
    time = context.get("time", {})
    if time.get("date_precision") == "unknown":
        if time.get("dr_start") is not None or time.get("dr_end") is not None:
            errors.append("unknown_date_must_remain_null")
    traversal = context.get("traversal", {})
    tid = traversal.get("traversal_id")
    if tid is not None and (not isinstance(tid, int) or not 1 <= tid <= 7):
        errors.append("invalid_traversal_id")
    book = traversal.get("book_id")
    if book is not None and book not in {f"B{i:02d}" for i in range(1, 31)}:
        errors.append("invalid_book_id")
    return errors


def validate_entity(entity):
    errors = []
    for key in ("entity_id", "entity_type", "canon_status", "version"):
        if key not in entity:
            errors.append(f"missing_entity_field:{key}")
    if entity.get("canon_status") not in CANON_STATUSES:
        errors.append("invalid_canon_status")
    return errors


def validate_patch(patch, entity):
    errors = []
    if patch.get("target_entity") != entity.get("entity_id"):
        errors.append("patch_target_mismatch")
    if str(patch.get("base_version")) != str(entity.get("version")):
        errors.append("incompatible_base_version")
    if not patch.get("patch_id"):
        errors.append("missing_patch_id")
    changed = patch.get("fields_changed", {})
    forbidden = {"player_state", "inventory", "xp", "route_unlocked"}
    if any(any(part in forbidden for part in path.split(".")) for path in changed):
        errors.append("patch_touches_protected_player_state")
    if entity.get("entity_type") == "route" and entity.get("canon_status") == "unverified":
        if changed.get("extensions.traversable") is True:
            errors.append("cannot_traverse_unverified_route")
    return errors


def validate_connection(connection, known_entity_ids):
    errors = []
    if connection.get("from_entity") not in known_entity_ids:
        errors.append("missing_source_entity")
    if connection.get("to_entity") not in known_entity_ids:
        errors.append("missing_target_entity")
    if connection.get("canon_status") not in CANON_STATUSES:
        errors.append("invalid_connection_canon_status")
    return errors

def validate_causal_chain(chain):
    """Validate a proposed causal graph without applying any event."""
    errors = []
    if chain.get("status") != "PROPOSED_CAUSAL_CHAIN_READ_ONLY":
        errors.append("causal_chain_must_remain_proposed_read_only")
    if chain.get("state_effect") != "none":
        errors.append("causal_chain_must_have_no_state_effect")
    if chain.get("canon_status") not in CANON_STATUSES:
        errors.append("invalid_causal_chain_canon_status")
    events = chain.get("events", [])
    ids = [event.get("event_id") for event in events]
    if any(not event_id for event_id in ids):
        errors.append("missing_causal_event_id")
    if len(ids) != len(set(ids)):
        errors.append("duplicate_causal_event_id")
    known = set(ids)
    for event in events:
        event_id = event.get("event_id")
        if event.get("canon_status") not in CANON_STATUSES:
            errors.append(f"invalid_event_canon_status:{event_id}")
        for field in ("cause_event_ids", "consequence_event_ids", "prerequisite_event_ids"):
            refs = event.get(field, [])
            if not isinstance(refs, list):
                errors.append(f"invalid_event_reference_list:{event_id}:{field}")
                continue
            for ref in refs:
                # This one token represents a future player action, not an event that already exists.
                if ref == "PLAYER_CONFIRMED_U01_CHOICE":
                    if field != "prerequisite_event_ids":
                        errors.append(f"player_choice_token_not_prerequisite:{event_id}")
                    continue
                if ref not in known:
                    errors.append(f"unknown_event_reference:{event_id}:{ref}")
        if event.get("status") == "locked_preview" and event.get("event_type") == "quest_opportunity":
            if "PLAYER_CONFIRMED_U01_CHOICE" not in event.get("prerequisite_event_ids", []):
                errors.append(f"quest_preview_missing_player_choice_gate:{event_id}")
    for event in events:
        event_id = event.get("event_id")
        for cause in event.get("cause_event_ids", []):
            if cause in known and event_id not in next(e for e in events if e.get("event_id") == cause).get("consequence_event_ids", []):
                errors.append(f"causal_link_not_reciprocal:{cause}:{event_id}")
        for consequence in event.get("consequence_event_ids", []):
            if consequence in known and event_id not in next(e for e in events if e.get("event_id") == consequence).get("cause_event_ids", []):
                errors.append(f"causal_link_not_reciprocal:{event_id}:{consequence}")
    if chain.get("date_precision") == "unknown" and chain.get("dr_epoch_date") is not None:
        errors.append("unknown_chain_date_must_remain_null")
    return errors
