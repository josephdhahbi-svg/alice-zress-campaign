'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {SCHEMA,CHOICES,SCENE,validateChoiceCommand,sceneForClient}=require('./heroicSceneContract');
const base={schemaVersion:SCHEMA,commandId:'command_1',profileId:'alice-zress',sceneId:SCENE.sceneId,choiceId:'UTILITY',expectedRevision:0};
test('four illustrated panels and five ordered heroic choices',()=>{
 const s=sceneForClient();assert.equal(s.panels.length,4);assert.deepEqual(s.choices.map(c=>c.id),CHOICES);
});
for(const id of CHOICES)test('accepts '+id,()=>assert.equal(validateChoiceCommand({...base,choiceId:id}).choiceId,id));
test('no neutral/evil choices',()=>assert(!CHOICES.includes('EVIL')&&!CHOICES.includes('TRUE_NEUTRAL')));
test('rejects invalid choice',()=>assert.throws(()=>validateChoiceCommand({...base,choiceId:'EVIL'})));
test('rejects stale shape or missing revision',()=>assert.throws(()=>validateChoiceCommand({...base,expectedRevision:-1})));
test('rejects other profile',()=>assert.throws(()=>validateChoiceCommand({...base,profileId:'other'})));
test('rejects invalid id',()=>assert.throws(()=>validateChoiceCommand({...base,commandId:'a/b'})));
test('rejects unsupported version',()=>assert.throws(()=>validateChoiceCommand({...base,schemaVersion:'V9'})));
test('returns a whitelist of command fields',()=>assert.deepEqual(Object.keys(validateChoiceCommand({...base,admin:true})),['schemaVersion','commandId','profileId','sceneId','choiceId','expectedRevision']));
test('client receives no server-side effects',()=>assert(!('effect' in sceneForClient().choices[0])));
