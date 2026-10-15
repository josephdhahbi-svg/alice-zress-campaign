#!/usr/bin/env python3
"""Read-only, fail-closed Moonveil route planner; never mutates saves or time."""
import argparse
import json
from collections import deque
from pathlib import Path

ATLAS = Path(__file__).resolve().parents[1] / "data" / "master_roads_atlas.json"

def eligible(route, dr_year, events, character_id):
    if route.get("route_status") != "operational":
        return False
    if route.get("continuity_review") in ("pending", "rejected"):
        return False
    if route.get("source_status") in ("unverified", "original crossover proposal", "homebrew proposal"):
        return False
    window = route.get("time_window")
    if not isinstance(window, dict):
        return False
    first, last = window.get("dr_start"), window.get("dr_end")
    if dr_year is None or first is None or last is None or not first <= dr_year <= last:
        return False
    if route.get("character_id") and route["character_id"] != character_id:
        return False
    if route.get("player_choice_required") and not route.get("player_choice_confirmed", False):
        return False
    if not set(route.get("required_event_ids", [])).issubset(events):
        return False
    if set(route.get("forbidden_event_ids", [])) & events:
        return False
    if route.get("prerequisites") and not route.get("prerequisites_verified", False):
        return False
    return True

def find_route(data, start, goal, *, dr_year=None, completed_events=(), character_id=None):
    locations = {x["location_id"] for x in data.get("locations", [])}
    if start not in locations or goal not in locations:
        return {"status": "unknown_location", "path": [], "routes": []}
    if dr_year is None:
        return {"status": "date_required", "path": [], "routes": []}
    events = set(completed_events)
    graph = {}
    for route in data.get("routes", []):
        if not eligible(route, dr_year, events, character_id):
            continue
        a, b = route.get("origin_location_id"), route.get("destination_location_id")
        if a in locations and b in locations:
            graph.setdefault(a, []).append((b, route["route_id"]))
    queue = deque([(start, [start], [])])
    visited = {start}
    while queue:
        current, stops, legs = queue.popleft()
        if current == goal:
            return {"status": "available", "path": stops, "routes": legs}
        for nxt, rid in graph.get(current, []):
            if nxt not in visited:
                visited.add(nxt)
                queue.append((nxt, stops + [nxt], legs + [rid]))
    return {"status": "unavailable", "path": [], "routes": []}

def demo():
    data = {"locations": [{"location_id": x} for x in ("A", "B", "C")], "routes": []}
    def leg(rid, a, b):
        return {"route_id": rid, "origin_location_id": a, "destination_location_id": b,
                "route_status": "operational", "source_status": "verified_homebrew",
                "continuity_review": "approved",
                "time_window": {"dr_start": 1490, "dr_end": 1500},
                "player_choice_required": True, "player_choice_confirmed": True,
                "required_event_ids": ["ROAD_FOUND"]}
    data["routes"] = [leg("AB", "A", "B"), leg("BC", "B", "C"), leg("AC", "A", "C")]
    data["routes"][2]["route_status"] = "locked_pending_verification"
    good = {"dr_year": 1495, "completed_events": {"ROAD_FOUND"}}
    assert find_route(data, "A", "C", **good)["routes"] == ["AB", "BC"]
    assert find_route(data, "C", "A", **good)["status"] == "unavailable"
    assert find_route(data, "A", "C", dr_year=1489, completed_events={"ROAD_FOUND"})["status"] == "unavailable"
    assert find_route(data, "A", "C", dr_year=1495)["status"] == "unavailable"
    assert find_route(data, "A", "C")["status"] == "date_required"
    data["routes"][1]["route_status"] = "disrupted"
    assert find_route(data, "A", "C", **good)["status"] == "unavailable"
    assert find_route(data, "A", "X", **good)["status"] == "unknown_location"
    print("PASS: 7 checks: directed, locked, dated, event-gated, missing-date, disrupted, unknown location")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("origin", nargs="?")
    parser.add_argument("destination", nargs="?")
    parser.add_argument("--dr", type=int)
    parser.add_argument("--demo", action="store_true")
    args = parser.parse_args()
    if args.demo:
        demo()
    elif args.origin and args.destination:
        data = json.loads(ATLAS.read_text(encoding="utf-8"))
        print(json.dumps(find_route(data, args.origin, args.destination, dr_year=args.dr), indent=2))
    else:
        parser.error("provide origin and destination with --dr, or --demo")
