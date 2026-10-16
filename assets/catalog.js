'use strict';
const fs = require('node:fs');
const path = require('node:path');
const manifest = require('./manifest.json');
const byId = new Map(manifest.assets.map(asset => [asset.id, asset]));
function resolveAsset(id, options = {}) {
  if (typeof id !== 'string' || !/^[A-Z]+[0-9]{3}$/.test(id)) return null;
  const asset = byId.get(id);
  if (!asset || asset.status !== 'ready') return null;
  const root = options.root || path.resolve(__dirname, '..');
  const absolute = path.resolve(root, asset.path);
  if (!absolute.startsWith(path.resolve(root) + path.sep)) return null;
  return fs.existsSync(absolute) ? asset.path : null;
}
function assetsForScene(tag) {
  if (typeof tag !== 'string') return [];
  return manifest.assets.filter(asset => asset.sceneTags.includes(tag));
}
module.exports = { resolveAsset, assetsForScene };
