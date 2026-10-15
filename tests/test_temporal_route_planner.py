"""Read-only route gating tests. Run: python -m unittest discover -s tests -v"""
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from route_planner import find_route

def route(name, origin="A", destination="B", **updates):
    data = dict(route_id=name, origin_location_id=origin, destination_location_id=destination,
        route_status="operational", source_status="verified_homebrew",
        continuity_review="approved", time_window={"dr_start": 1490, "dr_end": 1500},
        player_choice_required=True, player_choice_confirmed=True,
        required_event_ids=["KEY_FOUND"])
    data.update(updates)
    return data

class RoutePlannerTests(unittest.TestCase):
    def setUp(self):
        self.atlas = {"locations": [{"location_id": x} for x in "ABC"],
                      "routes": [route("AB"), route("BC", "B", "C")]}
        self.kw = dict(dr_year=1495, completed_events={"KEY_FOUND"})

    def test_directed(self):
        self.assertEqual(find_route(self.atlas, "A", "C", **self.kw)["routes"], ["AB", "BC"])
        self.assertEqual(find_route(self.atlas, "C", "A", **self.kw)["status"], "unavailable")

    def test_locked_disrupted_and_proposed(self):
        for status in ("locked", "disrupted", "proposed", "under_construction"):
            with self.subTest(status=status):
                self.atlas["routes"][0]["route_status"] = status
                self.assertEqual(find_route(self.atlas, "A", "C", **self.kw)["status"], "unavailable")

    def test_dates_and_unknown_date(self):
        self.assertEqual(find_route(self.atlas, "A", "B")["status"], "date_required")
        for year in (1489, 1501):
            self.assertEqual(find_route(self.atlas, "A", "B", dr_year=year, completed_events={"KEY_FOUND"})["status"], "unavailable")

    def test_event_and_choice(self):
        self.assertEqual(find_route(self.atlas, "A", "B", dr_year=1495)["status"], "unavailable")
        self.atlas["routes"][0]["player_choice_confirmed"] = False
        self.assertEqual(find_route(self.atlas, "A", "B", **self.kw)["status"], "unavailable")

    def test_character_gate(self):
        self.atlas["routes"][0]["character_id"] = "NPC_A"
        self.assertEqual(find_route(self.atlas, "A", "B", **self.kw)["status"], "unavailable")
        self.assertEqual(find_route(self.atlas, "A", "B", character_id="NPC_A", **self.kw)["status"], "available")

    def test_forbidden_event_and_prerequisite(self):
        self.atlas["routes"][0]["forbidden_event_ids"] = ["PORTAL_COLLAPSED"]
        self.assertEqual(find_route(self.atlas, "A", "B", dr_year=1495, completed_events={"KEY_FOUND", "PORTAL_COLLAPSED"})["status"], "unavailable")
        self.atlas["routes"][0]["prerequisites"] = ["RITUAL"]
        self.assertEqual(find_route(self.atlas, "A", "B", **self.kw)["status"], "unavailable")

    def test_unknown_location(self):
        self.assertEqual(find_route(self.atlas, "A", "Z", **self.kw)["status"], "unknown_location")

if __name__ == "__main__":
    unittest.main()
