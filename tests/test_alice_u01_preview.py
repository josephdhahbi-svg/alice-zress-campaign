import unittest
from scripts.preview_alice_u01 import CHOICES, get_u01_preview

class AliceU01ReadOnlyTests(unittest.TestCase):
    def test_level_one(self):
        self.assertEqual(get_u01_preview()["character"]["level"], 1)
    def test_gifts(self):
        self.assertEqual(get_u01_preview()["character"]["origin_gifts"], ["Shield", "Acid Splash", "Light"])
    def test_choices_order_and_unselected(self):
        self.assertEqual([c["id"] for c in get_u01_preview()["choices"]], list(CHOICES))
        self.assertTrue(all(not c["selected"] and not c["enabled"] for c in get_u01_preview()["choices"]))
    def test_unknown_dr(self):
        self.assertIsNone(get_u01_preview()["historical_context"]["dr_year"])
    def test_routes_locked(self):
        self.assertFalse(get_u01_preview()["routes"]["travel_enabled"])
    def test_art_not_published(self):
        self.assertIsNone(get_u01_preview()["art"]["file_path"])
    def test_no_mutation(self):
        self.assertFalse(get_u01_preview()["mutates_game_state"])
    def test_independent_preview_objects(self):
        first = get_u01_preview()
        first["character"]["level"] = 20
        self.assertEqual(get_u01_preview()["character"]["level"], 1)

if __name__ == "__main__":
    unittest.main()
