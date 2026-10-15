'use strict';
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,127}$/;
const CHOICES=Object.freeze(['LAWFUL_GOOD','NEUTRAL_GOOD','CHAOTIC_GOOD','UTILITY','ACTION']);
const ALLOWED=new Set(['SCENE_OPENED','CHOICE_COMMITTED','DICE_RESOLVED','NPC_ACTION_COMMITTED','SCENE_CLOSED']);
function validId(v){return typeof v==='string'&&ID.test(v);}
function projectStoryReplay(events,{profileId,sceneId}={}){
 if(!validId(profileId)||!validId(sceneId)||!Array.isArray(events))throw new TypeError('Invalid replay request');
 const seen=new Set();let previousTick=-1;const beats=[];
 for(const event of events){
  if(!event||!validId(event.eventId)||seen.has(event.eventId))throw new TypeError('Invalid or duplicate event ID');
  seen.add(event.eventId);
  if(!Number.isSafeInteger(event.worldTick)||event.worldTick<previousTick)throw new RangeError('Events must be chronological');
  previousTick=event.worldTick;
  if(!ALLOWED.has(event.type))continue;
  if(event.profileId!==profileId||event.sceneId!==sceneId)continue;
  const data=event.data||{};
  if(event.type==='CHOICE_COMMITTED'&&!CHOICES.includes(data.choiceId))throw new RangeError('Invalid choice');
  if(event.type==='DICE_RESOLVED'&&(!Number.isInteger(data.total)||data.total<0))throw new RangeError('Invalid roll');
  beats.push({eventId:event.eventId,worldTick:event.worldTick,type:event.type,
   characterId:validId(data.characterId)?data.characterId:null,
   locationId:validId(data.locationId)?data.locationId:null,
   dialogue:typeof data.dialogue==='string'?data.dialogue.slice(0,1000):null,
   choiceId:event.type==='CHOICE_COMMITTED'?data.choiceId:null,
   diceTotal:event.type==='DICE_RESOLVED'?data.total:null,
   visualAssetId:validId(data.visualAssetId)?data.visualAssetId:null});
 }
 return {schemaVersion:1,status:'STORYBOARD_DATA_ONLY',profileId,sceneId,beats,panelCount:beats.length,
  requiresArt:beats.some(b=>!b.visualAssetId),requiresScriptReview:true};
}
module.exports={CHOICES,projectStoryReplay};
