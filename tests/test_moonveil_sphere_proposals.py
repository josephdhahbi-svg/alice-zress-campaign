import unittest

from moonveil_sphere.core.singularity import get_singularity_metadata
from moonveil_sphere.physics.cataclysm import evaluate_seismic_hazard, get_ooze_surge_preview
from moonveil_sphere.character.alice_state import get_alice_protected_state
from moonveil_sphere.multiverse.transit_engine import get_sector_pass_details


class MoonveilSphereProposalTests(unittest.TestCase):
    def test_singularity_is_proposed_and_has_no_state_effect(self):
        data = get_singularity_metadata()
        self.assertEqual(data["canon_status"], "unverified")
        self.assertIsNone(data["historical_date"])
        self.assertEqual(data["state_effect"], "none")

    def test_seismic_hazard_is_pure_preview(self):
        self.assertEqual(evaluate_seismic_hazard(14)["status"], "SUCCESS")
        result = evaluate_seismic_hazard(13)
        self.assertEqual(result["status"], "FAILURE")
        self.assertFalse(result["applied_to_character"])

    def test_seismic_inputs_are_validated(self):
        with self.assertRaises(ValueError):
            evaluate_seismic_hazard(0)
        with self.assertRaises(ValueError):
            evaluate_seismic_hazard(21)

    def test_ooze_penalty_remains_unresolved(self):
        data = get_ooze_surge_preview()
        self.assertEqual(data["advance_rate_ft_per_round"], 15)
        self.assertIsNone(data["movement_penalty"])
        self.assertIsNone(data["viscosity_penalty_multiplier"])
        self.assertFalse(data["applied_to_character"])

    def test_alice_reference_state_is_protected(self):
        data = get_alice_protected_state()
        self.assertEqual(data["level"], 1)
        self.assertEqual(data["class"], "Great Old One Warlock")
        self.assertEqual(data["custom_origin_gifts"], ["Shield", "Acid Splash", "Light"])
        self.assertEqual(len(data["u01_choices"]), 5)
        self.assertTrue(all(not choice["selected"] for choice in data["u01_choices"]))
        self.assertFalse(data["mutates_game_state"])

    def test_alice_projection_returns_independent_copy(self):
        first = get_alice_protected_state()
        first["level"] = 20
        self.assertEqual(get_alice_protected_state()["level"], 1)

    def test_tier_metadata_does_not_unlock_routes_or_assign_traversal(self):
        result = get_sector_pass_details("Underdark / Core Singularity", 1)
        self.assertEqual(result["book_range"], [1, 10])
        self.assertIsNone(result["traversal_id"])
        self.assertFalse(result["route_unlocks_enabled"])

    def test_invalid_tier_rejected(self):
        self.assertEqual(get_sector_pass_details("Underdark / Core Singularity", 4)["status"], "invalid_tier")


if __name__ == "__main__":
    unittest.main()
