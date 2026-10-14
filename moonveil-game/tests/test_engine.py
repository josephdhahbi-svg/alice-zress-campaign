import importlib.util
import unittest
from pathlib import Path

path=Path(__file__).resolve().parents[1]/"engine.py"
spec=importlib.util.spec_from_file_location("moonveil_engine",path)
engine=importlib.util.module_from_spec(spec)
spec.loader.exec_module(engine)

class TestEngine(unittest.TestCase):
    def test_new_state(self):
        self.assertEqual(engine.new_state()["approval"]["lyra_solaria"],0)
    def test_locked_choice(self):
        state=engine.new_state()
        result=engine.resolve({"id":10,"requires":{"approval":40,"flag":"shared_vulnerability"},"approval":3,"flag":"vow_spoken"},state)
        self.assertFalse(result["ok"])
        self.assertEqual(state["events"],[])
    def test_success_and_no_duplicate(self):
        state=engine.new_state()
        choice={"id":1,"approval":5,"flag":"shared_vulnerability","reply":"yes"}
        self.assertTrue(engine.resolve(choice,state)["ok"])
        self.assertEqual(state["approval"]["lyra_solaria"],5)
        self.assertFalse(engine.resolve(choice,state)["ok"])
    def test_failed_check_no_reward(self):
        state=engine.new_state()
        choice={"id":5,"approval":2,"flag":"clue","reply":"yes","check":{"dc":14,"modifier":4}}
        engine.resolve(choice,state,roll=1)
        self.assertNotIn("clue",state["flags"])
        self.assertEqual(state["approval"]["lyra_solaria"],0)
    def test_passed_check(self):
        state=engine.new_state()
        choice={"id":5,"approval":2,"flag":"clue","reply":"yes","check":{"dc":14,"modifier":4}}
        self.assertTrue(engine.resolve(choice,state,roll=12)["ok"])
        self.assertTrue(state["flags"]["clue"])

if __name__=="__main__":
    unittest.main()
