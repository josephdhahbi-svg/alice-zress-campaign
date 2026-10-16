'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveAsset, assetsForScene } = require('../assets/catalog');
test('pending art never resolves as if production-ready', () => {
  assert.equal(resolveAsset('C001'), null);
  assert.equal(resolveAsset('E005'), null);
});
test('unknown and malformed asset IDs fail closed', () => {
  assert.equal(resolveAsset('../secret'), null);
  assert.equal(resolveAsset('C999'), null);
  assert.equal(resolveAsset(null), null);
});
test('scene lookup returns stable tagged IDs', () => {
  const ids = assetsForScene('pit-of-ghaunadaur').map(a => a.id);
  assert.ok(ids.includes('C001'));
  assert.ok(ids.includes('E005'));
  assert.ok(!ids.includes('ENV003'));
});
