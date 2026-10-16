"use strict";
/** Separate clue possession from mystery revelation; scoped to save, traversal, character. */
function initializeMysteryEngine(db){
 db.exec(`
 CREATE TABLE IF NOT EXISTS moonveil_mysteries(
  mystery_id TEXT PRIMARY KEY, book_number INTEGER NOT NULL CHECK(book_number BETWEEN 1 AND 30),
  era_id TEXT NOT NULL, title TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'ACTIVE'
 );
 CREATE TABLE IF NOT EXISTS moonveil_clues(
  clue_id TEXT PRIMARY KEY, mystery_id TEXT NOT NULL REFERENCES moonveil_mysteries(mystery_id),
  clue_text TEXT NOT NULL, source_status TEXT NOT NULL DEFAULT 'HOMEBREW'
 );
 CREATE TABLE IF NOT EXISTS moonveil_character_clues(
  save_id TEXT NOT NULL, traversal INTEGER NOT NULL CHECK(traversal BETWEEN 1 AND 7),
  character_id TEXT NOT NULL, clue_id TEXT NOT NULL REFERENCES moonveil_clues(clue_id),
  discovered_at TEXT NOT NULL,
  PRIMARY KEY(save_id,traversal,character_id,clue_id)
 );
 CREATE TABLE IF NOT EXISTS moonveil_mystery_revelations(
  save_id TEXT NOT NULL, traversal INTEGER NOT NULL CHECK(traversal BETWEEN 1 AND 7),
  mystery_id TEXT NOT NULL REFERENCES moonveil_mysteries(mystery_id),
  revealed_by TEXT NOT NULL, revealed_at TEXT NOT NULL,
  PRIMARY KEY(save_id,traversal,mystery_id)
 );
 `);
}
function recordDiscovery(db,{saveId,traversal,characterId,clueId,at=new Date().toISOString()}){
 if(!saveId||!characterId||!clueId||!Number.isInteger(traversal)||traversal<1||traversal>7)throw new TypeError("INVALID_DISCOVERY");
 const stmt=db.prepare("INSERT OR IGNORE INTO moonveil_character_clues(save_id,traversal,character_id,clue_id,discovered_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM moonveil_clues WHERE clue_id=?)");
 const result=stmt.run(saveId,traversal,characterId,clueId,at);
 if(result.changes===0&&!db.prepare("SELECT 1 FROM moonveil_character_clues WHERE save_id=? AND traversal=? AND character_id=? AND clue_id=?").get(saveId,traversal,characterId,clueId))return {success:false,reason:"UNKNOWN_CLUE"};
 return {success:true,newDiscovery:result.changes===1,mysterySolved:false};
}
function revealMystery(db,{saveId,traversal,mysteryId,dmApproved=false,revealedBy="DM",at=new Date().toISOString()}){
 if(!dmApproved)return {success:false,reason:"DM_APPROVAL_REQUIRED"};
 if(!saveId||!Number.isInteger(traversal)||traversal<1||traversal>7||!mysteryId)throw new TypeError("INVALID_REVELATION");
 const result=db.prepare("INSERT OR IGNORE INTO moonveil_mystery_revelations(save_id,traversal,mystery_id,revealed_by,revealed_at) SELECT ?,?,?,?,? WHERE EXISTS(SELECT 1 FROM moonveil_mysteries WHERE mystery_id=?)").run(saveId,traversal,mysteryId,revealedBy,at,mysteryId);
 return {success:result.changes===1,reason:result.changes===1?"REVEALED":"ALREADY_REVEALED_OR_UNKNOWN"};
}
module.exports={initializeMysteryEngine,recordDiscovery,revealMystery};
