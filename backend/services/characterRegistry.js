'use strict';
// Persistent character records are data, not model conversation memory.
// Pure validation and projection; storage adapter must enforce transactional writes.
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,127}$/;
const MORAL=new Set(['BLUE','RED','GREEN']);
const OWNERSHIP=new Set(['OWNED','AVAILABLE','LOCKED','CONCEPT']);
function requireId(value,label){if(typeof value!=='string'||!ID.test(value))throw new TypeError('Invalid '+label);return value;}
function createCharacter(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Character required');
 const id=requireId(input.id,'character ID');
 if(typeof input.name!=='string'||!input.name.trim()||input.name.length>120)throw new TypeError('Invalid name');
 if(!Number.isSafeInteger(input.level)||input.level<1||input.level>30)throw new RangeError('Invalid level');
 if(!MORAL.has(input.moralRole))throw new RangeError('Invalid moral role');
 const itemIds=[];
 for(const item of input.inventory||[]){requireId(item.itemId,'item ID');if(!OWNERSHIP.has(item.status))throw new RangeError('Invalid ownership');if(itemIds.includes(item.itemId))throw new RangeError('Duplicate item');itemIds.push(item.itemId);}
 const inventory=(input.inventory||[]).map(item=>Object.freeze({itemId:item.itemId,status:item.status}));
 return Object.freeze({schemaVersion:1,id,name:input.name.trim(),species:String(input.species||''),characterClass:String(input.characterClass||''),level:input.level,moralRole:input.moralRole,inventory:Object.freeze(inventory),revision:0});
}
function characterSheet(character){
 if(!character||!ID.test(character.id||''))throw new TypeError('Invalid character');
 return {id:character.id,name:character.name,level:character.level,species:character.species,characterClass:character.characterClass,moralRole:character.moralRole,
 equipment:(character.inventory||[]).filter(i=>i.status==='OWNED').map(i=>i.itemId),
 rewardCandidates:(character.inventory||[]).filter(i=>i.status==='AVAILABLE').map(i=>i.itemId),
 lockedRewards:(character.inventory||[]).filter(i=>i.status==='LOCKED').map(i=>i.itemId)};
}
module.exports={createCharacter,characterSheet,OWNERSHIP,MORAL};
