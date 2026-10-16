import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / "tests" / "continuity" / "spherical_space_time_fixtures_v1.json"
ATLAS = ROOT / "data" / "master_roads_atlas.json"
SCHEMA = ROOT / "data" / "living_world_integration_schema_v1.json"
ALICE = ROOT / "data" / "alice_u01_read_model_v1.json"

class SphericalSpaceTimeContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixtures = json.loads(FIXTURE.read_text(encoding="utf-8"))
        cls.atlas = json.loads(ATLAS.read_text(encoding="utf-8"))
        cls.schema = json.loads(SCHEMA.read_text(encoding="utf-8"))
        cls.alice = json.loads(ALICE.read_text(encoding="utf-8"))

    def test_fixtures_are_synthetic(self):
        self.assertEqual(self.fixtures["status"], "SYNTHETIC_ONLY_NOT_CANON")

    def test_traversal_fixture_does_not_infer_historical_date(self):
        case = next(x for x in self.fixtures["fixtures"] if x["id"] == "TRAVERSAL_B30_TO_B01")
        self.assertEqual(case["traversal"]["from_book"], "B30")
        self.assertEqual(case["traversal"]["to_book"], "B01")
        self.assertIsNone(case["time"]["dr_epoch_date"])
        self.assertEqual(case["expected"], "valid_structural_transition_without_historical_date_change")

    def test_eighth_traversal_rejected_fixture(self):
        case = next(x for x in self.fixtures["fixtures"] if x["id"] == "TRAVERSAL_EIGHT_REJECTED")
        self.assertEqual(case["traversal"]["from_traversal"], 7)
        self.assertEqual(case["traversal"]["to_traversal"], 8)
        self.assertEqual(case["expected"], "reject_invalid_traversal")

    def test_unknown_dates_fail_closed(self):
        case = next(x for x in self.fixtures["fixtures"] if x["id"] == "UNKNOWN_DATE_STAYS_UNKNOWN")
        self.assertIsNone(case["time"]["dr_epoch_date"])
        self.assertEqual(case["expected"], "preserve_null_and_do_not_unlock")

    def test_unverified_route_is_locked(self):
        case = next(x for x in self.fixtures["fixtures"] if x["id"] == "UNVERIFIED_ROUTE_BLOCKED")
        self.assertEqual(case["route"]["source_status"], "unverified")
        self.assertEqual(case["route"]["route_status"], "locked")

    def test_existing_canon_status_values_preserved(self):
        self.assertEqual(self.schema["source_statuses"], ["official_verified", "homebrew_approved", "crossover_approved", "unverified"])

    def test_atlas_is_not_misrepresented_as_operational(self):
        self.assertEqual(self.atlas["status"], "seeded_design_graph")
        self.assertTrue(all(book["source_status"] == "unassigned_placeholder" for book in self.atlas["books"]))

    def test_u01_space_time_dimensions_are_separate_and_unknown(self):
        context = self.alice["space_time_context"]
        self.assertIsNone(context["space"]["location_id"])
        self.assertIsNone(context["time"]["timeline_id"])
        self.assertIsNone(context["time"]["dr_start"])
        self.assertEqual(context["time"]["date_precision"], "unknown")
        self.assertEqual(context["causality"]["status"], "not_established")
        self.assertIsNone(context["traversal"]["traversal_id"])
        self.assertIsNone(context["traversal"]["book_id"])

    def test_alice_protected_state_remains_unselected(self):
        self.assertEqual(self.alice["character"]["level"], 1)
        self.assertTrue(all(not c["selected"] for c in self.alice["choices"]))
        self.assertFalse(self.alice["mutates_game_state"])

if __name__ == "__main__":
    unittest.main()
