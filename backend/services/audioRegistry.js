'use strict';
// Sound references are symbolic IDs until verified licensed files are installed.
const tracks = Object.freeze({
  amb_far_realm_whispers: { title: 'Far Realm Whispers', loop: true, defaultVolume: 0.75 },
  amb_wonderland_tea_party: { title: 'Wonderland Clocks', loop: true, defaultVolume: 0.65 },
  amb_bone_cathedral_choir: { title: 'Bone Cathedral Choir', loop: true, defaultVolume: 0.8 },
  sfx_d20_crit_success: { title: 'Natural 20 Chime', loop: false, defaultVolume: 1 }
});
const planeTracks = Object.freeze({
  'Prime Material / Far Realm Border': 'amb_far_realm_whispers',
  'Beyond Wonderland': 'amb_wonderland_tea_party',
  'Undeath Void': 'amb_bone_cathedral_choir'
});
function audioEvent({ soundKey, characterId, sectorContext = null, eventId }) {
  if (!Object.hasOwn(tracks, soundKey)) throw new RangeError('Unknown soundKey');
  if (typeof characterId !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(characterId)) throw new TypeError('Invalid characterId');
  if (typeof eventId !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(eventId)) throw new TypeError('Invalid eventId');
  return { schemaVersion: 'Omni-Engine V8.0', type: 'SPATIAL_AUDIO_EVENT', eventId, soundKey, triggeredBy: characterId, sectorContext, ...tracks[soundKey] };
}
function audioForPlane(plane) { return planeTracks[plane] ?? null; }
module.exports = { tracks, audioForPlane, audioEvent };
