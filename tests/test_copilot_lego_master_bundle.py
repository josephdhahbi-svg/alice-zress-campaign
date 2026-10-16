import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUNDLE_PATH = ROOT / "tests" / "fixtures" / "copilot_lego_master_bundle_v1.json"


class CopilotLegoMasterBundleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = json.loads(BUNDLE_PATH.read_text(encoding="utf-8"))

    def test_bundle_is_design_only(self):
        self.assertEqual(self.bundle["status"], "synthetic_design_only_not_integrated")
        self.assertEqual(self.bundle["canon_status"], "unverified")

    def test_counts_match_requested_delivery(self):
        self.assertEqual(len(self.bundle["milestones"]), 10)
        self.assertEqual(len(self.bundle["books"]), 30)
        self.assertEqual(len(self.bundle["patches"]), 9)
        self.assertEqual(len(self.bundle["connections"]), 9)
        self.assertEqual(len(self.bundle["routes"]), 3)
        self.assertEqual(len(self.bundle["negative_fixtures"]), 5)

    def test_three_tiers_are_not_seven_traversals(self):
        self.assertEqual({b["tier"] for b in self.bundle["books"]}, {1, 2, 3})
        self.assertTrue(all(b["temporal"]["traversal_id"] is None for b in self.bundle["books"]))

    def test_book_index_is_complete_and_ordered(self):
        self.assertEqual([b["book_number"] for b in self.bundle["books"]], list(range(1, 31)))
        self.assertEqual([b["book_id"] for b in self.bundle["books"]],
                         [f"B{i:02d}" for i in range(1, 31)])

    def test_milestones_are_non_mutating(self):
        self.assertTrue(all(m["state_effect"] == "none" for m in self.bundle["milestones"]))
        self.assertTrue(all(m["rewards_granted"] == [] for m in self.bundle["milestones"]))
        self.assertTrue(all(m["route_unlocks"] == [] for m in self.bundle["milestones"]))

    def test_patches_are_unapplied_and_versioned(self):
        self.assertTrue(all(p["applied"] is False for p in self.bundle["patches"]))
        self.assertTrue(all(p["expected_base_version"] == 1 and p["new_version"] == 2
                            for p in self.bundle["patches"]))
        self.assertTrue(all(p["ledger_event_id"] is None for p in self.bundle["patches"]))

    def test_connections_are_unintegrated_and_temporally_unknown(self):
        self.assertTrue(all(c["integrated"] is False for c in self.bundle["connections"]))
        self.assertTrue(all(c["requires_target_entity"] for c in self.bundle["connections"]))
        self.assertTrue(all(c["temporal"]["date_precision"] == "unknown"
                            and c["temporal"]["dr_start"] is None for c in self.bundle["connections"]))

    def test_routes_remain_locked(self):
        self.assertTrue(all(r["traversable"] is False for r in self.bundle["routes"]))
        self.assertTrue(all(r["route_status"] == "locked_unverified" for r in self.bundle["routes"]))

    def test_negative_fixtures_all_expect_rejection(self):
        self.assertEqual({x["case_id"] for x in self.bundle["negative_fixtures"]},
                         {"duplicate_entity_id", "missing_connection_endpoint", "stale_patch_version",
                          "forbidden_save_mutation", "unverified_route_unlock"})
        self.assertTrue(all(x["expected"] == "reject" for x in self.bundle["negative_fixtures"]))

    def test_alice_level_one_and_choices_unchanged_in_milestone_baseline(self):
        baseline = next(m for m in self.bundle["milestones"] if m["entity_id"] == "evt_alice_baseline_v1")
        self.assertEqual(baseline["level_threshold"], 1)
        self.assertEqual(baseline["state_effect"], "none")


if __name__ == "__main__":
    unittest.main()
