"""Read-only validator for proposed Alice route graph. Python 3 stdlib only."""
import json
from pathlib import Path


def validate(graph):
    nodes = {n["id"] for n in graph["nodes"]}
    assert len(nodes) == len(graph["nodes"]), "Duplicate node IDs"
    edges = {e["id"] for e in graph["edges"]}
    assert len(edges) == len(graph["edges"]), "Duplicate edge IDs"
    for edge in graph["edges"]:
        assert edge["from"] in nodes and edge["to"] in nodes, edge["id"]
        assert edge["prerequisites"], edge["id"]
        assert edge["risk"], edge["id"]
        assert edge["alternative"], edge["id"]
    adjacency = {}
    for edge in graph["edges"]:
        adjacency.setdefault(edge["from"], []).append(edge["to"])
    reached = {"U_SAFE"}
    frontier = ["U_SAFE"]
    while frontier:
        for target in adjacency.get(frontier.pop(), []):
            if target not in reached:
                reached.add(target)
                frontier.append(target)
    assert {"U_SAFE", "A_WAY", "V_FOOT"} <= reached, "Book route disconnected"
    return len(nodes), len(edges)


if __name__ == "__main__":
    path = Path(__file__).with_name("world_route_graph.json")
    print("validated nodes/edges:", *validate(json.loads(path.read_text(encoding="utf-8"))))
