#!/usr/bin/env python3
"""Validate Moonveil lore records and reusable development components."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
schema = json.loads((DATA / "schema.json").read_text(encoding="utf-8"))
errors = []
checked_files = 0
checked_records = 0


def fail(message):
    errors.append(message)


def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"{path.name}: unable to read valid JSON: {exc}")
        return None


def validate_records(path, records, required_fields, allowed_enums=None):
    global checked_records
    if not isinstance(records, list):
        fail(f"{path.name}: expected a JSON list")
        return
    seen = set()
    for i, rec in enumerate(records):
        checked_records += 1
        label = f"{path.name}[{i}]"
        if not isinstance(rec, dict):
            fail(f"{label}: expected an object")
            continue
        for field in required_fields:
            if field not in rec:
                fail(f"{label}: missing {field}")
        record_id = rec.get("id")
        if not isinstance(record_id, str) or not record_id.strip():
            fail(f"{label}: id must be a non-empty string")
        elif record_id in seen:
            fail(f"{label}: duplicate id {record_id!r} within file")
        else:
            seen.add(record_id)
        for field, allowed in (allowed_enums or {}).items():
            if rec.get(field) not in allowed:
                fail(f"{label}: invalid {field} {rec.get(field)!r}")
    return seen


def validate_components(path, document):
    global checked_records
    if not isinstance(document, dict):
        fail(f"{path.name}: expected a component-registry object")
        return
    components = document.get("components")
    statuses = document.get("status_values", [])
    if not isinstance(components, list):
        fail(f"{path.name}: components must be a list")
        return
    ids = set()
    for i, component in enumerate(components):
        checked_records += 1
        label = f"{path.name}.components[{i}]"
        if not isinstance(component, dict):
            fail(f"{label}: expected an object")
            continue
        for field in ("id", "name", "type", "priority", "status", "dependencies", "purpose"):
            if field not in component:
                fail(f"{label}: missing {field}")
        cid = component.get("id")
        if not isinstance(cid, str) or not cid.strip():
            fail(f"{label}: id must be a non-empty string")
        elif cid in ids:
            fail(f"{label}: duplicate component id {cid!r}")
        else:
            ids.add(cid)
        if component.get("status") not in statuses:
            fail(f"{label}: status is not in status_values")
        if not isinstance(component.get("dependencies", []), list):
            fail(f"{label}: dependencies must be a list")
    for i, component in enumerate(components):
        if not isinstance(component, dict):
            continue
        for dependency in component.get("dependencies", []):
            if dependency not in ids:
                fail(f"{path.name}.components[{i}]: unknown dependency {dependency!r}")
            if dependency == component.get("id"):
                fail(f"{path.name}.components[{i}]: component cannot depend on itself")


def main():
    global checked_files
    lore_enums = {
        "canon_status": schema["allowed_canon_status"],
        "continuity_status": schema["allowed_continuity_status"],
    }
    lore_files = {
        "books.json", "characters.json", "locations.json", "rituals.json",
        "spells.json", "items.json", "quests.json",
    }
    relationship_required = (
        "id", "subject", "predicate", "object", "start_dr", "end_dr",
        "location", "plane", "source", "canon_status", "continuity_status",
    )
    phase_required = ("id", "title", "order", "books", "chronology", "status")
    payoff_required = ("id", "name", "category", "from_book_id", "to_book_id", "setup", "payoff", "mechanism", "paradox_risk", "status", "canon_status", "continuity_status", "source", "notes")
    decision_required = ("id", "question", "status", "options", "current_policy", "evidence", "affected_ids", "decision", "owner_role", "notes")
    scene_required = ("id", "book_id", "scene_number", "title", "status", "canon_status", "continuity_status", "location_id", "historical_date_dr", "campaign_timestamp", "purpose", "opening_text", "origin_gifts", "choice_order", "choices", "dice_policy", "state_effects", "prerequisites", "source", "notes")

    for path in sorted(DATA.glob("*.json")):
        if path.name == "schema.json":
            continue
        document = load_json(path)
        if document is None:
            continue
        checked_files += 1
        if path.name == "development_components.json":
            validate_components(path, document)
        elif path.name in lore_files:
            validate_records(path, document, schema["required"], lore_enums)
        elif path.name == "relationships.json":
            validate_records(path, document, relationship_required, lore_enums)
        elif path.name == "story_phases.json":
            validate_records(path, document, phase_required, {"status": ("planned", "active", "completed", "deprecated")})
        elif path.name == "setup_payoffs.json":
            validate_records(path, document, payoff_required, {
                "status": ("PROPOSED", "IN_PROGRESS", "LOCKED_CANON", "BLOCKED", "DEPRECATED"),
                **lore_enums,
            })
        elif path.name == "decisions.json":
            validate_records(path, document, decision_required, {
                "status": ("CONFLICT", "SOURCE_CHECK_REQUIRED", "RULES_CHECK_REQUIRED", "APPROVED", "REJECTED", "DEPRECATED"),
            })
        elif path.name == "scenes.json":
            validate_records(path, document, scene_required, {
                "status": ("PROPOSED", "IN_PROGRESS", "LOCKED_CANON", "BLOCKED", "DEPRECATED"),
                **lore_enums,
            })
        elif isinstance(document, list) and not document:
            # Empty starter collection: valid, but contains no records to validate.
            continue
        else:
            fail(f"{path.name}: no validator profile registered for this data shape")

    # Cross-file reference checks for the narrative graph and Book 1 scene.
    books_doc = load_json(DATA / "books.json") if (DATA / "books.json").exists() else []
    locations_doc = load_json(DATA / "locations.json") if (DATA / "locations.json").exists() else []
    payoffs_doc = load_json(DATA / "setup_payoffs.json") if (DATA / "setup_payoffs.json").exists() else []
    scenes_doc = load_json(DATA / "scenes.json") if (DATA / "scenes.json").exists() else []
    book_ids = {item.get("id") for item in books_doc if isinstance(item, dict)} if isinstance(books_doc, list) else set()
    location_ids = {item.get("id") for item in locations_doc if isinstance(item, dict)} if isinstance(locations_doc, list) else set()
    payoff_ids = {item.get("id") for item in payoffs_doc if isinstance(item, dict)} if isinstance(payoffs_doc, list) else set()

    if isinstance(payoffs_doc, list):
        for i, payoff in enumerate(payoffs_doc):
            if not isinstance(payoff, dict):
                continue
            for field in ("from_book_id", "to_book_id"):
                if payoff.get(field) not in book_ids:
                    fail(f"setup_payoffs.json[{i}]: {field} references unknown book {payoff.get(field)!r}")
            if payoff.get("from_book_id") == payoff.get("to_book_id"):
                fail(f"setup_payoffs.json[{i}]: setup and payoff must reference different books")

    if isinstance(scenes_doc, list):
        required_order = ["lawful_good", "neutral_good", "chaotic_good", "utility", "action"]
        for i, scene in enumerate(scenes_doc):
            if not isinstance(scene, dict):
                continue
            label = f"scenes.json[{i}]"
            if scene.get("book_id") not in book_ids:
                fail(f"{label}: unknown book_id {scene.get('book_id')!r}")
            if scene.get("location_id") not in location_ids:
                fail(f"{label}: unknown location_id {scene.get('location_id')!r}")
            if scene.get("choice_order") != required_order:
                fail(f"{label}: choice_order must be {required_order!r}")
            choices = scene.get("choices")
            if not isinstance(choices, list) or len(choices) != 5:
                fail(f"{label}: exactly five choices are required")
            else:
                seen_choice_ids = set()
                for j, choice in enumerate(choices):
                    if not isinstance(choice, dict):
                        fail(f"{label}.choices[{j}]: expected an object")
                        continue
                    if not isinstance(choice.get("id"), str) or not choice.get("id"):
                        fail(f"{label}.choices[{j}]: missing choice id")
                    elif choice["id"] in seen_choice_ids:
                        fail(f"{label}: duplicate choice id {choice['id']!r}")
                    else:
                        seen_choice_ids.add(choice["id"])
                    if choice.get("order") != j + 1 or choice.get("kind") != required_order[j]:
                        fail(f"{label}.choices[{j}]: choice order/kind mismatch")
            for payoff_id in scene.get("setup_payoff_ids", []):
                if payoff_id not in payoff_ids:
                    fail(f"{label}: unknown setup/payoff id {payoff_id!r}")

    if errors:
        print("\n".join(errors))
        print(f"FAIL: {len(errors)} issue(s) across {checked_files} data file(s), {checked_records} record(s).")
        return 1
    print(f"PASS: {checked_files} data file(s), {checked_records} record(s); IDs, required metadata, statuses, and component dependencies validated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
