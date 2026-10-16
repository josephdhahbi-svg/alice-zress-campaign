'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const scene = require('../scenes/alice-pit-of-ghaunadaur-intro.json');
const manifest = require('../assets/manifest.json');
const { assetsForScene, resolveAsset } = require('../assets/catalog');
test('scene art IDs exist and are tagged for the scene', () => {
  const ids = [scene.backgroundAssetId, ...scene.characterAssetIds, ...scene.enemyAssetIds, ...scene.optionalAssetIds];
  const catalog = new Map(manifest.assets.map(a => [a.id, a]));
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) {
    assert.ok(catalog.has(id), 'missing catalog ID ' + id);
    assert.ok(catalog.get(id).sceneTags.includes('underdark'));
    assert.equal(resolveAsset(id), null, 'concept art must not resolve as production art');
  }
  assert.ok(assetsForScene('pit-of-ghaunadaur').some(a => a.id === scene.backgroundAssetId));
});
test('Alice level-one lore and locked rewards are preserved', () => {
  const alice = scene.characterRules.alice;
  assert.equal(alice.class, 'Great Old One Warlock');
  assert.equal(alice.patron, 'Ghaunadaur');
  assert.equal(alice.background, 'Acolyte');
  assert.deepEqual(alice.customOriginGifts.map(g => g.spell), ['Shield', 'Acid Splash', 'Light']);
  assert.ok(scene.lockedRewards.includes('divine-treasury-endgame'));
});
