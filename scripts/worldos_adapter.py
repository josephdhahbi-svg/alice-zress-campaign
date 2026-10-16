"""Read-only adapters from synthetic LEGO fixtures to WorldOS-shaped projections.

Adapters do not write registries, promote canon status, resolve unknown IDs,
or make routes traversable.
"""


def flatten_temporal(record):
    temporal = record.get("temporal") or {}
    result = dict(record)
    for field in ("timeline_id", "dr_start", "dr_end", "date_precision"):
        result[field] = temporal.get(field, result.get(field))
    result["extensions"] = dict(record.get("extensions") or {})
    if "traversal_id" in temporal or "book_id" in temporal:
        result["extensions"]["campaign_traversal"] = {
            "traversal_id": temporal.get("traversal_id"),
            "book_id": temporal.get("book_id"),
        }
    result.pop("temporal", None)
    return result


def adapt_book_to_atlas(book):
    """Return a WorldOS atlas-shaped, locked placeholder projection."""
    source_number = book.get("book_number")
    expected_id = f"B{source_number:02d}" if isinstance(source_number, int) and 1 <= source_number <= 30 else None
    if expected_id is None or book.get("book_id") != expected_id:
        raise ValueError("book_number_and_book_id_mismatch")
    result = {
        "book_id": expected_id,
        "trilogy_id": f"T{((source_number - 1) // 3) + 1:02d}",
        "sequence": source_number,
        "title": book.get("title"),
        "chronology": {
            "dr_start": (book.get("temporal") or {}).get("dr_start"),
            "dr_end": (book.get("temporal") or {}).get("dr_end"),
            "verification": "pending",
        },
        "entry_routes": [],
        "exit_routes": [],
        "location_ids": [],
        "character_ids": [],
        "faction_ids": [],
        "source_status": "unassigned_placeholder",
        "notes": "Read-only adapter output; title and hazard references remain proposed, not canon-verified.",
        "extensions": {
            "source_bundle_entity_id": book.get("entity_id"),
            "hazard_refs_unresolved": list(book.get("hazard_refs") or []),
            "route_refs_locked": list(book.get("route_refs") or []),
            "tier": book.get("tier"),
            "pass_tier": book.get("pass_tier"),
        },
    }
    return result


def route_is_eligible(route, known_location_ids):
    """Fail closed: fixture routes never become eligible from this adapter."""
    if route.get("canon_status") != "official_verified" and route.get("canon_status") != "homebrew_approved":
        return False
    if route.get("traversable") is not True:
        return False
    if not route.get("origin_id") or not route.get("destination_id"):
        return False
    if route["origin_id"] not in known_location_ids or route["destination_id"] not in known_location_ids:
        return False
    if not route.get("availability_window") or route.get("availability_window") == "unknown":
        return False
    return True
