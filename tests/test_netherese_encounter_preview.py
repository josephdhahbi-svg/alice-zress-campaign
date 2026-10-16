import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "encounter_netherese_enclave_collapse_v1.json"
HTML = ROOT / "web" / "alice_u01_preview.html"
MODEL = ROOT / "data" / "alice_u01_read_model_v1.json"

class NethereseEncounterPreviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.encounter = json.loads(DATA.read_text(encoding="utf-8"))
        cls.html = HTML.read_text(encoding="utf-8")
        cls.alice = json.loads(MODEL.read_text(encoding="utf-8"))

    def test_encounter_is_proposed_homebrew_read_only(self):
        self.assertEqual(self.encounter["encounter_id"], "ENC_NETHERESE_ENCLAVE_COLLAPSE")
        self.assertEqual(self.encounter["status"], "PROPOSED_HOMEBREW_ENCOUNTER_READ_ONLY")
        self.assertFalse(self.encounter["interface_rules"]["save_mutation"])

    def test_three_hazards_present(self):
        ids = [h["hazard_id"] for h in self.encounter["hazards"]]
        self.assertEqual(ids, ["HAZ_SEISMIC_TREMORS", "HAZ_HYDROSTATIC_OOZE_SURGE", "HAZ_ARCANE_NULL_RESONANCE"])

    def test_hazards_not_active(self):
        self.assertTrue(all(h["status"] == "preview_only" for h in self.encounter["hazards"]))
        self.assertFalse(self.encounter["interface_rules"]["rolls_enabled"])

    def test_level_one_spell_limit_note(self):
        arcane = next(h for h in self.encounter["hazards"] if h["hazard_id"] == "HAZ_ARCANE_NULL_RESONANCE")
        self.assertIn("cannot cast 2nd-level spells", arcane["notes"])
        self.assertEqual(self.alice["character"]["level"], 1)

    def test_unknown_location_depth_and_date_not_fabricated(self):
        self.assertIsNone(self.encounter["historical_context"]["dr_year"])
        self.assertIsNone(self.encounter["geography"]["coordinates"])
        self.assertIsNone(self.encounter["geography"]["depth_feet"])
        self.assertEqual(self.encounter["geography"]["geological_strata_status"], "unverified_requires_copilot_research")

    def test_outcomes_do_not_automatically_unlock_routes(self):
        success = next(o for o in self.encounter["outcomes"] if o["outcome_id"] == "OUTCOME_SUCCESS")
        self.assertTrue(any("Do not unlock a route" in x for x in success["must_not_do"]))
        self.assertFalse(self.encounter["interface_rules"]["route_unlocks_enabled"])

    def test_undefined_trauma_and_exhaustion_flagged(self):
        failure = next(o for o in self.encounter["outcomes"] if o["outcome_id"] == "OUTCOME_FAILURE")
        self.assertTrue(any("3d6 trauma is undefined" in x for x in failure["unresolved"]))
        self.assertTrue(any("edition" in x for x in failure["unresolved"]))

    def test_ui_loads_and_renders_read_only_cards(self):
        self.assertIn("encounter_netherese_enclave_collapse_v1.json", self.html)
        self.assertIn("renderEncounter", self.html)
        self.assertIn("PROPOSED_HOMEBREW_ENCOUNTER_READ_ONLY", self.html)
        self.assertIn("btn.disabled=true", self.html)

    def test_visual_codex_marks_concept_unverified(self):
        manifest = json.loads((ROOT / "data" / "visual_codex_manifest_v1.json").read_text(encoding="utf-8"))
        asset = next(a for a in manifest["assets"] if a["asset_id"] == "ART_ENC_NETHERESE_COLLAPSE_CONCEPT_V1")
        self.assertIsNone(asset["file_path"])
        self.assertEqual(asset["depiction_state"], "generated_concept_not_committed_or_source_verified")

if __name__ == "__main__":
    unittest.main()
