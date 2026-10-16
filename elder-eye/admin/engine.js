'use strict';
// Dependency injection: supply an initialized better-sqlite3 database.
function createElderEyeEngine(db) {
  const appendEvent = db.transaction((campaignId, kind, payload) => {
    const next = db.prepare('SELECT COALESCE(MAX(sequence),0)+1 AS n FROM events WHERE campaign_id=?').get(campaignId).n;
    db.prepare('INSERT INTO events(campaign_id,sequence,kind,payload_json) VALUES(?,?,?,?)').run(campaignId,next,kind,JSON.stringify(payload));
    return next;
  });
  function getCharacter(id) {
    return db.prepare('SELECT * FROM characters WHERE id=?').get(id) || null;
  }
  function updateCharacter(id, changes) {
    const allowed = ['hp_current','hp_max','armor_class','level','location_id'];
    const keys = Object.keys(changes);
    if (!keys.length || keys.some(k=>!allowed.includes(k))) throw new Error('Invalid character update');
    const current = getCharacter(id);
    if (!current) throw new Error('Unknown character');
    const values = keys.map(k=>changes[k]);
    db.transaction(() => {
      db.prepare('UPDATE characters SET '+keys.map(k=>k+'=?').join(',')+' WHERE id=?').run(...values,id);
      appendEvent(current.campaign_id,'character.updated',{id,changes});
    })();
    return getCharacter(id);
  }
  function recordChoice(characterId,option,context) {
    if (![1,2,3,4,5].includes(option)) throw new Error('Choice must be 1-5');
    const character = getCharacter(characterId);
    if (!character) throw new Error('Unknown character');
    return appendEvent(character.campaign_id,'choice.selected',{characterId,option,context});
  }
  return {getCharacter,updateCharacter,recordChoice,appendEvent};
}
module.exports={createElderEyeEngine};
