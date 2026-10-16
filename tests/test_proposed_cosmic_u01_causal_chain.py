import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "data" / "proposed_cosmic_to_u01_causal_chain_v1.json"


class ProposedCausalChainTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(PATH.read_text(encoding="utf-8"))
        cls.events = {e["event_id"]: e for e in cls.data["events"]}

    def test_chain_is_proposed_and_read_only(self):
        self.assertEqual(self.data["status"], "PROPOSED_CAUSAL_CHAIN_READ_ONLY")
        self.assertEqual(self.data["canon_status"], "unverified")
        self.assertEqual(self.data["state_effect"], "none")

    def test_dates_and_traversal_remain_unknown(self):
        self.assertIsNone(self.data["dr_epoch_date"])
        self.assertEqual(self.data["date_precision"], "unknown")
        self.assertIsNone(self.data["timeline_id"])
        self.assertIsNone(self.data["traversal_id"])
        self.assertIsNone(self.data["book_id"])

    def test_all_event_references_resolve(self):
        for event in self.data["events"]:
            for field in ("cause_event_ids", "consequence_event_ids", "prerequisite_event_ids"):
                for ref in event[field]:
                    if ref != "PLAYER_CONFIRMED_U01_CHOICE":
                        self.assertIn(ref, self.events)

    def test_causal_links_are_reciprocal(self):
        for event in self.data["events"]:
            for cause in event["cause_event_ids"]:
                self.assertIn(event["event_id"], self.events[cause]["consequence_event_ids"])
            for consequence in event["consequence_event_ids"]:
                self.assertIn(event["event_id"], self.events[consequence]["cause_event_ids"])

    def test_alice_opportunity_requires_confirmed_choice(self):
        event = next(e for e in self.data["events"] if e["event_id"] == "EVT_ALICE_INVESTIGATION_OPPORTUNITY")
        self.assertEqual(event["status"], "locked_preview")
        self.assertIn("PLAYER_CONFIRMED_U01_CHOICE", event["prerequisite_event_ids"])
        self.assertIn("no event is recorded", event["notes"])

    def test_every_event_remains_unverified_and_proposed(self):
        self.assertTrue(all(e["canon_status"] == "unverified" for e in self.data["events"]))
        self.assertTrue(all(e["status"] in {"proposed", "locked_preview"} for e in self.data["events"]))


if __name__ == "__main__":
    unittest.main()
