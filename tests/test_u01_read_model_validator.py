import copy
import unittest
from scripts.validate_u01_read_model import validate_bundle

def fixture():
    alice={"status":"DESIGN_ONLY_NO_LIVE_SAVE","mutates_game_state":False,"scene_id":"U01_SILVER_COURIER","character":{"character_id":"CHAR_ALICE_ZRESS","level":1,"origin_gifts":[{"spell":"Shield"},{"spell":"Acid Splash"},{"spell":"Light"}]},"historical_context":{"dr_year":None},"choices":[{"id":x,"selected":False,"enabled":False} for x in ["LAWFUL_GOOD","NEUTRAL_GOOD","CHAOTIC_GOOD","UTILITY","ACTION"]],"routes":{"travel_enabled":False},"art":{"file_path":None,"state":"planned"},"capabilities":{x:False for x in ["dice","combat","save","travel","choice_submission"]}}
    encounter={"status":"PROPOSED_HOMEBREW_ENCOUNTER_READ_ONLY","player_state_effects_enabled":False,"interface_rules":{"save_mutation":False},"hazards":[{"status":"preview_only"}]}
    causal={"status":"PROPOSED_CAUSAL_CHAIN_READ_ONLY","canon_status":"unverified","state_effect":"none","events":[{"event_id":"E1","cause_event_ids":[],"consequence_event_ids":["E2"],"prerequisite_event_ids":[]},{"event_id":"E2","cause_event_ids":["E1"],"consequence_event_ids":[],"prerequisite_event_ids":["PLAYER_CONFIRMED_U01_CHOICE"]}]}
    html="btn.disabled=true ../data/alice_u01_read_model_v1.json ../data/encounter_netherese_enclave_collapse_v1.json ../data/proposed_cosmic_to_u01_causal_chain_v1.json"
    return alice,encounter,causal,html
class U01BundleValidatorTests(unittest.TestCase):
    def check(self,a=None,e=None,c=None,h=None):
        base=fixture()
        return validate_bundle(a if a is not None else base[0],e if e is not None else base[1],c if c is not None else base[2],h if h is not None else base[3])
    def test_valid_fixture(self): self.assertEqual([],self.check())
    def test_reject_level_change(self):
        a=copy.deepcopy(fixture()[0]);a["character"]["level"]=2
        self.assertTrue(any("identity/level" in x for x in self.check(a=a)))
    def test_reject_selected_choice(self):
        a=copy.deepcopy(fixture()[0]);a["choices"][0]["selected"]=True
        self.assertTrue(any("unselected and disabled" in x for x in self.check(a=a)))
    def test_reject_enabled_choice(self):
        a=copy.deepcopy(fixture()[0]);a["choices"][0]["enabled"]=True
        self.assertTrue(any("unselected and disabled" in x for x in self.check(a=a)))
    def test_reject_known_date_in_unverified_preview(self):
        a=copy.deepcopy(fixture()[0]);a["historical_context"]["dr_year"]=1495
        self.assertTrue(any("date must remain unknown" in x for x in self.check(a=a)))
    def test_reject_unlocked_route(self):
        a=copy.deepcopy(fixture()[0]);a["routes"]["travel_enabled"]=True
        self.assertTrue(any("travel must remain disabled" in x for x in self.check(a=a)))
    def test_reject_encounter_state_mutation(self):
        e=copy.deepcopy(fixture()[1]);e["player_state_effects_enabled"]=True
        self.assertTrue(any("state effects" in x for x in self.check(e=e)))
    def test_reject_causal_mutation(self):
        c=copy.deepcopy(fixture()[2]);c["state_effect"]="grant_reward"
        self.assertTrue(any("non-mutating" in x for x in self.check(c=c)))
    def test_reject_dangling_event(self):
        c=copy.deepcopy(fixture()[2]);c["events"][0]["consequence_event_ids"]=["MISSING"]
        self.assertTrue(any("dangling event" in x for x in self.check(c=c)))
    def test_reject_missing_html_fetch(self):
        self.assertTrue(any("missing data fetch path" in x for x in self.check(h="btn.disabled=true")))
if __name__=="__main__": unittest.main()
