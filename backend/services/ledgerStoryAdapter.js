'use strict';
// Read-only adapter: authoritative reducer events -> cinematic projection schema.
// Does not execute commands, commit game state, or fabricate dialogue/art.
const {projectStoryReplay}=require('./storyReplayProjector');
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function normalizeLedgerEvent(row,profileId){
 if(!row||typeof row!=='object')throw new TypeError('Invalid ledger row');
 const event=row.event&&typeof row.event==='object'?row.event:row;
 if(!ID.test(event.eventId||'')||!ID.test(event.sceneId||'')||!ID.test(profileId||''))throw new TypeError('Invalid event identifiers');
 if(event.type!=='HEROIC_CHOICE_COMMITTED')throw new RangeError('Unsupported ledger event type');
 if(!Number.isSafeInteger(event.revision)||event.revision<1)throw new RangeError('Invalid revision');
 return {eventId:event.eventId,profileId,sceneId:event.sceneId,worldTick:event.revision,type:'CHOICE_COMMITTED',
 data:{choiceId:event.choiceId}};
}
function projectLedgerStory(rows,{profileId,sceneId}={}){
 if(!Array.isArray(rows))throw new TypeError('Rows must be an array');
 const events=rows.map(row=>normalizeLedgerEvent(row,profileId));
 return projectStoryReplay(events,{profileId,sceneId});
}
module.exports={normalizeLedgerEvent,projectLedgerStory};
