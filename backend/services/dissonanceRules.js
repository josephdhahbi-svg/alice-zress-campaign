'use strict';
// Pure projection: caller MUST use an authenticated, validated, ledger-committed combat event.
const clamp = n => Math.max(0, Math.min(100, n));
function projectDissonance(current, damageEvent) {
  if (!current || !damageEvent || damageEvent.committed !== true) throw new TypeError('Committed combat event required');
  const { damageAmount, damageType } = damageEvent;
  if (!Number.isSafeInteger(damageAmount) || damageAmount < 0 || damageAmount > 100000) throw new RangeError('Invalid damage amount');
  if (!['PSYCHIC', 'ELDRITCH', 'NECROTIC', 'FIRE', 'COLD', 'RADIANT', 'FORCE', 'SLASHING', 'PIERCING', 'BLUDGEONING', 'ACID', 'POISON', 'THUNDER', 'LIGHTNING'].includes(damageType)) throw new RangeError('Invalid damage type');
  for (const field of ['far_realm_madness','undeath_resonance','divine_radiance']) {
    if (!Number.isInteger(current[field]) || current[field] < 0 || current[field] > 100) throw new RangeError('Invalid current dissonance');
  }
  const next = { ...current };
  if (damageType === 'PSYCHIC' || damageType === 'ELDRITCH') next.far_realm_madness = clamp(current.far_realm_madness + Math.floor(damageAmount / 2));
  if (damageType === 'NECROTIC') next.undeath_resonance = clamp(current.undeath_resonance + Math.floor(damageAmount / 2));
  return next;
}
module.exports = { projectDissonance };
