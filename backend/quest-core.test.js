'use strict';
const test=require('node:test');const assert=require('node:assert/strict');
const q=require('./quest-core');
test('rejects invalid coordinates and radius',()=>{for(const v of [[0,NaN,2],[1,Infinity,3],[1,2],['1',2,3]])assert.equal(q.validateCoordinates(v),false);assert.equal(q.validateCoordinates([1,2,3]),true);for(const v of [-1,Infinity,NaN,1001,'5'])assert.equal(q.validateRadius(v),false);assert.equal(q.validateRadius(1000),true)});
test('3d distance',()=>assert.equal(q.distance([0,0,0],[3,4,12]),13));
test('cannot award unknown or unverified or duplicate quest',()=>{assert.equal(q.validateQuestAward({questId:'bad',completedObjectives:true}).reason,'UNKNOWN_QUEST');assert.equal(q.validateQuestAward({questId:'Q-01-GADOR',completedObjectives:false}).reason,'OBJECTIVES_UNVERIFIED');assert.equal(q.validateQuestAward({questId:'Q-01-GADOR',completedObjectives:true,alreadyCompleted:true}).reason,'ALREADY_COMPLETED');assert.equal(q.validateQuestAward({questId:'Q-01-GADOR',completedObjectives:true}).artifact,'Core Stone of Gador')});
test('craft requires both artifacts and blocks repeats',()=>{assert.equal(q.validateCraft({inventory:[]}).reason,'MISSING_ARTIFACTS');assert.equal(q.validateCraft({inventory:q.RECIPE.requires,alreadyCrafted:true}).reason,'ALREADY_CRAFTED');assert.equal(q.validateCraft({inventory:q.RECIPE.requires}).ok,true)});
