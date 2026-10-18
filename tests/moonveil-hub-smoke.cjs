// Moonveil source smoke checks. Node.js 22, no third-party dependencies.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const folder=path.join(__dirname,'..','game');
const pages=['moonveil-hub.html','alice-elder-eye-playtest.html','vesper-archive.html','moonveil-characters.html','moonveil-world.html','moonveil-recovery-vault.html','moonveil-recovery-vault.html','index.html'];
for(const name of pages){
 const html=fs.readFileSync(path.join(folder,name),'utf8');
 assert.match(html,/<html\b/i,name+' lacks HTML root');
 assert.match(html,/<title>/i,name+' lacks document title');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
 scripts.forEach((m,i)=>new vm.Script(m[1],{filename:name+':script-'+i}));
 console.log('PASS parsed HTML scripts:',name);
}
const hub=fs.readFileSync(path.join(folder,'moonveil-hub.html'),'utf8');
for(const target of ['alice-elder-eye-playtest.html','vesper-archive.html','original-alice.html','moonveil-characters.html','moonveil-world.html']){
 assert.ok(hub.includes('href="./'+target+'"'),'Hub is missing '+target);
}
const alice=fs.readFileSync(path.join(folder,'alice-elder-eye-playtest.html'),'utf8');
for(const id of ['cinema','sheet','quests','log','help','map','notes','choices','playerNotes']){
 assert.ok(alice.includes('id="'+id+'"'),'Alice missing '+id);
}
assert.match(alice,/moonveil-alice-elder-eye-playtest-v1/);
const vesper=fs.readFileSync(path.join(folder,'vesper-archive.html'),'utf8');
assert.match(vesper,/moonveil-vesper-archive-v1/);
assert.doesNotMatch(vesper,/moonveil-alice-elder-eye-playtest-v1/);
console.log('PASS links, navigation tabs, and isolated saves');

const gameFiles=new Set([...pages,'original-alice.html']);
for(const link of hub.matchAll(/href="\.\/([^"]+\.html)"/g)){
 assert.ok(gameFiles.has(link[1]),'Hub links to untracked game: '+link[1]);
 if(link[1]==='original-alice.html')assert.ok(fs.existsSync(path.join(folder,'index.html')),'Original Alice source missing');else assert.ok(fs.existsSync(path.join(folder,link[1])),'Hub target missing: '+link[1]);
}
assert.match(hub,/GitHub source-preview pages are not the deployed game/,'Deployment caveat missing');
const aliceSceneCount=(alice.match(/title:"(?:The Pit of Ghaunadaur|The Rabbit Hole|The Hall of Infinite Doors|The Elder Eye Threshold)"/g)||[]).length;
assert.equal(aliceSceneCount,4,'Expected four Alice playtest scenes');
assert.match(alice,/speechSynthesis\.speak/,'Voice narrator integration missing');
console.log('PASS complete relative hub targets, four scenes, narration and preview disclaimer');

const dialogue=fs.readFileSync(path.join(folder,'moonveil-dialogue.js'),'utf8');new vm.Script(dialogue,{filename:'moonveil-dialogue.js'});assert.match(dialogue,/alice:/);assert.match(dialogue,/vesper:/);for(const page of ['alice-elder-eye-playtest.html','vesper-archive.html']){const html=fs.readFileSync(path.join(folder,page),'utf8');assert.match(html,/moonveil-dialogue\.js/);assert.match(html,/id="moonveilDialogue"/);}console.log('PASS shared optional dialogue integration');

assert.match(dialogue,/Search NPC dialogue/);assert.match(dialogue,/Questions explored:/);console.log("PASS searchable conversation UI");

assert.match(dialogue,/moonveil-knowledge-v1-/);assert.match(dialogue,/recordKnowledge/);assert.match(dialogue,/unconfirmed:true/);console.log("PASS unconfirmed knowledge ledger source checks");

assert.match(dialogue,/function renderJournal/);for(const page of ["alice-elder-eye-playtest.html","vesper-archive.html"]){assert.match(fs.readFileSync(path.join(folder,page),"utf8"),/id="moonveilKnowledge"/);}console.log("PASS NPC clue journal panels");

assert.match(dialogue,/function questProgress/);assert.match(dialogue,/Investigation objectives \(playtest\)/);assert.match(dialogue,/clue found/);console.log("PASS quest discovery progress integration");

const creator=fs.readFileSync(path.join(folder,"moonveil-characters.html"),"utf8");assert.match(creator,/moonveil-character-roster-v1/);assert.match(creator,/Create new character/);assert.match(hub,/universal character roster/);console.log("PASS general character creation and hub link");

const world=fs.readFileSync(path.join(folder,"moonveil-world.html"),"utf8");assert.match(world,/moonveil-world-sandbox-v1/);assert.match(world,/towns=\[/);assert.match(hub,/Enter Living World Sandbox/);console.log("PASS universal world hub and settlement module");

const worldData=JSON.parse(fs.readFileSync(path.join(folder,"data","moonveil-world-catalog.json"),"utf8"));
assert.equal(worldData.settlements.length,3);
assert.equal(worldData.npcs.length,8);
assert.equal(worldData.dungeons.length,3);
assert.equal(worldData.gemDragonCatalog.length,5);
const towns=new Set(worldData.settlements.map(t=>t.id));
const npcIds=new Set(worldData.npcs.map(n=>n.id));
const itemIds=new Set(worldData.items.map(i=>i.id));
for(const town of worldData.settlements){
 for(const road of town.roads)assert.ok(towns.has(road.to),'unknown road destination '+road.to);
 for(const building of town.buildings)assert.ok(npcIds.has(building.npc),'missing building owner '+building.npc);
}
for(const npc of worldData.npcs)for(const item of npc.inventory)assert.ok(itemIds.has(item),'unknown item '+item);
for(const dungeon of worldData.dungeons){assert.ok(towns.has(dungeon.near));assert.equal(dungeon.rooms.length,3);}
assert.match(world,/data\/moonveil-world-catalog\.json/);
console.log("PASS catalog references and dungeon data");

assert.match(world,/Travel, Roads & Buildings/);assert.match(world,/road.days/);assert.match(world,/a.dungeons\[d.id\]/);assert.match(world,/buildingDetail/);console.log("PASS travel, buildings and dungeon exploration code");

const travelCode=fs.readFileSync(path.join(folder,'moonveil-travel.js'),'utf8');
new vm.Script(travelCode,{filename:'moonveil-travel.js'});
const sandbox={};vm.runInNewContext(travelCode,{window:sandbox});
const api=sandbox.MoonveilTravel;
assert.ok(api&&api.routes.length>=10);
assert.equal(api.travel({location:'mistport',coins:500,day:1,items:[]},'mists-barovia').ok,false);
const trip=api.travel({location:'embercross',coins:500,day:1,items:[]},'starfall');
assert.equal(trip.ok,true);assert.equal(trip.state.location,'starglen');assert.equal(trip.state.day,3);
assert.match(world,/moonveil-travel\.js/);
console.log('PASS universal travel routing and gated Ravenloft crossings');

const recovered=JSON.parse(fs.readFileSync(path.join(folder,"data","recovered-assets-index.json"),"utf8"));assert.ok(recovered.artSources.length>=7);assert.ok(recovered.characterSources.length>=5);console.log("PASS recovery asset inventory references");
