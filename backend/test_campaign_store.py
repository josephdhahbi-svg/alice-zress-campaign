"""Regression tests for the isolated campaign event ledger."""
import sqlite3
import unittest
from campaign_store import initialize, append_event, create_campaign, campaign_snapshot

class CampaignStoreTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialize(self.db)
        self.db.execute("INSERT INTO campaigns(id) VALUES('alice')")
        self.db.commit()
    def tearDown(self):
        self.db.close()
    def test_append_and_replay(self):
        first = append_event(self.db,"alice","e1","k1","CHOICE_RESOLVED",{"choice":"LG"},0)
        self.assertEqual(first["revision"],1)
        replay = append_event(self.db,"alice","e2","k1","CHOICE_RESOLVED",{"choice":"CG"},0)
        self.assertEqual(replay,{"event_id":"e1","revision":1,"replayed":True})
        self.assertEqual(self.db.execute("SELECT COUNT(*) FROM campaign_events").fetchone()[0],1)
    def test_stale_revision(self):
        append_event(self.db,"alice","e1","k1","CHOICE_RESOLVED",{},0)
        with self.assertRaisesRegex(RuntimeError,"REVISION_CONFLICT"):
            append_event(self.db,"alice","e2","k2","CHOICE_RESOLVED",{},0)
    def test_duplicate_event_id_rolls_back(self):
        append_event(self.db,"alice","e1","k1","CHOICE_RESOLVED",{},0)
        with self.assertRaises(sqlite3.IntegrityError):
            append_event(self.db,"alice","e1","k2","CHOICE_RESOLVED",{},1)
        self.assertEqual(self.db.execute("SELECT revision FROM campaigns").fetchone()[0],1)
    def test_recovery_after_conflict(self):
        append_event(self.db,"alice","e1","k1","CHOICE_RESOLVED",{},0)
        with self.assertRaisesRegex(RuntimeError,"REVISION_CONFLICT"):
            append_event(self.db,"alice","e2","k2","CHOICE_RESOLVED",{},0)
        result = append_event(self.db,"alice","e3","k3","CHOICE_RESOLVED",{},1)
        self.assertEqual(result["revision"],2)
    def test_payload_validation(self):
        with self.assertRaises(ValueError):
            append_event(self.db,"alice","e1","k1","CHOICE_RESOLVED",[],0)
    def test_snapshot_and_cursor(self):
        append_event(self.db,"alice","e1","k1","CHOICE_RESOLVED",{"choice":"LG"},0)
        append_event(self.db,"alice","e2","k2","CHOICE_RESOLVED",{"choice":"NG"},1)
        full = campaign_snapshot(self.db,"alice")
        self.assertEqual(full["revision"],2)
        self.assertEqual([e["payload"]["choice"] for e in full["events"]],["LG","NG"])
        later = campaign_snapshot(self.db,"alice",after_revision=1)
        self.assertEqual([e["event_id"] for e in later["events"]],["e2"])
    def test_campaign_creation_and_isolation(self):
        create_campaign(self.db,"second")
        append_event(self.db,"second","e2","k2","CHOICE_RESOLVED",{},0)
        self.assertEqual(campaign_snapshot(self.db,"alice")["events"],[])
        self.assertEqual(campaign_snapshot(self.db,"second")["revision"],1)
        with self.assertRaises(sqlite3.IntegrityError):
            create_campaign(self.db,"second")
    def test_invalid_cursor(self):
        with self.assertRaises(ValueError):
            campaign_snapshot(self.db,"alice",True)
    def test_invalid_revision(self):
        with self.assertRaises(ValueError):
            append_event(self.db,"alice","e1","k1","CHOICE_RESOLVED",{},True)
    def test_unknown_campaign(self):
        with self.assertRaises(KeyError):
            append_event(self.db,"unknown","e1","k1","CHOICE_RESOLVED",{},0)

if __name__ == "__main__":
    unittest.main()
