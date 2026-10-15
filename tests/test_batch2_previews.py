"""Regression tests for safe, pure Batch 2 previews."""
import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from preview_encounter import preview_encounter
from preview_crafting import preview_crafting

class EncounterPreviewTests(unittest.TestCase):
    def setUp(self):
        self.monster = {"encounter_id": "TEST_01", "base_monster_name": "Test Creature",
                        "base_hp": 75, "base_ac": 15, "base_challenge_rating": 3,
                        "source_status": "official_verified"}

    def test_default_preserves_base_stats(self):
        before = copy.deepcopy(self.monster)
        result = preview_encounter(self.monster, 4, 3)
        self.assertEqual(result["preview_stats"], {"hp": 75, "ac": 15, "challenge_rating": 3})
        self.assertEqual(self.monster, before)
        self.assertFalse(result["mutates_game_state"])

    def test_homebrew_is_labeled_and_cr_unchanged(self):
        result = preview_encounter(self.monster, 6, 5, 1.2, enable_homebrew=True)
        self.assertEqual(result["mode"], "homebrew_preview")
        self.assertEqual(result["preview_stats"]["ac"], 16)
        self.assertEqual(result["preview_stats"]["challenge_rating"], 3)
        self.assertGreater(result["preview_stats"]["hp"], 75)

    def test_invalid_party_and_multiplier_rejected(self):
        for party in (0, -1, 1.5, float("nan"), True):
            with self.subTest(party=party), self.assertRaises(ValueError):
                preview_encounter(self.monster, party, 3)
        for multiplier in (-1, 0, float("inf"), float("nan")):
            with self.subTest(multiplier=multiplier), self.assertRaises(ValueError):
                preview_encounter(self.monster, 4, 3, multiplier)

class CraftingPreviewTests(unittest.TestCase):
    def setUp(self):
        self.actor = dict(authenticated=True, authorized=True, source_status="homebrew_approved",
                          dr_year=1495, location_id="LOC_TEST", plane_id="PLANE_TEST",
                          timeline_id="TIME_TEST", level=3, resonance_points=20,
                          earned_alignment_tiers=["UTILITY"], inventory={"SHARD": 2})
        self.recipe = dict(recipe_id="RECIPE_TEST", source_status="homebrew_approved",
                           time_window={"dr_start": 1490, "dr_end": 1500},
                           location_id="LOC_TEST", plane_id="PLANE_TEST", timeline_id="TIME_TEST",
                           required_event_ids=["QUEST_DONE"], forbidden_event_ids=[],
                           required_level=2, resonance_cost=10, alignment_tier_required="UTILITY",
                           ingredients=[{"item_id": "SHARD", "quantity": 2}])
        self.events = {"QUEST_DONE"}

    def preview(self, **kwargs):
        return preview_crafting(self.recipe, self.actor, completed_events=self.events,
                                confirmed_choice=True, **kwargs)

    def test_eligible_preview_does_not_mutate(self):
        a, r = copy.deepcopy(self.actor), copy.deepcopy(self.recipe)
        result = self.preview()
        self.assertTrue(result["eligible"], result["reasons"])
        self.assertFalse(result["mutates_game_state"])
        self.assertEqual(self.actor, a)
        self.assertEqual(self.recipe, r)

    def test_unauthorized_and_missing_confirmation(self):
        self.actor["authorized"] = False
        result = preview_crafting(self.recipe, self.actor, completed_events=self.events)
        self.assertIn("unauthorized", result["reasons"])
        self.assertIn("player_confirmation_required", result["reasons"])

    def test_unknown_date_and_wrong_location(self):
        self.actor["dr_year"] = None
        self.actor["location_id"] = "OTHER"
        result = self.preview()
        self.assertIn("historical_date_unknown", result["reasons"])
        self.assertIn("wrong_or_unknown_location", result["reasons"])

    def test_missing_quest_and_forbidden_event(self):
        self.recipe["forbidden_event_ids"] = ["BAD_EVENT"]
        result = preview_crafting(self.recipe, self.actor, completed_events={"BAD_EVENT"},
                                  confirmed_choice=True)
        self.assertIn("missing_quest_prerequisites", result["reasons"])
        self.assertIn("forbidden_event_present", result["reasons"])

    def test_ingredient_and_resonance_shortfall(self):
        self.actor["inventory"] = {"SHARD": 1}
        self.actor["resonance_points"] = 0
        result = self.preview()
        self.assertIn("missing_ingredients", result["reasons"])
        self.assertIn("resonance_requirement_not_met", result["reasons"])

    def test_recipe_unverified_and_alignment_not_earned(self):
        self.recipe["source_status"] = "unverified"
        self.actor["earned_alignment_tiers"] = []
        result = self.preview()
        self.assertIn("recipe_unverified", result["reasons"])
        self.assertIn("alignment_requirement_not_met", result["reasons"])

    def test_duplicate_ingredients_are_aggregated(self):
        self.recipe["ingredients"] = [{"item_id": "SHARD", "quantity": 2},
                                      {"item_id": "SHARD", "quantity": 1}]
        self.assertIn("missing_ingredients", self.preview()["reasons"])

if __name__ == "__main__":
    unittest.main()
