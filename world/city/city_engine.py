"""Homebrew city law prototype. Pure state transitions; caller persists events."""
import random

class CityLawEngine:
    def __init__(self, heat=0, district="WATERDEEP_TRADES_WARD", seed=None):
        if not 0 <= heat <= 100: raise ValueError("heat must be 0..100")
        self.heat, self.district = heat, district
        self.rng = random.Random(seed)
        self.reported_offenses = []

    def commit_crime(self, severity, witness_probability=0.4):
        values = {"petty_theft":10,"extortion":25,"assault":50,"murder":90}
        if severity not in values: raise ValueError("unknown offense")
        if not 0 <= witness_probability <= 1: raise ValueError("invalid probability")
        witnessed = self.rng.random() < witness_probability
        if witnessed:
            self.heat = min(100,self.heat+values[severity])
            self.reported_offenses.append(severity)
        return {"crime":severity,"witnessed":witnessed,"heat":self.heat,
                "status":"WANTED" if witnessed and self.heat>=40 else "INVESTIGATING" if witnessed else "UNREPORTED"}

    def negotiate_bribe(self, captain_tier, offered_gp, corrupt=False):
        if not 1 <= captain_tier <= 5 or offered_gp < 0: raise ValueError("invalid input")
        threshold=self.heat*50*captain_tier
        accepted=bool(corrupt and offered_gp>=threshold and self.rng.random()<0.6)
        if accepted: self.heat=max(0,self.heat-30)
        return {"accepted":accepted,"heat":self.heat,"threshold_gp":threshold,
                "consequence":"corruption_evidence" if accepted else "possible_bribery_report"}

if __name__=="__main__":
    engine=CityLawEngine(30,"WATERDEEP_HIGH_WARD",seed=7)
    print(engine.commit_crime("assault",0.8))
    print(engine.negotiate_bribe(2,3500,corrupt=False))
