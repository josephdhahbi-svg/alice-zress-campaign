"""Individual NPC schedules with optional quest/emergency overrides."""
class NPCRoutineEngine:
    def __init__(self,npc_id,name,profession,home,work,tavern):
        self.npc_id,self.name,self.profession=npc_id,name,profession
        self.home,self.work,self.tavern=home,work,tavern

    def update_routine(self,hour,day=0,override=None):
        if not 0<=hour<24 or not 0<=day<7: raise ValueError("invalid day/hour")
        if override:
            location,activity=override["location"],override["activity"]
        elif day==6:
            location,activity=self.home,"Day off"
        elif 6<=hour<8:
            location,activity=self.work,"Opening shop / travel"
        elif 8<=hour<17:
            location,activity=self.work,f"Working as {self.profession}"
        elif 17<=hour<22:
            location,activity=self.tavern,"Socializing"
        else:
            location,activity=self.home,"Resting"
        return {"npc_id":self.npc_id,"name":self.name,"day":day,"hour":hour,
                "location":location,"activity":activity}
