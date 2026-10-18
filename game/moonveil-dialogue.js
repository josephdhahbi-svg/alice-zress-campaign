/* Moonveil dialogue module v1: optional conversations, independent of canonical choices.
   Deliberately data-driven. No external service or automatic quest rewards. */
(function(){
"use strict";
const conversations={
 alice:[
  {npc:"The Captive",lines:[
   ["Who are you?","I was taken from the tunnels. The cult calls this place the mouth of the Elder Eye."],
   ["How can I help?","Keep the younger prisoners away from the chanting. They are afraid."],
   ["What is Ghaunadaur's influence here?","The stone listens whenever the priests speak that name."],
   ["Tell me about Eilistraee.","Some still sing beneath the stone, even when darkness answers."],
   ["Is there another way out?","There is a stair beneath the western arch. I never saw where it ended."],
   ["What should I remember?","The bells ring even when nobody touches them."]]},
  {npc:"The Falling Pilgrim",lines:[
   ["Can you hear me?","Yes. Stay close; the doors are drifting apart."],
   ["What happened to time?","I saw tomorrow behind one arch and yesterday behind another."],
   ["Can we trust the silver door?","I cannot tell. It echoes the songs from my childhood."],
   ["Do you know Elminster?","Only stories. A name is not proof that the man waits beyond a door."],
   ["What does the spiral mean?","Every turn seems to lead us nearer to the same impossible center."],
   ["How can I protect the others?","Call them by name so they remember who they are."]]},
  {npc:"The Guardian Shade",lines:[
   ["What is this hall?","A place of thresholds. Not every door leads where its inscription claims."],
   ["Who made the seals?","Many hands. I remember none clearly enough to name."],
   ["What lies beyond the Elder Eye?","A question that answers those who ask it."],
   ["Can this gateway be closed?","Perhaps briefly. Nothing here is easily made permanent."],
   ["Have you met Elminster?","Names cross this hall more often than people."],
   ["What price do you demand?","Only that you remember what you choose."]]},
  {npc:"Voice Beyond the Threshold",lines:[
   ["Who speaks?","A remnant beneath the seal. You have not earned my true name."],
   ["What do you want?","A doorway without a keeper."],
   ["Why test me?","Because every promise becomes a key."],
   ["What is the safest path?","That depends on whom you refuse to abandon."],
   ["Can we negotiate?","You may ask, but I make no promises."],
   ["What happens if I leave?","The threshold will remain, and so will your memory of it."]]}
 ],
 vesper:[
  {npc:"Archive Echo",lines:[
   ["Who protects this archive?","The oldest wards keep watch. Some remember whom they served."],
   ["What is the Silver Strand Codex?","A witness to threads the Weave has not forgotten."],
   ["Where are the survivors?","Follow the softer knocking, not the louder clock."],
   ["Can I trust these runes?","Trust their pattern only after you test the key."],
   ["What does Vaelthara know?","More than I am permitted to repeat."],
   ["Is the passage safe?","No passage in this archive is safe merely because it is open."]]},
  {npc:"Spectral Librarian",lines:[
   ["Who are you?","A custodian, until the final catalog is completed."],
   ["Whose knowledge is here?","Netherese fragments and the testimonies of scholars lost to mist."],
   ["Do you serve Mystra?","I serve the preservation of knowledge. Judge my actions, not my title."],
   ["What does the star chart show?","One correspondence points toward a Moonbridge mark."],
   ["May I examine the collection?","Carefully. The books remember rough hands."],
   ["What threatens the library?","Those who would rewrite a memory instead of understanding it."]]},
  {npc:"Mist-bound Guardian",lines:[
   ["Why block the door?","The threshold has failed too many times."],
   ["Can we avoid fighting?","Prove you can mend what others have broken."],
   ["What weakens the ward?","The hinges respond to an older harmony."],
   ["Who made you?","That memory was taken from me."],
   ["What is beyond you?","An astrolabe and a debt left unpaid."],
   ["Will you listen to Vaelthara?","I listen to actions, not borrowed authority."]]},
  {npc:"Moonbridge Astrolabe",lines:[
   ["What have I found?","A sigil recorded, not a journey completed."],
   ["Can I travel through it?","Not until the path and its anchors are known."],
   ["Where is the next clue?","Seek the corresponding star in the forgotten catalog."],
   ["What should enter my library?","The record of discovery. Claim no artifact you have not recovered."],
   ["Is this Netherese magic?","Its geometry carries echoes of Netherese craft."],
   ["What remains hidden?","More than this archive can answer in one night."]]}
 ]};
const discoveries={
 alice:[["captive-testimony","Witness says captives need protection"],["spiral-doors","Witness reports time-shifted doors"],["hall-ward","Guardian warns of unreliable portal inscriptions"],["threshold-voice","Unknown voice demands an unguarded doorway"]],
 vesper:[["archive-ward","Archive echo reports ancient defensive wards"],["star-chart","Librarian identifies Moonbridge star-chart connection"],["guardian-hinge","Guardian describes a ward hinge resonance"],["moonbridge-record","Astrolabe identifies a sigil record, not a completed journey"]]
};
const knowledgeKey=campaign=>"moonveil-knowledge-v1-"+campaign;
function knowledge(campaign){try{const data=JSON.parse(localStorage.getItem(knowledgeKey(campaign)));return data&&Array.isArray(data.clues)?data.clues:[];}catch(_){return [];}}
function recordKnowledge(campaign,sceneIndex){const clue=discoveries[campaign]?.[sceneIndex];if(!clue)return;const clues=knowledge(campaign);if(clues.some(x=>x.id===clue[0]))return;clues.push({id:clue[0],summary:clue[1],origin:"optional-dialogue",unconfirmed:true});try{localStorage.setItem(knowledgeKey(campaign),JSON.stringify({version:1,clues}));}catch(_){}}
const key=campaign=>"moonveil-dialogue-v1-"+campaign;
function mount(campaign,sceneIndex){
 const root=document.getElementById("moonveilDialogue");if(!root)return;
 const set=conversations[campaign];if(!set)return;
 const node=set[Math.max(0,Math.min(set.length-1,Number(sceneIndex)||0))];
 let store={};try{store=JSON.parse(localStorage.getItem(key(campaign)))||{};}catch(_){}
 const entries=Array.isArray(store[node.npc])?store[node.npc]:[];
 root.replaceChildren();
 const heading=document.createElement("h2");heading.textContent="Conversations — "+node.npc;root.append(heading);
 const hint=document.createElement("p");hint.textContent="Optional dialogue: ask questions without advancing the main five-choice encounter.";root.append(hint);
 const filter=document.createElement("input");filter.type="search";filter.placeholder="Search dialogue topics";filter.setAttribute("aria-label","Search NPC dialogue");filter.style.cssText="width:100%;padding:10px;background:#101d25;color:white;border:1px solid #78918e;border-radius:9px;margin-bottom:10px";root.append(filter);
 const count=document.createElement("small");count.textContent="Questions explored: "+entries.length+" / "+node.lines.length;root.append(count);
 const options=document.createElement("div");options.style.cssText="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px";
 const reply=document.createElement("p");reply.setAttribute("aria-live","polite");
 reply.textContent=entries.length?"Previously asked "+entries.length+" topic(s) here.":"Choose a question to hear the answer.";
 const buttons=[];node.lines.forEach(([question,answer],i)=>{
  const button=document.createElement("button");button.type="button";button.textContent=question;
  button.onclick=()=>{
   reply.textContent=node.npc+": “"+answer+"”";
   const list=Array.isArray(store[node.npc])?store[node.npc]:[];
   if(!list.includes(i)){recordKnowledge(campaign,Math.max(0,Math.min(set.length-1,Number(sceneIndex)||0)));list.push(i);store[node.npc]=list;count.textContent="Questions explored: "+list.length+" / "+node.lines.length;try{localStorage.setItem(key(campaign),JSON.stringify(store));}catch(_){}}
  };options.append(button);buttons.push({button,question,answer});
 });
 filter.oninput=()=>{const q=filter.value.trim().toLowerCase();buttons.forEach(({button,question,answer})=>{button.hidden=!!q&&!((question+" "+answer).toLowerCase().includes(q));});};
 root.append(options,reply);
}
window.MoonveilDialogue={mount,knowledge};
})();
