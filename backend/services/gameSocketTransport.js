'use strict';
// Read-only server transport. The hosting server authenticates profileId.
// Client stores the last *applied* event sequence and presents it on reconnect.
// Caller must authorize the requested cursor against that player's session.
const {handleClientFrame}=require('./websocketMessageGuard');
const {since}=require('./eventOutbox');
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function attachGameSocket(ws,{db,profileId,log=()=>{},maxBatch=100,resumeAfter=0}={}){
 if(!ws||typeof ws.on!=='function'||typeof ws.send!=='function')throw new TypeError('Socket required');
 if(!db||typeof db.prepare!=='function')throw new TypeError('Database required');
 if(typeof profileId!=='string'||!ID.test(profileId))throw new TypeError('Authenticated profile required');
 if(!Number.isSafeInteger(maxBatch)||maxBatch<1||maxBatch>500)throw new RangeError('Invalid batch size');
 if(!Number.isSafeInteger(resumeAfter)||resumeAfter<0)throw new RangeError('Invalid resume cursor');
 let cursor=resumeAfter;
 function flush(){
  if(ws.readyState!==1)return 0;
  const rows=since(db,profileId,cursor,maxBatch);
  let sent=0;
  for(const row of rows){
   if(ws.readyState!==1)break;
   // Cursor advances only after successful socket send, not after DB read.
   ws.send(JSON.stringify({type:'SERVER_EVENT',sequence:row.sequence,eventId:row.eventId,event:row.event}));
   cursor=row.sequence;sent++;
  }
  return sent;
 }
 ws.on('message',frame=>handleClientFrame(ws,frame,{log}));
 return Object.freeze({flush,getCursor:()=>cursor});
}
module.exports={attachGameSocket};
