'use strict';
// Simulation kernel V2: event-driven clock and delayed knowledge delivery.
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,127}$/;
const CADENCE=Object.freeze({HOURLY:1,DAILY:24,WEEKLY:168,MONTHLY:720,SEASONAL:2160,YEARLY:8640});
const PRIORITY=Object.freeze({TRIVIAL:0,MINOR:1,MAJOR:2,EPIC:3,LEGENDARY:4});
const copy=x=>JSON.parse(JSON.stringify(x));
function initialSimulation(){return {hour:0,revision:0,events:[],knowledge:{},messages:[],tickCounts:Object.fromEntries(Object.keys(CADENCE).map(k=>[k,0]))};}
function assertId(id){if(typeof id!=='string'||!ID.test(id))throw new TypeError('Invalid stable ID');}
function applyEvent(world,event){
 assertId(event.id);assertId(event.locationId);
 if(!Object.hasOwn(PRIORITY,event.priority))throw new RangeError('Invalid priority');
 if(!Array.isArray(event.witnessIds)||!Array.isArray(event.recipientIds))throw new TypeError('Missing audience');
 for(const id of [...event.witnessIds,...event.recipientIds])assertId(id);
 if(!Number.isSafeInteger(event.messageTravelHours)||event.messageTravelHours<0)throw new RangeError('Invalid travel duration');
 if(world.events.some(e=>e.id===event.id))throw new RangeError('Duplicate event');
 const next=copy(world);
 next.events.push({id:event.id,locationId:event.locationId,priority:event.priority,hour:world.hour});
 for(const id of new Set(event.witnessIds)){
  (next.knowledge[id]??=[]).push({eventId:event.id,source:'WITNESS',learnedHour:world.hour});
 }
 for(const id of new Set(event.recipientIds)){
  if(event.witnessIds.includes(id))continue;
  next.messages.push({eventId:event.id,recipientId:id,deliverAt:world.hour+event.messageTravelHours});
 }
 next.revision++;
 return deliverDue(next);
}
function deliverDue(world){
 const pending=[];
 for(const msg of world.messages){
  if(msg.deliverAt<=world.hour){
   const known=world.knowledge[msg.recipientId]??=[];
   if(!known.some(k=>k.eventId===msg.eventId))known.push({eventId:msg.eventId,source:'MESSAGE',learnedHour:msg.deliverAt});
  }else pending.push(msg);
 }
 world.messages=pending;
 return world;
}
function advanceHours(world,hours){
 if(!Number.isSafeInteger(hours)||hours<0||hours>87600)throw new RangeError('Invalid advancement');
 const next=copy(world),end=next.hour+hours;
 if(!Number.isSafeInteger(end))throw new RangeError('Clock overflow');
 for(const [name,period] of Object.entries(CADENCE))next.tickCounts[name]+=Math.floor(end/period)-Math.floor(next.hour/period);
 next.hour=end;
 if(hours)next.revision++;
 return deliverDue(next);
}
function snapshot(world){return {atHour:world.hour,revision:world.revision,state:copy(world)};}
function replay(actions){return actions.reduce((w,a)=>a.kind==='EVENT'?applyEvent(w,a.event):a.kind==='ADVANCE'?advanceHours(w,a.hours):(()=>{throw new RangeError('Unknown action');})(),initialSimulation());}
module.exports={CADENCE,PRIORITY,initialSimulation,applyEvent,advanceHours,snapshot,replay};
