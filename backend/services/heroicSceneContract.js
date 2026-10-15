'use strict';
// Stable client/server scene contract. Pure functions; engine owns all mutations.
const SCHEMA='Omni-Engine V8.0';
const CHOICES=Object.freeze(['LAWFUL_GOOD','NEUTRAL_GOOD','CHAOTIC_GOOD','UTILITY','ACTION']);
const SCENE=Object.freeze({
 sceneId:'U01_SILVER_COURIER', questId:'U01', characterId:'alice-zress', minLevel:1,
 panels:Object.freeze([
  'A courier stumbles into the moonlit safehouse.',
  'Behind her, refugees hide from a Lolthite patrol.',
  'Her map shows a medicine route through the tunnels.',
  'Alice must decide how to protect the people before the patrol arrives.'
 ]),
 choices:Object.freeze([
  {id:'LAWFUL_GOOD',label:'Protect the refugees openly',intent:'defend',effect:'refugee_safety'},
  {id:'NEUTRAL_GOOD',label:'Escort the wounded to safety',intent:'aid',effect:'medicine_access'},
  {id:'CHAOTIC_GOOD',label:'Misdirect the pursuing patrol',intent:'deceive_oppressors',effect:'patrol_delay'},
  {id:'UTILITY',label:'Study the map and supply ledger',intent:'investigate',effect:'route_intelligence'},
  {id:'ACTION',label:'Intercept the pursuers',intent:'nonlethal_intercept',effect:'pursuit_interrupted'}
 ])
});
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function validateChoiceCommand(cmd){
 if(!cmd || typeof cmd!=='object'||Array.isArray(cmd))throw new TypeError('Command object required');
 if(cmd.schemaVersion!==SCHEMA)throw new RangeError('Unsupported schema version');
 for(const key of ['commandId','profileId'])if(typeof cmd[key]!=='string'||!ID.test(cmd[key]))throw new TypeError('Invalid '+key);
 if(cmd.sceneId!==SCENE.sceneId)throw new RangeError('Unknown scene');
 if(cmd.profileId!=='alice-zress')throw new RangeError('Scene belongs to Alice');
 if(!CHOICES.includes(cmd.choiceId))throw new RangeError('Invalid choice');
 if(!Number.isSafeInteger(cmd.expectedRevision)||cmd.expectedRevision<0)throw new RangeError('Invalid revision');
 return Object.freeze({schemaVersion:SCHEMA,commandId:cmd.commandId,profileId:cmd.profileId,sceneId:cmd.sceneId,choiceId:cmd.choiceId,expectedRevision:cmd.expectedRevision});
}
function sceneForClient(){return {schemaVersion:SCHEMA,sceneId:SCENE.sceneId,questId:SCENE.questId,characterId:SCENE.characterId,panels:[...SCENE.panels],choices:SCENE.choices.map(({id,label})=>({id,label}))};}
module.exports={SCHEMA,CHOICES,SCENE,validateChoiceCommand,sceneForClient};
