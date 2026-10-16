#!/usr/bin/env python3
"""Validate Moonveil lore records and reusable development components.

Lore records use data/schema.json. The component registry is a separate
planning contract and is validated independently.
"""
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


def validate_lore_file(path, records):
    global checked_records
    if not isinstance(records, list):
        fail(f"{path.name}: expected a JSON list of lore records")
        return
    seen = set()
    for i, rec in enumerate(records):
        checked_records += 1
        label = f"{path.name}[{i}]"
        if not isinstance(rec, dict):
            fail(f"{label}: expected an object")
            continue
        for field in schema["required"]:
            if field not in rec:
                fail(f"{label}: missing {field}")
        record_id = rec.get("id")
        if not isinstance(record_id, str) or not record_id.strip():
            fail(f"{label}: id must be a non-empty string")
        elif record_id in seen:
            fail(f"{label}: duplicate id {record_id!r} within file")
        else:
            seen.add(record_id)
        if rec.get("continuity_status") not in schema["allowed_continuity_status"]:
            fail(f"{label}: invalid continuity status")
        if rec.get("canon_status") not in schema["allowed_canon_status"]:
            fail(f"{label}: invalid canon status")
        if "prerequisites" in rec and not isinstance(rec["prerequisites"], list):
            fail(f"{label}: prerequisites must be a list")


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
    component_path = DATA / "development_components.json"
    for path in sorted(DATA.glob("*.json")):
        if path.name == "schema.json":
            continue
        document = load_json(path)
        if document is None:
            continue
        checked_files += 1
        if path == component_path:
            validate_components(path, document)
        else:
            validate_lore_file(path, document)

    if errors:
        print("\n".join(errors))
        print(f"FAIL: {len(errors)} issue(s) across {checked_files} data file(s), {checked_records} record(s).")
        return 1
    print(f"PASS: {checked_files} data file(s), {checked_records} record(s); IDs, required metadata, statuses, and component dependencies validated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
