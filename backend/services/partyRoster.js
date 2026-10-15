'use strict';
// Pure party projection. Does not grant rewards, recruit companions or advance quests.
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,127}$/;
const STATUS=new Set(['ACTIVE','AVAILABLE','LOCKED']);
const ROLE=new Set(['BLUE','RED','GREEN']);
function validId(v,label){if(typeof v!=='string'||!ID.test(v))throw new TypeError('Invalid '+label);return v;}
function createPartyRoster({partyId,leaderId,members=[],relationships=[],questRefs=[]}={}){
 validId(partyId,'party ID');validId(leaderId,'leader ID');
 if(!Array.isArray(members)||!Array.isArray(relationships)||!Array.isArray(questRefs))throw new TypeError('Roster arrays required');
 const seen=new Set();
 const normalized=members.map(m=>{
  if(!m||typeof m!=='object')throw new TypeError('Invalid member');
  validId(m.characterId,'character ID');
  if(seen.has(m.characterId))throw new RangeError('Duplicate member');
  seen.add(m.characterId);
  if(!STATUS.has(m.status))throw new RangeError('Invalid member status');
  if(m.moralRole!=null&&!ROLE.has(m.moralRole))throw new RangeError('Invalid moral role');
  return Object.freeze({characterId:m.characterId,status:m.status,moralRole:m.moralRole??null});
 });
 if(!seen.has(leaderId)||!normalized.some(m=>m.characterId===leaderId&&m.status==='ACTIVE'))throw new RangeError('Leader must be active');
 const relations=relationships.map(r=>{
  if(!r||typeof r!=='object')throw new TypeError('Invalid relationship');
  validId(r.from,'relationship source');validId(r.to,'relationship target');
  if(typeof r.label!=='string'||!r.label.trim()||r.label.length>120)throw new TypeError('Invalid relationship label');
  return Object.freeze({from:r.from,to:r.to,label:r.label.trim()});
 });
 const quests=questRefs.map(q=>validId(q,'quest reference'));
 if(new Set(quests).size!==quests.length)throw new RangeError('Duplicate quest reference');
 return Object.freeze({schemaVersion:1,partyId,leaderId,members:Object.freeze(normalized),relationships:Object.freeze(relations),questRefs:Object.freeze(quests)});
}
function partyView(roster,characters={}){
 if(!roster||!Array.isArray(roster.members))throw new TypeError('Invalid roster');
 return {partyId:roster.partyId,leaderId:roster.leaderId,
  members:roster.members.map(m=>({characterId:m.characterId,status:m.status,moralRole:m.moralRole,
   name:Object.hasOwn(characters,m.characterId)?characters[m.characterId].name:null})),
  relationships:roster.relationships.map(r=>({...r})),questRefs:[...roster.questRefs]};
}
module.exports={createPartyRoster,partyView};
