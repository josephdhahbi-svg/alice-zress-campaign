"""Book 1 deterministic projector tests."""
import unittest
from book1_projection import SCENE_ID, project_book1, validate_choice_event

def payload(**changes):
    value = {"sceneId": SCENE_ID, "kind": "lawful_good", "rawRoll": 14,
             "modifier": 2, "dc": 12, "total": 16, "success": True}
    value.update(changes)
    return value

class Book1ProjectionTests(unittest.TestCase):
    def test_valid_roll(self):
        self.assertTrue(validate_choice_event(payload()))
    def test_invalid_roll(self):
        for changes in ({"rawRoll": 0}, {"total": 20}, {"success": False},
                        {"kind": "evil"}, {"modifier": True}, {"dc": 41}):
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                validate_choice_event(payload(**changes))
    def test_project_choice(self):
        snapshot = {"campaign_id": "alice", "revision": 2,
                    "events": [{"event_id": "e1", "revision": 1, "type": "WORLD_TICK", "payload": {}},
                               {"event_id": "e2", "revision": 2, "type": "CHOICE_RESOLVED", "payload": payload()}]}
        result = project_book1(snapshot)
        self.assertEqual(result["choice_count"], 1)
        self.assertEqual(result["choices"][0]["kind"], "lawful_good")
    def test_out_of_order(self):
        snapshot = {"revision": 1, "events": [{"revision": 1, "type": "WORLD_TICK"},
                                                {"revision": 1, "type": "WORLD_TICK"}]}
        with self.assertRaises(ValueError):
            project_book1(snapshot)

if __name__ == "__main__":
    unittest.main()
