#!/usr/bin/env python3
"""Static validation for Moonveil temporal design fixtures; no gameplay writes."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / "data" / "master_roads_atlas.json"
SCENARIOS = ROOT / "data" / "temporal_route_scenarios.json"

def validate():
    atlas = json.loads(ATLAS.read_text(encoding="utf-8"))
    doc = json.loads(SCENARIOS.read_text(encoding="utf-8"))
    locations = {item["location_id"] for item in atlas["locations"]}
    ids = set()
    errors = []
    if len(atlas["books"]) != 30:
        errors.append("Expected 30 atlas book slots")
    for record in doc["scenarios"]:
        sid = record.get("scenario_id")
        if not sid or sid in ids:
            errors.append(f"Missing or duplicate scenario ID: {sid}")
        ids.add(sid)
        for key in ("origin_location_id", "destination_location_id", "location_id"):
            if key in record and record[key] not in locations:
                errors.append(f"{sid}: unknown {key}={record[key]}")
        if record.get("source_status") != "homebrew_test_fixture":
            errors.append(f"{sid}: fixture source must be homebrew_test_fixture")
        if record.get("expected_initial_access") is not False:
            errors.append(f"{sid}: initial access must be false")
        if "valid_from_dr" in record and "valid_until_dr" in record:
            start, end = record["valid_from_dr"], record["valid_until_dr"]
            if start is not None and end is not None and start > end:
                errors.append(f"{sid}: inverted DR window")
        if record.get("mode") == "portal" and record.get("direction") != "one_way":
            errors.append(f"{sid}: portal fixture must be directed")
    if not doc.get("rules", {}).get("unknown_dates_block_automatic_unlock"):
        errors.append("Unknown dates must block automatic unlock")
    if errors:
        for error in errors:
            print("ERROR:", error)
        raise SystemExit(1)
    print(f"PASS: {len(atlas['books'])} book slots, {len(locations)} atlas locations, {len(ids)} temporal fixtures")
if __name__ == "__main__":
    validate()
