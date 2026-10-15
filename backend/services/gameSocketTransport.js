'use strict';
// Transport only. Requires authenticated profile binding by the hosting server.
// No client frame can mutate the world; durable events come only from SQLite outbox.
const {handleClientFrame}=require('./websocketMessageGuard');
const {since}=require('./eventOutbox');
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function attachGameSocket(ws,{db,profileId,log=()=>{},maxBatch=100}={}){
 if(!ws||typeof ws.on!=='function'||typeof ws.send!=='function')throw new TypeError('Socket required');
 if(!db||typeof db.prepare!=='function')throw new TypeError('Database required');
 if(typeof profileId!=='string'||!ID.test(profileId))throw new TypeError('Authenticated profile required');
 if(!Number.isSafeInteger(maxBatch)||maxBatch<1||maxBatch>500)throw new RangeError('Invalid batch size');
 let cursor=0;
 function flush(){
  if(ws.readyState!==1)return 0;
  const rows=since(db,profileId,cursor,maxBatch);
  for(const row of rows){
   ws.send(JSON.stringify({type:'SERVER_EVENT',sequence:row.sequence,eventId:row.eventId,event:row.event}));
   cursor=row.sequence;
  }
  return rows.length;
 }
 ws.on('message',frame=>handleClientFrame(ws,frame,{log}));
 return Object.freeze({flush,getCursor:()=>cursor});
}
module.exports={attachGameSocket};
