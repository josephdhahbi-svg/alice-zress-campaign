#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
schema = json.loads((ROOT / "data/schema.json").read_text(encoding="utf-8"))
errors = []
for file in sorted((ROOT / "data").glob("*.json")):
    if file.name == "schema.json":
        continue
    records = json.loads(file.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        errors.append(f"{file.name}: expected list")
        continue
    for i, rec in enumerate(records):
        for field in schema["required"]:
            if field not in rec:
                errors.append(f"{file.name}[{i}]: missing {field}")
        if rec.get("continuity_status") not in schema["allowed_continuity_status"]:
            errors.append(f"{file.name}[{i}]: invalid continuity status")
        if rec.get("canon_status") not in schema["allowed_canon_status"]:
            errors.append(f"{file.name}[{i}]: invalid canon status")
print("PASS: metadata structure valid" if not errors else "\n".join(errors))
raise SystemExit(bool(errors))
