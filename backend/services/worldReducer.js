'use strict';
const CHOICES = Object.freeze(['LAWFUL_GOOD','NEUTRAL_GOOD','CHAOTIC_GOOD','UTILITY','ACTION']);
const EFFECTS = Object.freeze({
 LAWFUL_GOOD:{safety:2,trust:1,patrol:1,medicine:0,intel:0},
 NEUTRAL_GOOD:{safety:1,trust:2,patrol:0,medicine:2,intel:0},
 CHAOTIC_GOOD:{safety:1,trust:1,patrol:-2,medicine:0,intel:1},
 UTILITY:{safety:0,trust:0,patrol:0,medicine:1,intel:2},
 ACTION:{safety:2,trust:1,patrol:-1,medicine:0,intel:0}
});
const cap=x=>Math.max(0,Math.min(100,x));
function initialWorld(){return {schemaVersion:'Omni-Engine V8.0',revision:0,worldTick:0,alice:{level:1,items:[],wishesSpent:0,companionUnlocked:false},city:{safety:40,trust:40,patrol:50,medicine:40,intel:0},history:[]};}
function reduceWorld(world,event){
 if(!world||!event||event.type!=='HEROIC_CHOICE_COMMITTED'||event.sceneId!=='U01_SILVER_COURIER')throw new TypeError('Unsupported event');
 if(!/^[A-Za-z0-9_-]{1,128}$/.test(event.eventId||'')||!/^[A-Za-z0-9_-]{1,128}$/.test(event.commandId||''))throw new TypeError('Invalid IDs');
 if(!CHOICES.includes(event.choiceId))throw new RangeError('Invalid choice');
 if(!Number.isSafeInteger(event.revision)||event.revision!==world.revision+1)throw new RangeError('Revision discontinuity');
 if(world.history.some(e=>e.eventId===event.eventId||e.commandId===event.commandId))throw new RangeError('Duplicate event');
 const effect=EFFECTS[event.choiceId];
 const city=Object.fromEntries(Object.entries(world.city).map(([key,value])=>[key,cap(value+(effect[key]||0))]));
 return {...world,revision:event.revision,worldTick:world.worldTick+1,city,history:[...world.history,{eventId:event.eventId,commandId:event.commandId,choiceId:event.choiceId}]};
}
function replay(events){return events.reduce(reduceWorld,initialWorld());}
module.exports={CHOICES,EFFECTS,initialWorld,reduceWorld,replay};
