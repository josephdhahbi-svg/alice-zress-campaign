'use strict';
const ID=/^[A-Za-z][A-Za-z0-9_-]{0,127}$/;
const RELIABILITY=Object.freeze({WITNESS:100,OFFICIAL:85,MESSENGER:70,RUMOR:35});
function initialBeliefs(){return {revision:0,people:{},seenMessageIds:[]};}
function receive(state,message){
 if(!state||!message||!ID.test(message.id||'')||!ID.test(message.recipientId||'')||!ID.test(message.eventId||''))throw new TypeError('Invalid message IDs');
 if(!Object.hasOwn(RELIABILITY,message.source))throw new RangeError('Unknown source');
 if(typeof message.claim!=='string'||message.claim.length<1||message.claim.length>500)throw new TypeError('Invalid claim');
 if(!Number.isSafeInteger(message.receivedHour)||message.receivedHour<0)throw new RangeError('Invalid receipt hour');
 if(state.seenMessageIds.includes(message.id))return state;
 const old=state.people[message.recipientId]||[];
 const prior=old.find(x=>x.eventId===message.eventId&&x.claim===message.claim);
 const strength=Math.min(100,(prior?.confidence||0)+Math.ceil(RELIABILITY[message.source]*(prior?0.25:1)));
 const updated={eventId:message.eventId,claim:message.claim,confidence:strength,lastHeardHour:message.receivedHour,source:message.source};
 const entries=prior?old.map(x=>x===prior?updated:x):[...old,updated];
 return {revision:state.revision+1,people:{...state.people,[message.recipientId]:entries},seenMessageIds:[...state.seenMessageIds,message.id]};
}
function beliefsAt(state,personId,nowHour){
 if(!ID.test(personId||'')||!Number.isSafeInteger(nowHour)||nowHour<0)throw new TypeError('Invalid query');
 return (state.people[personId]||[]).map(x=>({...x,confidence:Math.max(0,x.confidence-Math.max(0,Math.floor((nowHour-x.lastHeardHour)/168)))}));
}
function competingClaims(state,personId,eventId){
 if(!ID.test(eventId||''))throw new TypeError('Invalid event');
 return (state.people[personId]||[]).filter(x=>x.eventId===eventId).sort((a,b)=>b.confidence-a.confidence);
}
module.exports={RELIABILITY,initialBeliefs,receive,beliefsAt,competingClaims};
