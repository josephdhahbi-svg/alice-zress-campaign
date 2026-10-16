import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AUDIT = ROOT / "data" / "copilot_lego_target_resolution_audit_v1.json"
ATLAS = ROOT / "data" / "master_roads_atlas.json"


class CopilotTargetResolutionAuditTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.audit = json.loads(AUDIT.read_text(encoding="utf-8"))
        cls.atlas = json.loads(ATLAS.read_text(encoding="utf-8"))

    def test_audit_is_read_only_and_unverified(self):
        self.assertEqual(self.audit["status"], "read_only_target_resolution_audit")
        self.assertEqual(self.audit["canon_status"], "unverified")

    def test_book_slots_exist_without_promoting_titles(self):
        atlas_ids = {b["book_id"] for b in self.atlas["books"]}
        self.assertEqual(len(atlas_ids), 30)
        self.assertTrue(all(b["source_status"] == "unassigned_placeholder" for b in self.atlas["books"]))

    def test_hazards_are_unregistered_reference_stubs(self):
        self.assertEqual(self.audit["summary"]["hazard_ids_registered_in_authoritative_atlas"], 0)
        self.assertEqual(self.audit["hazards"]["status"], "all_reference_only_unregistered")

    def test_connections_are_not_integrated(self):
        self.assertEqual(len(self.audit["connections"]), 9)
        self.assertTrue(all(c["integrated"] is False for c in self.audit["connections"]))

    def test_all_routes_remain_locked(self):
        self.assertEqual(len(self.audit["routes"]), 3)
        self.assertTrue(all(r["status"] == "locked_unverified" for r in self.audit["routes"]))

    def test_target_resolution_never_claims_verification(self):
        self.assertTrue(all(c["target_status"] != "verified" for c in self.audit["connections"]))


if __name__ == "__main__":
    unittest.main()
