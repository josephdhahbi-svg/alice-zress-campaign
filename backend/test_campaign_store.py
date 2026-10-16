"""Regression tests for the isolated campaign event ledger."""
import sqlite3
import unittest
from campaign_store import initialize, append_event

class CampaignStoreTests(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(":memory:")
        initialize(self.db)
        self.db.execute("INSERT INTO campaigns(id) VALUES('alice')")
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
    def test_invalid_revision(self):
        with self.assertRaises(ValueError):
            append_event(self.db,"alice","e1","k1","CHOICE_RESOLVED",{},True)
    def test_unknown_campaign(self):
        with self.assertRaises(KeyError):
            append_event(self.db,"unknown","e1","k1","CHOICE_RESOLVED",{},0)

if __name__ == "__main__":
    unittest.main()
