import unittest
from pathlib import Path
p=(Path(__file__).resolve().parents[1]/"web"/"alice_u01_preview.html").read_text(encoding="utf-8")
class PreviewTests(unittest.TestCase):
    def test_scene(self): self.assertIn("U01_SILVER_COURIER",p)
    def test_character(self): self.assertIn("Level 1",p)
    def test_gifts(self): self.assertIn("Shield · Acid Splash · Light",p)
    def test_choices(self):
        for x in ("LAWFUL_GOOD","NEUTRAL_GOOD","CHAOTIC_GOOD","UTILITY","ACTION"): self.assertIn(x,p)
    def test_disabled(self): self.assertIn("btn.disabled=true",p)
    def test_no_save(self): self.assertIn("NO SAVE CONNECTION",p)
    def test_unknown_date(self): self.assertIn("Historical DR:</strong> Unknown",p)
    def test_locked_travel(self): self.assertIn("Locked / unverified",p)
