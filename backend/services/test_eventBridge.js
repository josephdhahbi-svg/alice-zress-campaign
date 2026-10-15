'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {adaptCommittedEvent} = require('./eventBridge');
const base = {committed:true,eventId:'ev_1',commandId:'cmd_1',actorId:'alice-zress'};
test('planar shift produces a single matching audio cue',()=>{
 const r=adaptCommittedEvent({...base,type:'PLANAR_SHIFT_EVENT',payload:{cosmicPlane:'Beyond Wonderland',sectorId:'sec_tea_party_99'}});
 assert.equal(r.messages.length,2); assert.equal(r.messages[1].soundKey,'amb_wonderland_tea_party');
});
test('unknown plane does not invent an asset',()=>{
 const r=adaptCommittedEvent({...base,type:'PLANAR_SHIFT_EVENT',payload:{cosmicPlane:'Underdark'}});
 assert.equal(r.messages.length,1);
});
test('critical success creates a sound notification',()=>{
 const r=adaptCommittedEvent({...base,type:'DICE_ROLL_EVENT',payload:{rawRoll:20,isCriticalSuccess:true}});
 assert.equal(r.messages[1].soundKey,'sfx_d20_crit_success');
});
test('ordinary roll does not trigger critical sound',()=>{
 assert.equal(adaptCommittedEvent({...base,type:'DICE_ROLL_EVENT',payload:{rawRoll:12}}).messages.length,1);
});
test('combat damage yields bounded dissonance projection',()=>{
 const r=adaptCommittedEvent({...base,type:'COMBAT_DAMAGE_EVENT',payload:{damageAmount:10,damageType:'PSYCHIC'}},
 {far_realm_madness:98,undeath_resonance:10,divine_radiance:50});
 assert.equal(r.dissonance.far_realm_madness,100); assert.equal(r.messages[1].type,'DISSONANCE_UPDATE_EVENT');
});
test('uncommitted events are rejected',()=>assert.throws(()=>adaptCommittedEvent({...base,committed:false,type:'QUEST_EVENT'})));
test('invalid dice are rejected',()=>assert.throws(()=>adaptCommittedEvent({...base,type:'DICE_ROLL_EVENT',payload:{rawRoll:21}})));
test('invalid damage rejected',()=>assert.throws(()=>adaptCommittedEvent({...base,type:'COMBAT_DAMAGE_EVENT',payload:{damageAmount:-1,damageType:'NECROTIC'}},
 {far_realm_madness:0,undeath_resonance:0,divine_radiance:0})));
