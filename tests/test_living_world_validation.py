"""Unit tests for the read-only Moonveil integration registry validator."""
import copy
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from validate_living_world import validate

class LivingWorldValidationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.world = json.loads((ROOT / "data/living_world_integration_schema_v1.json").read_text(encoding="utf-8"))
        cls.codex = json.loads((ROOT / "data/visual_codex_manifest_v1.json").read_text(encoding="utf-8"))
        cls.modules = json.loads((ROOT / "data/gemini_omni_engine_module_registry.json").read_text(encoding="utf-8"))

    def check(self, world=None, codex=None, modules=None):
        return validate(world or self.world, codex or self.codex, modules or self.modules)

    def test_current_registry(self):
        self.assertEqual(self.check(), [])

    def test_rejects_automatic_unlock_when_date_unknown(self):
        world = copy.deepcopy(self.world)
        world["availability"]["unknown_dates_never_auto_unlock"] = False
        self.assertTrue(any("unknown dates" in x for x in self.check(world=world)))

    def test_rejects_duplicate_asset_id(self):
        codex = copy.deepcopy(self.codex)
        codex["assets"].append(copy.deepcopy(codex["assets"][0]))
        self.assertTrue(any("duplicate/missing" in x for x in self.check(codex=codex)))

    def test_rejects_fake_asset_path(self):
        codex = copy.deepcopy(self.codex)
        codex["assets"][0]["file_path"] = "fictional.png"
        self.assertTrue(any("unexpected image file" in x for x in self.check(codex=codex)))

    def test_rejects_promoted_unverified_module(self):
        modules = copy.deepcopy(self.modules)
        modules["modules"][0]["implementation_status"] = "implemented"
        self.assertTrue(any("unexpectedly promoted" in x for x in self.check(modules=modules)))

    def test_rejects_wrong_traversal_count(self):
        world = copy.deepcopy(self.world)
        world["scope"]["traversals"] = 6
        self.assertTrue(any("30 books and 7" in x for x in self.check(world=world)))

if __name__ == "__main__":
    unittest.main()
