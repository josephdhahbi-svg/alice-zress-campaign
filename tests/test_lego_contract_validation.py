import unittest
from scripts.lego_contract import (
    validate_entities,
    validate_connection,
    validate_patch_version,
    validate_route_patch,
)


class LegoContractTests(unittest.TestCase):
    def test_duplicate_entity_id_rejected(self):
        entity = {"entity_id": "enc_netherese_enclave_collapse", "canon_status": "unverified"}
        errors = validate_entities([entity, dict(entity)])
        self.assertIn("duplicate_entity_id:enc_netherese_enclave_collapse", errors)

    def test_nonexistent_connection_target_rejected(self):
        connection = {
            "from_entity": "enc_netherese_enclave_collapse",
            "to_entity": "haz_nonexistent",
            "canon_status": "unverified",
        }
        errors = validate_connection(connection, {"enc_netherese_enclave_collapse"})
        self.assertIn("missing_target_entity", errors)

    def test_incompatible_patch_version_rejected(self):
        patch = {
            "patch_id": "patch_encounter_v2",
            "target_entity": "enc_netherese_enclave_collapse",
            "base_version": "99",
            "fields_changed": {"hazards[0].dc": 15},
        }
        self.assertIn("incompatible_version", validate_patch_version(patch, "1"))

    def test_patch_based_unlock_of_unverified_route_rejected(self):
        route = {
            "entity_id": "route_underdark_preview",
            "entity_type": "route",
            "canon_status": "unverified",
            "extensions": {"traversable": False},
        }
        patch = {
            "patch_id": "patch_route_unlock",
            "target_entity": route["entity_id"],
            "base_version": "1",
            "fields_changed": {"extensions.traversable": True},
        }
        self.assertIn("cannot_traverse_unverified_route", validate_route_patch(route, patch))

    def test_existing_canon_status_values_are_accepted(self):
        entities = [
            {"entity_id": "e1", "canon_status": "official_verified"},
            {"entity_id": "e2", "canon_status": "homebrew_approved"},
            {"entity_id": "e3", "canon_status": "crossover_approved"},
            {"entity_id": "e4", "canon_status": "unverified"},
        ]
        self.assertEqual(validate_entities(entities), [])

    def test_version_match_passes(self):
        patch = {"patch_id": "patch_v2", "target_entity": "e1", "base_version": "1"}
        self.assertEqual(validate_patch_version(patch, 1), [])


if __name__ == "__main__":
    unittest.main()
