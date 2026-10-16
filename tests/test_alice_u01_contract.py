import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / "data" / "alice_u01_read_model_v1.json"
HTML = ROOT / "web" / "alice_u01_preview.html"

class AliceU01ContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.model = json.loads(MODEL.read_text(encoding="utf-8"))
        cls.html = HTML.read_text(encoding="utf-8")

    def test_schema_and_scene_identity(self):
        self.assertEqual(self.model["schema_version"], "1.0")
        self.assertEqual(self.model["scene_id"], "U01_SILVER_COURIER")
        self.assertEqual(self.model["status"], "DESIGN_ONLY_NO_LIVE_SAVE")

    def test_alice_protected_level_and_class(self):
        c = self.model["character"]
        self.assertEqual(c["character_id"], "CHAR_ALICE_ZRESS")
        self.assertEqual(c["level"], 1)
        self.assertEqual(c["class"], "Great Old One Warlock")
        self.assertEqual(c["patron"], "Ghaunadaur")

    def test_origin_gifts_and_sources(self):
        gifts = {g["spell"]: g["source"] for g in self.model["character"]["origin_gifts"]}
        self.assertEqual(gifts, {"Shield": "Mystra", "Acid Splash": "Ghaunadaur", "Light": "Eilistraee"})

    def test_exact_five_choices_and_order(self):
        choices = self.model["choices"]
        self.assertEqual([x["id"] for x in choices], ["LAWFUL_GOOD", "NEUTRAL_GOOD", "CHAOTIC_GOOD", "UTILITY", "ACTION"])
        self.assertTrue(all(x["selected"] is False and x["enabled"] is False for x in choices))

    def test_unknown_time_and_locked_routes(self):
        self.assertIsNone(self.model["historical_context"]["dr_year"])
        self.assertEqual(self.model["routes"]["status"], "locked_unverified")
        self.assertFalse(self.model["routes"]["travel_enabled"])

    def test_no_capabilities_or_mutation(self):
        self.assertFalse(self.model["mutates_game_state"])
        self.assertTrue(all(value is False for value in self.model["capabilities"].values()))

    def test_art_is_planned_not_published(self):
        self.assertEqual(self.model["art"]["state"], "planned")
        self.assertIsNone(self.model["art"]["file_path"])

    def test_html_consumes_contract_and_fails_closed(self):
        self.assertIn("fetch('../data/alice_u01_read_model_v1.json'", self.html)
        self.assertIn("data.status!=='DESIGN_ONLY_NO_LIVE_SAVE'", self.html)
        self.assertIn("btn.disabled=true", self.html)
        self.assertIn("All choices remain disabled.", self.html)
        self.assertIn("proposed_cosmic_to_u01_causal_chain_v1.json", self.html)
        self.assertIn("renderCausalChain", self.html)
        self.assertIn("PROPOSED_CAUSAL_CHAIN_READ_ONLY", self.html)
        self.assertIn("Causal graph unavailable; no events are active.", self.html)

if __name__ == "__main__":
    unittest.main()
