'use strict';
// Candidate quest logic only: no server, no invented character progression.
const QUESTS = Object.freeze([
  {id:'Q-01-GADOR',artifact:'Core Stone of Gador'},
  {id:'Q-02-ELISTRAEE',artifact:'Moon-Silver Blade of the Silver Maiden'},
  {id:'Q-03-MYSTRA',artifact:'Tear of the Weave-Mother'},
  {id:'Q-04-NETHER',artifact:'Codex of Nether Scroll Fragments'},
  {id:'Q-05-MYSTRYL',artifact:'Primal Spark of Mystryl'}
]);
const RECIPE=Object.freeze({id:'RECIPE-WEAVE-ENGINE',requires:['Primal Spark of Mystryl','Codex of Nether Scroll Fragments'],power:'Weave-Engine Synthesis'});
function validateCoordinates(coords){return Array.isArray(coords)&&coords.length===3&&coords.every(v=>typeof v==='number'&&Number.isFinite(v));}
function validateRadius(radius){return typeof radius==='number'&&Number.isFinite(radius)&&radius>=0&&radius<=1000;}
function distance(a,b){if(!validateCoordinates(a)||!validateCoordinates(b))throw new TypeError('Invalid coordinates');return Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);}
function validateQuestAward({questId,completedObjectives,alreadyCompleted}){
 const quest=QUESTS.find(q=>q.id===questId);
 if(!quest)return {ok:false,reason:'UNKNOWN_QUEST'};
 if(alreadyCompleted)return {ok:false,reason:'ALREADY_COMPLETED'};
 if(completedObjectives!==true)return {ok:false,reason:'OBJECTIVES_UNVERIFIED'};
 return {ok:true,artifact:quest.artifact};
}
function validateCraft({inventory,alreadyCrafted}){
 if(alreadyCrafted)return {ok:false,reason:'ALREADY_CRAFTED'};
 if(!Array.isArray(inventory))return {ok:false,reason:'INVALID_INVENTORY'};
 const missing=RECIPE.requires.filter(item=>!inventory.includes(item));
 if(missing.length)return {ok:false,reason:'MISSING_ARTIFACTS',missing};
 return {ok:true,power:RECIPE.power};
}
module.exports={QUESTS,RECIPE,validateCoordinates,validateRadius,distance,validateQuestAward,validateCraft};
