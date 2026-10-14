"""Seedable urban encounter and 2014-style D20 haggling prototype."""
import random
from decimal import Decimal, ROUND_HALF_UP

ENCOUNTERS={
 "WATERDEEP_HIGH_WARD":["Noble inspection","Watch inquiry"],
 "WATERDEEP_TRADES_WARD":["Pickpocket","Street bard"],
 "SKULLPORT":["Syndicate shakedown","Ooze seepage"],
 "PROMENADE":["Refugee needs aid","Sanctuary supply shortage"]
}

class UrbanEncounterEngine:
    def __init__(self,charisma_modifier=0,seed=None):
        self.cha_mod=charisma_modifier
        self.rng=random.Random(seed)
    def trigger_street_encounter(self,district):
        if district not in ENCOUNTERS: raise ValueError("unknown district")
        return {"district":district,"event":self.rng.choice(ENCOUNTERS[district])}
    def haggle_merchant_price(self,base_price_gp,merchant_disposition=0):
        price=Decimal(str(base_price_gp))
        if price<0 or not -5<=merchant_disposition<=5: raise ValueError("invalid input")
        roll=self.rng.randint(1,20)
        total=roll+self.cha_mod
        dc=15-merchant_disposition
        discount=Decimal("0.30") if total>=dc+5 else Decimal("0.15") if total>=dc else Decimal("0")
        final=(price*(1-discount)).quantize(Decimal("0.01"),rounding=ROUND_HALF_UP)
        return {"roll":roll,"modifier":self.cha_mod,"total":total,"dc":dc,
                "discount":str(discount),"original_gp":str(price),"final_gp":str(final)}
