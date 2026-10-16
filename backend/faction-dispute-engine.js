"use strict";
const { randomUUID } = require("node:crypto");
function createFactionDisputeEngine(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS faction_disputes (
    dispute_id TEXT PRIMARY KEY,
    territory_id TEXT NOT NULL REFERENCES territory_control(territory_id),
    aggressor_faction TEXT NOT NULL REFERENCES factions(faction_id),
    defender_faction TEXT REFERENCES factions(faction_id),
    status TEXT NOT NULL CHECK(status IN ('PENDING','ESCALATED','RESOLVED')),
    escalation_score INTEGER NOT NULL CHECK(escalation_score BETWEEN 0 AND 100),
    created_at TEXT NOT NULL,
    resolved_at TEXT,
    winner_faction TEXT REFERENCES factions(faction_id)
  );
  CREATE UNIQUE INDEX IF NOT EXISTS faction_active_territory
    ON faction_disputes(territory_id) WHERE status IN ('PENDING','ESCALATED');`);
  db.exec("CREATE TABLE IF NOT EXISTS faction_dispute_audit (audit_id INTEGER PRIMARY KEY AUTOINCREMENT, dispute_id TEXT NOT NULL REFERENCES faction_disputes(dispute_id), action TEXT NOT NULL CHECK(action IN (\'CREATED\',\'ESCALATED\',\'RESOLVED\')), recorded_at TEXT NOT NULL, detail_json TEXT NOT NULL)");
  const audit=db.prepare("INSERT INTO faction_dispute_audit(dispute_id,action,recorded_at,detail_json) VALUES(?,?,?,?)");
  const record=(disputeId,action,detail)=>audit.run(disputeId,action,new Date().toISOString(),JSON.stringify(detail));
  const territory=db.prepare("SELECT * FROM territory_control WHERE territory_id=?");
  const faction=db.prepare("SELECT faction_id FROM factions WHERE faction_id=?");
  const active=db.prepare("SELECT * FROM faction_disputes WHERE territory_id=? AND status IN ('PENDING','ESCALATED')");
  const get=db.prepare("SELECT * FROM faction_disputes WHERE dispute_id=?");
  const triggerDispute=db.transaction((territoryId,aggressorId)=>{
    if(typeof territoryId!=="string"||typeof aggressorId!=="string"||territoryId.length>100||aggressorId.length>100)throw Error("Invalid identifiers");
    const t=territory.get(territoryId);
    if(!t||!faction.get(aggressorId))throw Error("Unknown territory or faction");
    const old=active.get(territoryId);
    if(old){
      if(old.aggressor_faction!==aggressorId)throw Error("Different aggressor already disputes territory");
      const score=Math.min(100,old.escalation_score+25),status=score>=100?"ESCALATED":"PENDING";
      db.prepare("UPDATE faction_disputes SET escalation_score=?,status=? WHERE dispute_id=?").run(score,status,old.dispute_id);
      record(old.dispute_id,"ESCALATED",{score,status,aggressorId});
      return {disputeId:old.dispute_id,status,escalationScore:score};
    }
    if(t.controlling_faction_id===aggressorId)throw Error("Faction already controls territory");
    const disputeId="disp_"+randomUUID().replace(/-/g,"");
    db.prepare("INSERT INTO faction_disputes(dispute_id,territory_id,aggressor_faction,defender_faction,status,escalation_score,created_at) VALUES(?,?,?,?,?,?,?)").run(disputeId,territoryId,aggressorId,t.controlling_faction_id,"PENDING",10,new Date().toISOString());
    record(disputeId,"CREATED",{territoryId,aggressorId,defenderId:t.controlling_faction_id});
    return {disputeId,status:"PENDING",escalationScore:10};
  });
  const resolveDispute=db.transaction((disputeId,winnerId)=>{
    const d=get.get(disputeId);
    if(!d||d.status==="RESOLVED")throw Error("Unknown or resolved dispute");
    if(winnerId!==d.aggressor_faction&&winnerId!==d.defender_faction)throw Error("Winner must be a participant");
    const t=territory.get(d.territory_id);
    if(!t||t.controlling_faction_id!==d.defender_faction)throw Error("Territory ownership changed");
    db.prepare("UPDATE territory_control SET controlling_faction_id=? WHERE territory_id=?").run(winnerId,d.territory_id);
    db.prepare("UPDATE faction_disputes SET status='RESOLVED',winner_faction=?,resolved_at=? WHERE dispute_id=?").run(winnerId,new Date().toISOString(),disputeId);
    record(disputeId,"RESOLVED",{territoryId:d.territory_id,winnerId});
    return {disputeId,status:"RESOLVED",territoryId:d.territory_id,winnerFactionId:winnerId};
  });
  return {triggerDispute,resolveDispute,getDispute:id=>get.get(id)};
}
module.exports={createFactionDisputeEngine};
