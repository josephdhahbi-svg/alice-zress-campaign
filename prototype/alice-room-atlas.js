
"use strict";
const byId=id=>document.getElementById(id);
let session=null,rooms=[],active=null,selectedChoice=null,sessionEpoch=0;
const labels=["Lawful Good","Neutral Good","Chaotic Good","Utility","Action"];
function status(message){byId("connection-status").textContent=message}
function reset(){sessionEpoch++;session=null;rooms=[];active=null;selectedChoice=null;byId("submit-choice").disabled=true;byId("refresh-journal").disabled=true;byId("ai-guide-send").disabled=true;byId("ai-guide-reply").textContent="";byId("ai-guide-status").textContent="Connect to a campaign to ask the AI guide.";byId("journal-entries").replaceChildren();byId("token").value="";byId("rooms").replaceChildren();byId("choices").replaceChildren();byId("room-title").textContent="Choose a room";byId("room-description").textContent="Room choices are previews only.";byId("choice-status").textContent="No choice submitted."}
async function api(path,options={}){
 if(!session)throw Error("Connect first");
 const response=await fetch("/api/campaigns/"+encodeURIComponent(session.campaign)+"/world/alice-demiplane/"+path,{
 method:options.method||"GET",headers:{"Authorization":"Bearer "+session.token,...(options.body?{"Content-Type":"application/json"}:{})},body:options.body?JSON.stringify(options.body):undefined,cache:"no-store",credentials:"omit"});
 const data=await response.json();if(!response.ok)throw Error("Server rejected request ("+response.status+"): "+(data.error||data.reason||"unknown"));return data;
}
function showRoom(room){
 active=room;selectedChoice=null;byId("submit-choice").disabled=true;byId("room-title").textContent=room.name;byId("room-description").textContent=room.description+" · Risk: "+room.risk+" · Access: "+room.access;
 const root=byId("choices");root.replaceChildren();
 room.choices.forEach((choice,i)=>{const button=document.createElement("button");button.className="mv-choice";button.type="button";button.textContent=(i+1)+" · "+labels[i]+": "+choice;button.addEventListener("click",async()=>{
 selectedChoice=i+1;byId("submit-choice").disabled=room.status!=="ORIGIN";byId("choice-status").textContent="Requesting read-only adjudication preview…";
 try{const result=await api("rooms/"+encodeURIComponent(room.id)+"/preview",{method:"POST",body:{choiceNumber:i+1}});
 byId("choice-status").textContent=result.reason+": "+result.text+". No character state or rewards changed."}
 catch(error){byId("choice-status").textContent=error.message}});root.append(button)});
 byId("choice-status").textContent="Read-only preview; movement and rewards remain locked.";
}
byId("connect").addEventListener("submit",async event=>{
 event.preventDefault();const campaign=byId("campaign").value.trim(),token=byId("token").value;reset();
 if(!/^[A-Za-z0-9:_-]{1,100}$/.test(campaign)||!token){status("Invalid campaign ID or missing token.");return}
 session={campaign,token};status("Loading room atlas…");
 try{const data=await api("rooms");if(!Array.isArray(data.rooms))throw Error("Invalid room response");
 rooms=data.rooms;const root=byId("rooms");root.replaceChildren();
 rooms.forEach(room=>{const button=document.createElement("button");button.type="button";button.className="mv-choice";button.textContent=room.name+" · "+room.status;button.addEventListener("click",()=>showRoom(room));root.append(button)});
 status("Loaded "+rooms.length+" rooms from the signed campaign API. Narrative proposals can be saved for DM review.");byId("refresh-journal").disabled=false;await refreshAiStatus();if(rooms.length)showRoom(rooms[0]);await refreshJournal();
 }catch(error){reset();status(error.message)}
});
byId("disconnect").addEventListener("click",()=>{reset();status("Disconnected. Session cleared from this page.")});

