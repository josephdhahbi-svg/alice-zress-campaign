
"use strict";
const byId=id=>document.getElementById(id);
let session=null,rooms=[],active=null;
const labels=["Lawful Good","Neutral Good","Chaotic Good","Utility","Action"];
function status(message){byId("connection-status").textContent=message}
function reset(){session=null;rooms=[];active=null;byId("token").value="";byId("rooms").replaceChildren();byId("choices").replaceChildren();byId("room-title").textContent="Choose a room";byId("room-description").textContent="Room choices are previews only.";byId("choice-status").textContent="No choice submitted."}
async function api(path,options={}){
 if(!session)throw Error("Connect first");
 const response=await fetch("/api/campaigns/"+encodeURIComponent(session.campaign)+"/world/alice-demiplane/"+path,{
 method:options.method||"GET",headers:{"Authorization":"Bearer "+session.token,...(options.body?{"Content-Type":"application/json"}:{})},body:options.body?JSON.stringify(options.body):undefined,cache:"no-store",credentials:"omit"});
 const data=await response.json();if(!response.ok)throw Error("Server rejected request ("+response.status+"): "+(data.error||data.reason||"unknown"));return data;
}
function showRoom(room){
 active=room;byId("room-title").textContent=room.name;byId("room-description").textContent=room.description+" · Risk: "+room.risk+" · Access: "+room.access;
 const root=byId("choices");root.replaceChildren();
 room.choices.forEach((choice,i)=>{const button=document.createElement("button");button.className="mv-choice";button.type="button";button.textContent=(i+1)+" · "+labels[i]+": "+choice;button.addEventListener("click",async()=>{
 byId("choice-status").textContent="Requesting read-only adjudication preview…";
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
 status("Loaded "+rooms.length+" rooms from the signed campaign API. Preview only.");if(rooms.length)showRoom(rooms[0]);
 }catch(error){reset();status(error.message)}
});
byId("disconnect").addEventListener("click",()=>{reset();status("Disconnected. Session cleared from this page.")});
