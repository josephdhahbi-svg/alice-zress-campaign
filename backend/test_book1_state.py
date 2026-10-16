"""Integration regressions for the read-only Book 1 adapter."""
import sqlite3
import unittest

from book1_projection import SCENE_ID
from book1_state import book1_state
from campaign_store import append_event, create_campaign, initialize


def choice(kind, roll=14):
    return {"sceneId": SCENE_ID, "kind": kind, "rawRoll": roll,
            "modifier": 2, "dc": 12, "total": roll + 2,
            "success": roll + 2 >= 12}


class Book1StateTests(unittest.TestCase):
    def setUp(self):
        self.conn = sqlite3.connect(":memory:")
        initialize(self.conn)
        create_campaign(self.conn, "alice")

    def tearDown(self):
        self.conn.close()

    def test_empty_campaign(self):
        state = book1_state(self.conn, "alice")
        self.assertEqual((state["revision"], state["choice_count"]), (0, 0))

    def test_full_history_preserved_after_world_event(self):
        append_event(self.conn, "alice", "e1", "k1", "CHOICE_RESOLVED",
                     choice("lawful_good"), 0)
        append_event(self.conn, "alice", "e2", "k2", "WORLD_TICK", {}, 1)
        append_event(self.conn, "alice", "e3", "k3", "CHOICE_RESOLVED",
                     choice("action", 5), 2)
        state = book1_state(self.conn, "alice")
        self.assertEqual(state["revision"], 3)
        self.assertEqual(state["choice_count"], 2)
        self.assertEqual([c["kind"] for c in state["choices"]],
                         ["lawful_good", "action"])
        self.assertEqual([c["success"] for c in state["choices"]],
                         [True, False])

    def test_idempotent_replay_does_not_duplicate_history(self):
        payload = choice("neutral_good")
        append_event(self.conn, "alice", "e1", "k1", "CHOICE_RESOLVED",
                     payload, 0)
        append_event(self.conn, "alice", "e2", "k1", "CHOICE_RESOLVED",
                     payload, 0)
        self.assertEqual(book1_state(self.conn, "alice")["choice_count"], 1)

    def test_campaign_isolation(self):
        create_campaign(self.conn, "other")
        append_event(self.conn, "alice", "e1", "k1", "CHOICE_RESOLVED",
                     choice("utility"), 0)
        self.assertEqual(book1_state(self.conn, "other")["choice_count"], 0)

    def test_unknown_campaign(self):
        with self.assertRaises(KeyError):
            book1_state(self.conn, "missing")


if __name__ == "__main__":
    unittest.main()