async function refreshJournal(){
 const root=byId("journal-entries");root.replaceChildren();
 try{
  const data=await api("journal");if(!Array.isArray(data.entries))throw Error("Invalid journal response");
  if(!data.entries.length){const p=document.createElement("p");p.className="mv-subtitle";p.textContent="No entries yet.";root.append(p);return}
  data.entries.forEach(entry=>{
   const article=document.createElement("article");article.className="mv-journal-entry";
   const heading=document.createElement("strong");heading.textContent=entry.room_id+" · "+entry.status;
   const details=document.createElement("p");details.textContent=entry.choice_text+" · Submitted by "+entry.actor_id;
   article.append(heading,details);
   if(entry.review_note){const note=document.createElement("p");note.textContent="DM review: "+entry.review_note;article.append(note)}
   root.append(article);
  });
 }catch(error){const p=document.createElement("p");p.textContent=error.message;root.append(p)}
}
byId("refresh-journal").addEventListener("click",refreshJournal);
byId("submit-choice").addEventListener("click",async()=>{
 if(!session||!active||active.status!=="ORIGIN"||!Number.isInteger(selectedChoice))return;
 const button=byId("submit-choice");button.disabled=true;
 try{
  const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);
  const entryId="entry_"+Array.from(bytes,x=>x.toString(16).padStart(2,"0")).join("");
  const data=await api("journal",{method:"POST",body:{entryId,roomId:active.id,choiceNumber:selectedChoice}});
  byId("choice-status").textContent="Journal entry "+data.entry.entry_id+" saved as PENDING. DM review required; no rewards or travel.";
  await refreshJournal();
 }catch(error){byId("choice-status").textContent=error.message}
 finally{button.disabled=false}
});


async function refreshAiStatus(){
 const epoch=sessionEpoch,current=session;
 if(!current)return;
 byId("ai-guide-send").disabled=true;
 byId("ai-guide-status").textContent="Checking AI Story Guide availability…";
 try{
  const response=await fetch("/api/campaigns/"+encodeURIComponent(current.campaign)+"/ai/status",{
   headers:{"Authorization":"Bearer "+current.token},cache:"no-store",credentials:"omit"
  });
  if(!response.ok)throw Error("AI status unavailable ("+response.status+").");
  const data=await response.json();
  if(epoch!==sessionEpoch)return;
  byId("ai-guide-send").disabled=!data.configured;
  byId("ai-guide-status").textContent=data.configured?"AI Story Guide ready · advisory only.":"AI offline: server key not configured. Other game features remain available.";
 }catch(error){if(epoch===sessionEpoch){byId("ai-guide-send").disabled=true;byId("ai-guide-status").textContent=error.message}}
}

byId("ai-guide-form").addEventListener("submit",async event=>{
 event.preventDefault();
 if(!session)return;
 const message=byId("ai-guide-question").value.trim(),mode=byId("ai-guide-mode").value;
 if(!message||message.length>2000||!["GUIDE","LORE"].includes(mode))return;
 const epoch=sessionEpoch,current=session;
 const button=byId("ai-guide-send");button.disabled=true;
 byId("ai-guide-status").textContent="Consulting the AI Story Guide…";
 byId("ai-guide-reply").textContent="";
 try{
  const response=await fetch("/api/campaigns/"+encodeURIComponent(current.campaign)+"/ai/chat",{
   method:"POST",headers:{"Authorization":"Bearer "+current.token,"Content-Type":"application/json"},
   body:JSON.stringify({message,mode}),cache:"no-store",credentials:"omit"
  });
  const data=await response.json();
  if(epoch!==sessionEpoch)return;
  if(!response.ok)throw Error(response.status===503?"AI is not configured on this server.":data.error||"AI unavailable.");
  if(!data.available||typeof data.reply!=="string")throw Error("No AI response available.");
  byId("ai-guide-reply").textContent=data.reply;
  byId("ai-guide-status").textContent="Advisory answer only. No game state changed.";
 }catch(error){if(epoch===sessionEpoch)byId("ai-guide-status").textContent=error.message}
 finally{if(epoch===sessionEpoch)button.disabled=!session}
});
