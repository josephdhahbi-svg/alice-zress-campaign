"use strict";
/** Campaign-isolated FTS5 lore index; advisory retrieval only. */
function createLoreArchive(db){
 db.exec(`CREATE TABLE IF NOT EXISTS vtt_lore_documents(
 campaign_id TEXT NOT NULL,doc_id TEXT NOT NULL,title TEXT NOT NULL,body TEXT NOT NULL,
 source_status TEXT NOT NULL CHECK(source_status IN ('OFFICIAL_REFERENCE','HOMEBREW','UNVERIFIED')),
 dr_date TEXT,plane TEXT,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(campaign_id,doc_id));
 CREATE VIRTUAL TABLE IF NOT EXISTS vtt_lore_fts USING fts5(title,body,content='vtt_lore_documents',content_rowid='rowid');
 CREATE TRIGGER IF NOT EXISTS vtt_lore_ai AFTER INSERT ON vtt_lore_documents BEGIN
 INSERT INTO vtt_lore_fts(rowid,title,body) VALUES(new.rowid,new.title,new.body);END;
 CREATE TRIGGER IF NOT EXISTS vtt_lore_ad AFTER DELETE ON vtt_lore_documents BEGIN
 INSERT INTO vtt_lore_fts(vtt_lore_fts,rowid,title,body) VALUES('delete',old.rowid,old.title,old.body);END;
 CREATE TRIGGER IF NOT EXISTS vtt_lore_au AFTER UPDATE ON vtt_lore_documents BEGIN
 INSERT INTO vtt_lore_fts(vtt_lore_fts,rowid,title,body) VALUES('delete',old.rowid,old.title,old.body);
 INSERT INTO vtt_lore_fts(rowid,title,body) VALUES(new.rowid,new.title,new.body);END;`);
 const upsert=db.prepare(`INSERT INTO vtt_lore_documents(campaign_id,doc_id,title,body,source_status,dr_date,plane)
 VALUES(@campaignId,@docId,@title,@body,@sourceStatus,@drDate,@plane)
 ON CONFLICT(campaign_id,doc_id) DO UPDATE SET title=excluded.title,body=excluded.body,
 source_status=excluded.source_status,dr_date=excluded.dr_date,plane=excluded.plane,updated_at=CURRENT_TIMESTAMP`);
 const find=db.prepare(`SELECT d.doc_id AS docId,d.title,d.source_status AS sourceStatus,d.dr_date AS drDate,d.plane,
 snippet(vtt_lore_fts,1,'[',']',' … ',18) AS excerpt
 FROM vtt_lore_fts JOIN vtt_lore_documents d ON d.rowid=vtt_lore_fts.rowid
 WHERE vtt_lore_fts MATCH ? AND d.campaign_id=? ORDER BY rank LIMIT ?`);
 const valid=x=>typeof x==="string"&&/^[a-zA-Z0-9:_-]{1,100}$/.test(x);
 function put({campaignId,docId,title,body,sourceStatus="HOMEBREW",drDate=null,plane=null}){
  if(!valid(campaignId)||!valid(docId)||typeof title!=="string"||!title.trim()||title.length>200||typeof body!=="string"||!body.trim()||body.length>20000||!["OFFICIAL_REFERENCE","HOMEBREW","UNVERIFIED"].includes(sourceStatus)||drDate!==null&&(typeof drDate!=="string"||drDate.length>50)||plane!==null&&(typeof plane!=="string"||plane.length>100))throw new TypeError("INVALID_LORE_DOCUMENT");
  upsert.run({campaignId,docId,title,body,sourceStatus,drDate,plane});return {docId,stored:true};
 }
 function search(campaignId,query,limit=5){
  if(!valid(campaignId)||typeof query!=="string"||query.length>200||!Number.isInteger(limit)||limit<1||limit>20)throw new TypeError("INVALID_LORE_QUERY");
  const terms=(query.toLowerCase().match(/[a-z0-9]{2,30}/g)||[]).slice(0,8);
  if(!terms.length)return [];
  return find.all(terms.map(t=>'"'+t+'"').join(" OR "),campaignId,limit);
 }
 return {put,search};
}
module.exports={createLoreArchive};
