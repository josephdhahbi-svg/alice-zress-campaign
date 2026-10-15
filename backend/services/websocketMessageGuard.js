'use strict';
// WebSocket clients may send transport heartbeats only. All world changes must
// go through authenticated HTTP commands and the authoritative reducer.
const MAX_BYTES=2048;
function parseClientFrame(frame){
 const bytes=Buffer.isBuffer(frame)?frame:Buffer.from(String(frame));
 if(bytes.length>MAX_BYTES)throw new RangeError('Frame too large');
 let value;try{value=JSON.parse(bytes.toString('utf8'));}catch{throw new TypeError('Malformed JSON');}
 if(!value||typeof value!=='object'||Array.isArray(value))throw new TypeError('Object required');
 if(value.type!=='PING_HEARTBEAT')throw new RangeError('Client events are not authoritative');
 if(typeof value.nonce!=='string'||!/^[A-Za-z0-9_-]{1,64}$/.test(value.nonce))throw new TypeError('Invalid nonce');
 if(Object.keys(value).some(key=>!['type','nonce'].includes(key)))throw new TypeError('Unexpected field');
 return Object.freeze({type:'PONG_HEARTBEAT',nonce:value.nonce});
}
function handleClientFrame(ws,frame,{log=()=>{}}={}){
 try{const response=parseClientFrame(frame);if(ws.readyState===1)ws.send(JSON.stringify(response));return true;}
 catch(error){log({code:'REJECTED_CLIENT_FRAME',reason:error.message});return false;}
}
module.exports={parseClientFrame,handleClientFrame,MAX_BYTES};
