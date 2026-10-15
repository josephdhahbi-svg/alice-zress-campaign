#!/usr/bin/env python3
"""Validate entity records and the named infrastructure registries."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
schema = json.loads((ROOT / "data/schema.json").read_text(encoding="utf-8"))
errors = []
REGISTRIES = {
    "master_roads_atlas.json": ("books", "locations", "routes", "characters", "crossovers"),
    "netheril_route_graph.json": ("nodes", "edges", "character_routes"),
    "netheril_character_travel_network.json": ("characters",),
    "book_transport_master_sheet.json": ("columns", "routes", "route_modes"),
    "world_communications_network.json": ("channels",),
    "all_30_books_transport_and_mail.json": ("books", "transport_modes", "messaging_services"),
}
for file in sorted((ROOT / "data").glob("*.json")):
    if file.name == "schema.json":
        continue
    try:
        records = json.loads(file.read_text(encoding="utf-8"))
    except (ValueError, OSError) as exc:
        errors.append(f"{file.name}: unreadable JSON: {exc}")
        continue
    if file.name in REGISTRIES:
        if not isinstance(records, dict):
            errors.append(f"{file.name}: expected registry object")
            continue
        for key in REGISTRIES[file.name]:
            if not isinstance(records.get(key), list):
                errors.append(f"{file.name}: expected list at {key}")
        if file.name == "all_30_books_transport_and_mail.json":
            books = records.get("books", [])
            expected = [f"B{i:02d}" for i in range(1, 31)]
            if not isinstance(books, list) or [b.get("book_id") for b in books if isinstance(b, dict)] != expected:
                errors.append(f"{file.name}: expected ordered book slots B01 through B30")
            if len({m.get("mode_id") for m in records.get("transport_modes", []) if isinstance(m, dict)}) != len(records.get("transport_modes", [])):
                errors.append(f"{file.name}: duplicate transport mode")
        continue
    if not isinstance(records, list):
        errors.append(f"{file.name}: expected list of entity records (register new registry explicitly)")
        continue
    for i, rec in enumerate(records):
        if not isinstance(rec, dict):
            errors.append(f"{file.name}[{i}]: expected object")
            continue
        for field in schema["required"]:
            if field not in rec:
                errors.append(f"{file.name}[{i}]: missing {field}")
        if rec.get("continuity_status") not in schema["allowed_continuity_status"]:
            errors.append(f"{file.name}[{i}]: invalid continuity status")
        if rec.get("canon_status") not in schema["allowed_canon_status"]:
            errors.append(f"{file.name}[{i}]: invalid canon status")
print("PASS: entity and infrastructure registry structures valid" if not errors else "\n".join(errors))
raise SystemExit(bool(errors))
