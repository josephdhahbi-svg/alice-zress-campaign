#!/usr/bin/env python3
"""Read-only candidate geography layer exporter. Does not assert routes or modify saves."""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "transport_geography_research_queue_v1.json"

def build_layer(data):
    locations = data.get("locations", [])
    ids = [loc["id"] for loc in locations]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate candidate location ID")
    known = set(ids)
    nodes = []
    for loc in locations:
        nodes.append({
            "id": loc["id"],
            "label": loc["name"],
            "setting": loc["setting"],
            "region": loc["region"],
            "art_asset_id": loc["map_asset_id"],
            "verification": loc["verification"],
            "interactive": False,
            "position": None
        })
    edges = []
    for edge in data.get("candidate_connections", []):
        if edge["from"] not in known or edge["to"] not in known:
            raise ValueError("Candidate connection references unknown location")
        if edge.get("status") != "research_only":
            raise ValueError("Only research-only connections are accepted in this layer")
        edges.append({
            "from": edge["from"],
            "to": edge["to"],
            "style": "dashed",
            "label": "UNVERIFIED - NOT TRAVERSABLE",
            "interactive": False,
            "route_id": None
        })
    return {
        "layer_id": "moonveil_geography_research_v1",
        "kind": "noninteractive_research_overlay",
        "nodes": nodes,
        "edges": edges,
        "legend": {
            "dashed": "proposed connection, not verified",
            "no_coordinates": "placement withheld pending canonical map verification"
        }
    }

def demo():
    fixture = {"locations": [
        {"id": "A", "name": "A", "setting": "Test", "region": "Test", "map_asset_id": "a", "verification": "pending"},
        {"id": "B", "name": "B", "setting": "Test", "region": "Test", "map_asset_id": "b", "verification": "pending"}
    ], "candidate_connections": [{"from": "A", "to": "B", "status": "research_only"}]}
    layer = build_layer(fixture)
    assert len(layer["nodes"]) == 2 and len(layer["edges"]) == 1
    assert not any(x["interactive"] for x in layer["nodes"] + layer["edges"])
    assert layer["edges"][0]["route_id"] is None
    try:
        build_layer({"locations": fixture["locations"], "candidate_connections": [{"from": "A", "to": "X", "status": "research_only"}]})
        raise AssertionError("Unknown endpoint accepted")
    except ValueError:
        pass
    print("PASS: safe candidate map overlay, no playable routes, unknown endpoint rejected")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo", action="store_true")
    args = parser.parse_args()
    if args.demo:
        demo()
    else:
        print(json.dumps(build_layer(json.loads(INPUT.read_text(encoding="utf-8"))), indent=2))
