#!/usr/bin/env python3
"""Validate the proposed Living World and Visual Codex registries, without mutating saves."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = ("asset_id", "entity_id", "asset_type", "canon_status", "depiction_state",
            "historical_dr", "date_precision", "plane_id", "location_id",
            "source_reference", "spoiler_tier", "unlock_event_ids", "file_path")
TYPES = {"character", "npc", "location", "region", "plane", "timeline", "quest",
         "event", "route", "postal_service", "faction", "inventory_item",
         "merchant", "art_asset"}
SOURCE_STATUSES = {"official_verified", "homebrew_approved",
                   "crossover_approved", "unverified"}

def validate(world, codex, modules):
    errors = []
    if world.get("status") != "PROPOSED_NOT_OPERATIONAL":
        errors.append("world: proposal status must not imply operational")
    if world.get("scope") != {"books": 30, "traversals": 7}:
        errors.append("world: expected 30 books and 7 traversals")
    if not TYPES.issubset(set(world.get("entity_types", []))):
        errors.append("world: missing entity types")
    if set(world.get("source_statuses", [])) != SOURCE_STATUSES:
        errors.append("world: source statuses mismatch")
    if not world.get("availability", {}).get("unknown_dates_never_auto_unlock"):
        errors.append("world: unknown dates must fail closed")
    if not world.get("availability", {}).get("player_confirmed_choice_required_for_mutation"):
        errors.append("world: player confirmation required")
    if codex.get("status") != "ART_PRODUCTION_QUEUE_NO_IMAGES_EMBEDDED":
        errors.append("codex: expected planned-only assets")
    seen = set()
    for i, asset in enumerate(codex.get("assets", [])):
        label = f"codex.assets[{i}]"
        for field in REQUIRED:
            if field not in asset:
                errors.append(f"{label}: missing {field}")
        aid = asset.get("asset_id")
        if not aid or aid in seen:
            errors.append(f"{label}: duplicate/missing asset ID")
        seen.add(aid)
        if asset.get("file_path") is not None:
            errors.append(f"{label}: unexpected image file path in planning registry")
        if asset.get("historical_dr") is not None and not isinstance(asset["historical_dr"], int):
            errors.append(f"{label}: historical_dr must be integer or null")
        if not isinstance(asset.get("unlock_event_ids"), list):
            errors.append(f"{label}: unlock_event_ids must be list")
        if not isinstance(asset.get("spoiler_tier"), int) or asset["spoiler_tier"] < 0:
            errors.append(f"{label}: invalid spoiler tier")
    records = modules.get("modules", [])
    if modules.get("count") != 42 or len(records) != 42:
        errors.append("modules: expected exactly 42 proposals")
    if modules.get("status") != "PROPOSED_ONLY_NOT_CODE_VERIFIED":
        errors.append("modules: implementation not verified")
    paths = [x.get("path") for x in records]
    if len(set(paths)) != len(paths):
        errors.append("modules: duplicate paths")
    for record in records:
        if record.get("implementation_status") != "unverified":
            errors.append(f"modules: unverified intake unexpectedly promoted: {record.get('path')}")
    return errors

def main():
    read = lambda name: json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))
    errors = validate(read("living_world_integration_schema_v1.json"),
                      read("visual_codex_manifest_v1.json"),
                      read("gemini_omni_engine_module_registry.json"))
    if errors:
        for error in errors:
            print("ERROR:", error)
        raise SystemExit(1)
    print("PASS: 30 books, 7 traversals, 42 proposed modules, Visual Codex planning records")

if __name__ == "__main__":
    main()
