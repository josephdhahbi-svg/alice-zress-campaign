import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / "tests" / "fixtures"


def load(name):
    return json.loads((FIXTURES / name).read_text(encoding="utf-8"))


class LegoFixtureShapeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.entity = load("lego_encounter_entity_v1.json")
        cls.patch = load("lego_encounter_patch_v2.json")
        cls.connection = load("lego_encounter_connection_v1.json")

    def test_entity_fixture_shape_and_unverified_status(self):
        for field in ("schema_version", "entity_id", "entity_type", "version", "status",
                      "canon_status", "source_reference", "extensions"):
            self.assertIn(field, self.entity)
        self.assertEqual(self.entity["entity_id"], "ENC_NETHERESE_ENCLAVE_COLLAPSE")
        self.assertEqual(self.entity["canon_status"], "unverified")
        self.assertEqual(self.entity["status"], "proposed")
        self.assertIsNone(self.entity["dr_start"])
        self.assertIsNone(self.entity["dr_end"])
        self.assertEqual(self.entity["date_precision"], "unknown")

    def test_patch_fixture_shape_and_not_applied(self):
        for field in ("schema_version", "patch_id", "target_entity", "base_version",
                      "new_version", "status", "canon_status", "fields_changed", "applied"):
            self.assertIn(field, self.patch)
        self.assertEqual(self.patch["target_entity"], self.entity["entity_id"])
        self.assertEqual(self.patch["base_version"], self.entity["version"])
        self.assertGreater(self.patch["new_version"], self.patch["base_version"])
        self.assertFalse(self.patch["applied"])
        self.assertEqual(self.patch["canon_status"], "unverified")
        self.assertIsNone(self.patch["ledger_event_id"])

    def test_connection_fixture_shape_and_unresolved_target(self):
        for field in ("schema_version", "connection_id", "from_entity", "to_entity",
                      "relationship", "version", "status", "canon_status",
                      "source_reference", "requires_target_entity", "integrated"):
            self.assertIn(field, self.connection)
        self.assertEqual(self.connection["from_entity"], self.entity["entity_id"])
        self.assertEqual(self.connection["canon_status"], "unverified")
        self.assertTrue(self.connection["requires_target_entity"])
        self.assertFalse(self.connection["integrated"])
        self.assertIsNone(self.connection["dr_start"])
        self.assertIsNone(self.connection["dr_end"])
        self.assertEqual(self.connection["date_precision"], "unknown")

    def test_fixtures_do_not_grant_gameplay_capabilities(self):
        self.assertNotIn("player_state", self.patch.get("fields_changed", {}))
        self.assertNotIn("inventory", self.patch.get("fields_changed", {}))
        self.assertNotIn("route_unlocked", self.patch.get("fields_changed", {}))
        self.assertFalse(self.patch["applied"])
        self.assertFalse(self.connection["integrated"])


if __name__ == "__main__":
    unittest.main()
