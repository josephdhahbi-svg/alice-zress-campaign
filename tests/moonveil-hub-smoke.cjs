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
for(const target of ['alice-elder-eye-playtest.html','vesper-archive.html','index.html']){
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
