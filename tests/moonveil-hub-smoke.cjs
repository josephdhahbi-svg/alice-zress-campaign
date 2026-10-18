// Moonveil source smoke checks. Node.js 22, no third-party dependencies.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const folder=path.join(__dirname,'..','game');
const pages=['moonveil-hub.html','alice-elder-eye-playtest.html','vesper-archive.html','index.html'];
for(const name of pages){
 const html=fs.readFileSync(path.join(folder,name),'utf8');
 assert.match(html,/<html\b/i,name+' lacks HTML root');
 assert.match(html,/<title>/i,name+' lacks document title');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
 scripts.forEach((m,i)=>new vm.Script(m[1],{filename:name+':script-'+i}));
 console.log('PASS parsed HTML scripts:',name);
}
const hub=fs.readFileSync(path.join(folder,'moonveil-hub.html'),'utf8');
for(const target of ['alice-elder-eye-playtest.html','vesper-archive.html','original-alice.html']){
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
