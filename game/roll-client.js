"use strict";
/** Explicit authenticated roll client; never persists tokens or retries with a new event ID. */
function createRollClient({baseUrl,campaignId,accessToken,fetchImpl=fetch}){
 const base=new URL(baseUrl);
 if(base.protocol!=="https:"&&!(base.protocol==="http:"&&["127.0.0.1","localhost"].includes(base.hostname)))
  throw new Error("Only HTTPS or local loopback development servers are supported");
 if(base.username||base.password||base.search||base.hash)throw new Error("Unsafe server URL");
 if(!/^[a-zA-Z0-9:_-]{1,100}$/.test(campaignId))throw new Error("Invalid campaign");
 if(typeof accessToken!=="string"||!accessToken||/[\r\n]/.test(accessToken))throw new Error("Invalid token");
 const endpoint=new URL("api/campaigns/"+encodeURIComponent(campaignId)+"/rolls",base.href.endsWith("/")?base.href:base.href+"/");
 async function roll({eventId,expectedRevision,modifier=0,dc=15}){
  if(!/^[a-zA-Z0-9:_-]{1,100}$/.test(eventId))throw new Error("Invalid event ID");
  if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)throw new Error("Invalid revision");
  if(!Number.isSafeInteger(modifier)||modifier< -10||modifier>20)throw new Error("Invalid modifier");
  if(!Number.isSafeInteger(dc)||dc<1||dc>40)throw new Error("Invalid DC");
  const response=await fetchImpl(endpoint.href,{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+accessToken},body:JSON.stringify({eventId,expectedRevision,modifier,dc}),cache:"no-store",redirect:"error"});
  const data=await response.json();
  if(!response.ok||!data.success)throw Object.assign(new Error("Roll request failed: "+(data.error||response.status)),{status:response.status,code:data.error,revision:data.revision});
  return data;
 }
 return Object.freeze({roll});
}
if(typeof module!=="undefined"&&module.exports)module.exports={createRollClient};
if(typeof window!=="undefined")window.MoonveilRollClient=Object.freeze({createRollClient});
