#!/usr/bin/env python3
"""Validate Netheril quest graph connectivity. No gameplay state changes."""
import json
from collections import deque
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
graph = json.loads((ROOT / "data/netheril_route_graph.json").read_text(encoding="utf-8"))
nodes = {n["id"]: n for n in graph["nodes"]}
errors = []
if len(nodes) != len(graph["nodes"]):
    errors.append("duplicate quest node IDs")
for edge in graph["edges"]:
    a, b = edge["from"], edge["to"]
    if a not in nodes:
        errors.append(f"missing origin: {a}")
    if b not in nodes and not b.startswith(("FUTURE_", "ALICE_CROSSOVER_")):
        errors.append(f"missing destination: {b}")
    if a in nodes and b in nodes and nodes[b]["level"] < nodes[a]["level"]:
        errors.append(f"level regression: {a} -> {b}")
    if edge.get("automatic") is not False:
        errors.append(f"automatic transition forbidden: {a} -> {b}")
def reachable(start, end):
    seen, todo = set(), deque([start])
    while todo:
        current = todo.popleft()
        if current == end:
            return True
        if current in seen:
            continue
        seen.add(current)
        if current in nodes:
            todo.extend(nodes[current]["routes"])
    return False
for char in graph["character_routes"]:
    route = char["route"]
    if not route or route[0] != "N01" or route[-1] != "N06":
        errors.append(f"invalid endpoints for {char['id']}")
    for a,b in zip(route,route[1:]):
        if a not in nodes or b not in nodes or b not in nodes[a]["routes"]:
            errors.append(f"broken {char['id']} route: {a}->{b}")
for end in ("N03","N04","N05","N06"):
    if not reachable("N01",end):
        errors.append(f"unreachable: {end}")
if graph.get("safety",{}).get("no_save_mutation") is not True:
    errors.append("missing no-save-mutation safety flag")
if graph.get("safety",{}).get("alice_crossover_locked") is not True:
    errors.append("Alice crossover must remain locked")
print(f"Checked {len(nodes)} nodes, {len(graph['edges'])} edges, {len(graph['character_routes'])} character routes")
print("PASS: Netheril route graph" if not errors else "FAIL:\n" + "\n".join(errors))
raise SystemExit(bool(errors))
