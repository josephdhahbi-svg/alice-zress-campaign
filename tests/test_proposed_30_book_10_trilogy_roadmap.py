import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROADMAP = ROOT / "data" / "proposed_30_book_10_trilogy_roadmap_v1.json"
ATLAS = ROOT / "data" / "master_roads_atlas.json"


class ProposedTrilogyRoadmapTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(ROADMAP.read_text(encoding="utf-8"))
        cls.atlas = json.loads(ATLAS.read_text(encoding="utf-8"))

    def test_proposal_is_unverified_and_non_mutating(self):
        self.assertEqual(self.data["status"], "proposed_campaign_roadmap_not_authoritative_atlas")
        self.assertEqual(self.data["canon_status"], "unverified")
        self.assertFalse(self.data["principles"]["route_unlocks_enabled"])
        self.assertFalse(self.data["principles"]["player_state_mutation"])

    def test_exactly_ten_trilogies_and_thirty_books(self):
        self.assertEqual(len(self.data["trilogies"]), 10)
        self.assertEqual(len(self.data["books"]), 30)
        self.assertTrue(all(len(t["book_ids"]) == 3 for t in self.data["trilogies"]))

    def test_book_ids_levels_and_trilogy_links_are_consistent(self):
        for i, book in enumerate(self.data["books"], 1):
            self.assertEqual(book["book_id"], f"B{i:02d}")
            self.assertEqual(book["book_number"], i)
            self.assertEqual(book["proposed_level"], i)
            self.assertEqual(book["trilogy_id"], f"TRILOGY_{((i-1)//3)+1:02d}")

    def test_unknown_dates_and_traversals_remain_null(self):
        self.assertTrue(all(b["temporal"]["dr_start"] is None and
                            b["temporal"]["dr_end"] is None and
                            b["temporal"]["traversal_id"] is None and
                            b["temporal"]["date_precision"] == "unknown"
                            for b in self.data["books"]))

    def test_levels_above_twenty_are_flagged_for_homebrew_review(self):
        self.assertTrue(all(b["rules_review_status"] == "homebrew_level_21_plus_review_required"
                            for b in self.data["books"] if b["proposed_level"] > 20))

    def test_existing_atlas_is_not_replaced_or_promoted(self):
        self.assertEqual(len(self.atlas["books"]), 30)
        self.assertTrue(all(b["source_status"] == "unassigned_placeholder" for b in self.atlas["books"]))

    def test_closed_loop_does_not_assign_historical_dates(self):
        last = self.data["books"][-1]
        first = self.data["books"][0]
        self.assertIsNone(last["temporal"]["dr_end"])
        self.assertIsNone(first["temporal"]["dr_start"])
        self.assertTrue(self.data["principles"]["closed_loop_is_narrative_structure_not_historical_date_rewrite"])


if __name__ == "__main__":
    unittest.main()
