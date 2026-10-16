import json
import unittest
from pathlib import Path

from moonveil_sphere.integration.contract_validation import (
    validate_space_time_context, validate_entity, validate_patch, validate_connection
)

ROOT = Path(__file__).resolve().parents[1]


class SphericalLegoIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.u01 = json.loads((ROOT / "data" / "alice_u01_read_model_v1.json").read_text(encoding="utf-8"))
        fixtures = ROOT / "tests" / "fixtures"
        cls.entity = json.loads((fixtures / "lego_encounter_entity_v1.json").read_text(encoding="utf-8"))
        cls.patch = json.loads((fixtures / "lego_encounter_patch_v2.json").read_text(encoding="utf-8"))
        cls.connection = json.loads((fixtures / "lego_encounter_connection_v1.json").read_text(encoding="utf-8"))

    def test_u01_space_time_contract_valid(self):
        self.assertEqual(validate_space_time_context(self.u01["space_time_context"]), [])

    def test_unknown_date_with_value_rejected(self):
        ctx = json.loads(json.dumps(self.u01["space_time_context"]))
        ctx["time"]["dr_start"] = "1495 DR"
        self.assertIn("unknown_date_must_remain_null", validate_space_time_context(ctx))

    def test_invalid_traversal_and_book_rejected(self):
        ctx = json.loads(json.dumps(self.u01["space_time_context"]))
        ctx["traversal"]["traversal_id"] = 8
        ctx["traversal"]["book_id"] = "B31"
        errors = validate_space_time_context(ctx)
        self.assertIn("invalid_traversal_id", errors)
        self.assertIn("invalid_book_id", errors)

    def test_entity_fixture_matches_minimum_contract(self):
        self.assertEqual(validate_entity(self.entity), [])

    def test_patch_fixture_uses_matching_base_version(self):
        self.assertEqual(validate_patch(self.patch, self.entity), [])

    def test_stale_patch_rejected(self):
        patch = dict(self.patch, base_version=99)
        self.assertIn("incompatible_base_version", validate_patch(patch, self.entity))

    def test_patch_cannot_touch_player_state(self):
        patch = dict(self.patch, fields_changed={"inventory": {"item": "forbidden"}})
        self.assertIn("patch_touches_protected_player_state", validate_patch(patch, self.entity))

    def test_connection_rejects_missing_target(self):
        errors = validate_connection(self.connection, {self.entity["entity_id"]})
        self.assertIn("missing_target_entity", errors)

    def test_connection_passes_when_both_entities_exist(self):
        known = {self.connection["from_entity"], self.connection["to_entity"]}
        self.assertEqual(validate_connection(self.connection, known), [])

    def test_alice_protected_state_is_unchanged(self):
        character = self.u01["character"]
        self.assertEqual(character["level"], 1)
        self.assertEqual([c["id"] for c in self.u01["choices"]],
                         ["LAWFUL_GOOD", "NEUTRAL_GOOD", "CHAOTIC_GOOD", "UTILITY", "ACTION"])
        self.assertTrue(all(c["selected"] is False for c in self.u01["choices"]))
        self.assertFalse(self.u01["mutates_game_state"])


if __name__ == "__main__":
    unittest.main()
