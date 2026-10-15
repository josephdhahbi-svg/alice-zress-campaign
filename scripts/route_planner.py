#!/usr/bin/env python3
"""Moonveil travel graph query. Planning tool; never mutates player saves.

Usage: python scripts/route_planner.py LOC_WATERDEEP LOC_DAGGER_FALLS
       python scripts/route_planner.py --demo
Only routes explicitly marked operational are traversable.
"""
import argparse
import json
from collections import deque
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / "data" / "master_roads_atlas.json"
ALLOWED = {"operational"}
def find_route(data, start, goal, *, allow_locked=False):
    locations = {x["location_id"] for x in data.get("locations", [])}
    if start not in locations or goal not in locations:
        return {"status": "unknown_location", "path": [], "routes": []}
    graph = {}
    for route in data.get("routes", []):
        status = route.get("route_status", route.get("operational_status", "unverified"))
        if status not in ALLOWED and not allow_locked:
            continue
        if route.get("player_choice_required") is False:
            continue
        a, b = route.get("origin_location_id"), route.get("destination_location_id")
        if a not in locations or b not in locations:
            continue
        graph.setdefault(a, []).append((b, route["route_id"]))
    queue = deque([(start, [start], [])])
    visited = {start}
    while queue:
        current, stops, routes = queue.popleft()
        if current == goal:
            return {"status": "available", "path": stops, "routes": routes}
        for nxt, rid in graph.get(current, []):
            if nxt not in visited:
                visited.add(nxt)
                queue.append((nxt, stops + [nxt], routes + [rid]))
    return {"status": "unavailable", "path": [], "routes": []}
def demo():
    fixture = {"locations": [{"location_id": x} for x in ("A","B","C")],
      "routes": [
        {"route_id":"r1","origin_location_id":"A","destination_location_id":"B","route_status":"operational","player_choice_required":True},
        {"route_id":"r2","origin_location_id":"B","destination_location_id":"C","route_status":"operational","player_choice_required":True},
        {"route_id":"r3","origin_location_id":"A","destination_location_id":"C","route_status":"locked_pending_verification","player_choice_required":True}]}
    assert find_route(fixture,"A","C")["routes"] == ["r1","r2"]
    fixture["routes"][1]["route_status"] = "disrupted"
    assert find_route(fixture,"A","C")["status"] == "unavailable"
    assert find_route(fixture,"A","X")["status"] == "unknown_location"
    print("PASS: operational multi-stop route, locked shortcut, disruption, unknown location")
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("origin", nargs="?")
    parser.add_argument("destination", nargs="?")
    parser.add_argument("--demo", action="store_true")
    args = parser.parse_args()
    if args.demo:
        demo()
    elif args.origin and args.destination:
        data = json.loads(ATLAS.read_text(encoding="utf-8"))
        print(json.dumps(find_route(data,args.origin,args.destination),indent=2))
    else:
        parser.error("provide origin and destination or --demo")
