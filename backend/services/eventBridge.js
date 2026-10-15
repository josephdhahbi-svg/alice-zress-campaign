'use strict';
// Pure, deterministic adapter from committed engine events to presentation messages.
// Not an authority for player-state changes.
const { audioForPlane, audioEvent } = require('./audioRegistry');
const { projectDissonance } = require('./dissonanceRules');
const SCHEMA = 'Omni-Engine V8.0';
const ID = /^[A-Za-z0-9_-]{1,128}$/;
function adaptCommittedEvent(event, currentDissonance = null) {
  if (!event || event.committed !== true || !ID.test(event.eventId || '') ||
      !ID.test(event.commandId || '') || !ID.test(event.actorId || '')) {
    throw new TypeError('Valid committed engine event required');
  }
  if (!['DICE_ROLL_EVENT','PLANAR_SHIFT_EVENT','COMBAT_DAMAGE_EVENT','QUEST_EVENT','NPC_RELATIONSHIP_EVENT'].includes(event.type))
    throw new RangeError('Unsupported event type');
  const messages = [{ schemaVersion: SCHEMA, type: event.type, eventId: event.eventId,
    commandId: event.commandId, actorId: event.actorId, payload: event.payload || {} }];
  if (event.type === 'PLANAR_SHIFT_EVENT') {
    const plane = event.payload?.cosmicPlane;
    if (typeof plane !== 'string') throw new TypeError('cosmicPlane required');
    const soundKey = audioForPlane(plane);
    if (soundKey) messages.push(audioEvent({
      soundKey, characterId: event.actorId, eventId: event.eventId,
      sectorContext: { sectorId: event.payload.sectorId || null, cosmicPlane: plane }
    }));
  }
  if (event.type === 'DICE_ROLL_EVENT') {
    const roll = event.payload?.rawRoll;
    if (!Number.isInteger(roll) || roll < 1 || roll > 20) throw new RangeError('Invalid d20');
    if (roll === 20 && event.payload?.isCriticalSuccess === true)
      messages.push(audioEvent({soundKey:'sfx_d20_crit_success',characterId:event.actorId,eventId:event.eventId}));
  }
  let dissonance = null;
  if (event.type === 'COMBAT_DAMAGE_EVENT') {
    if (!currentDissonance) throw new TypeError('Dissonance projection required');
    dissonance = projectDissonance(currentDissonance, { ...event.payload, committed: true });
    messages.push({schemaVersion:SCHEMA,type:'DISSONANCE_UPDATE_EVENT',eventId:event.eventId,
      commandId:event.commandId,actorId:event.actorId,payload:dissonance});
  }
  return { messages, dissonance };
}
module.exports = { adaptCommittedEvent };
