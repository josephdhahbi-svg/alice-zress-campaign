'use strict';
// Durable event-delivery queue. Run schema migration before enqueueing.
// Caller must enqueue inside the same SQLite transaction as the event ledger write.
function migrate(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS event_outbox (
    sequence INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id TEXT NOT NULL UNIQUE,
    command_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    event_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_outbox_profile_sequence ON event_outbox(profile_id,sequence);`);
}
function enqueue(db, { eventId, commandId, profileId, event }) {
  if (![eventId,commandId,profileId].every(v=>typeof v==='string' && /^[A-Za-z0-9_-]{1,128}$/.test(v))) throw new TypeError('Invalid outbox identifiers');
  if (!event || typeof event !== 'object' || Array.isArray(event)) throw new TypeError('Invalid event');
  const json=JSON.stringify(event);
  if (Buffer.byteLength(json)>65536) throw new RangeError('Event too large');
  db.prepare('INSERT INTO event_outbox(event_id,command_id,profile_id,event_json) VALUES(?,?,?,?) ON CONFLICT(event_id) DO NOTHING')
    .run(eventId,commandId,profileId,json);
}
function since(db, profileId, afterSequence=0, limit=100) {
  if (typeof profileId!=='string'||!/^[A-Za-z0-9_-]{1,128}$/.test(profileId)) throw new TypeError('Invalid profile');
  if (!Number.isSafeInteger(afterSequence)||afterSequence<0) throw new RangeError('Invalid cursor');
  if (!Number.isSafeInteger(limit)||limit<1||limit>500) throw new RangeError('Invalid limit');
  return db.prepare('SELECT sequence,event_id,command_id,event_json FROM event_outbox WHERE profile_id=? AND sequence>? ORDER BY sequence ASC LIMIT ?')
    .all(profileId,afterSequence,limit).map(r=>({sequence:r.sequence,eventId:r.event_id,commandId:r.command_id,event:JSON.parse(r.event_json)}));
}
module.exports={migrate,enqueue,since};
