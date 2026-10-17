"""Run: python -m unittest discover -s scripts -p 'test_moonveil_memory.py'"""
import pathlib
import tempfile
import unittest
from moonveil_memory import connect, init, propose, briefing, CAMPAIGN

class MemoryTests(unittest.TestCase):
    def test_seed_and_conflict_protection(self):
        with tempfile.TemporaryDirectory() as d:
            con=connect(pathlib.Path(d)/"memory.db")
            init(con)
            init(con)
            count=con.execute("SELECT COUNT(*) FROM facts WHERE campaign=?",(CAMPAIGN,)).fetchone()[0]
            self.assertEqual(count,27)
            self.assertTrue(propose(con,CAMPAIGN,"character","class","Wizard","test").startswith("BLOCKED"))
            self.assertEqual(con.execute("SELECT value FROM facts WHERE section='character' AND key='class'").fetchone()[0],"Undead Warlock")
            self.assertIn("Dhampir",briefing(con,CAMPAIGN))
            self.assertTrue(propose(con,CAMPAIGN,"character","class","Wizard","explicit approval",True).startswith("SAVED"))
            self.assertEqual(con.execute("SELECT value FROM facts WHERE section='character' AND key='class'").fetchone()[0],"Wizard")

if __name__=="__main__":
    unittest.main()
