import json
import unittest
from pathlib import Path

from scripts.worldos_adapter import flatten_temporal, adapt_book_to_atlas, route_is_eligible

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / "tests" / "fixtures" / "copilot_lego_master_bundle_v1.json"


class WorldOSAdapterTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bundle = json.loads(BUNDLE.read_text(encoding="utf-8"))

    def test_temporal_adapter_flattens_shared_fields_and_preserves_traversal_extension(self):
        record = {"entity_id": "x", "temporal": {"timeline_id": None, "dr_start": None,
                  "dr_end": None, "date_precision": "unknown", "traversal_id": None, "book_id": None}}
        result = flatten_temporal(record)
        self.assertNotIn("temporal", result)
        self.assertIsNone(result["dr_start"])
        self.assertEqual(result["date_precision"], "unknown")
        self.assertEqual(result["extensions"]["campaign_traversal"]["traversal_id"], None)

    def test_book_adapter_maps_book_number_to_existing_atlas_slot(self):
        source = self.bundle["books"][1]
        result = adapt_book_to_atlas(source)
        self.assertEqual(result["book_id"], "B02")
        self.assertEqual(result["title"], "The Netherese Enclave Collapse")
        self.assertEqual(result["source_status"], "unassigned_placeholder")
        self.assertEqual(result["entry_routes"], [])
        self.assertTrue(result["extensions"]["hazard_refs_unresolved"])

    def test_book_number_and_id_mismatch_rejected(self):
        source = dict(self.bundle["books"][1], book_id="B03")
        with self.assertRaisesRegex(ValueError, "book_number_and_book_id_mismatch"):
            adapt_book_to_atlas(source)

    def test_unverified_route_never_eligible(self):
        route = self.bundle["routes"][0]
        self.assertFalse(route_is_eligible(route, {"loc_a", "loc_b"}))

    def test_route_missing_endpoints_rejected(self):
        route = {"canon_status": "official_verified", "traversable": True,
                 "origin_id": None, "destination_id": None, "availability_window": "1495 DR"}
        self.assertFalse(route_is_eligible(route, set()))

    def test_route_unknown_window_rejected(self):
        route = {"canon_status": "official_verified", "traversable": True,
                 "origin_id": "a", "destination_id": "b", "availability_window": "unknown"}
        self.assertFalse(route_is_eligible(route, {"a", "b"}))


if __name__ == "__main__":
    unittest.main()
