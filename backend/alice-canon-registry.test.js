'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const registry=require('../data/alice-canon-registry.json');
test('Alice baseline never inherits narrated rewards',()=>{assert.equal(registry.canonicalCheckpoint.level,1);assert.equal(registry.canonicalCheckpoint.earnedRelics,0);assert.equal(registry.narratedElderEye.persistentAwards,0)});
test('five gift slots have exactly three confirmed gifts',()=>{assert.equal(registry.originGifts.length,5);assert.deepEqual(registry.originGifts.filter(g=>g.status==='confirmed').map(g=>[g.source,g.spell]),[['Mystra','Shield'],['Ghaunadaur','Acid Splash'],['Eilistraee','Light']]);assert.equal(registry.originGifts.filter(g=>g.status==='pending'&&g.spell===null).length,2)});
test('30 books, ten pairs, seven traversals, 111 separate relics',()=>{assert.equal(registry.story.books,registry.story.trilogies*3);assert.equal(registry.story.traversals,7);assert.equal(registry.grandArtifacts.length,10);assert.equal(registry.grandArtifacts.flatMap(t=>[t.mistral,t.netherese]).length,20);assert.ok(registry.grandArtifacts.every(t=>!t.mistral.earned&&!t.netherese.earned));assert.equal(registry.relicCollection.target,111);assert.equal(registry.relicCollection.reconciledWithGrandArtifacts,false)});
test('Mistral, Mystryl, Mystra remain separate identifiers',()=>{assert.equal(new Set(Object.keys(registry.identities)).size,3);assert.notEqual(registry.identities.Mistral,registry.identities.Mystryl);assert.notEqual(registry.identities.Mystryl,registry.identities.Mystra)});
test('v46 candidate catalog is not persistent inventory',()=>{assert.equal(registry.v46Candidates.length,5);assert.equal(registry.canonicalCheckpoint.earnedRelics,0)});
