"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listQuestChains,previewQuestChain}=require("./multiverse-quest-chains");
test("seven sequential multiverse quest chains are bounded and connected",()=>{
 const all=listQuestChains();
 assert.equal(all.length,7);
 assert.equal(new Set(all.map(x=>x.id)).size,7);
 assert.equal(all.reduce((n,x)=>n+x.stages.length,0),28);
 for(let i=0;i<all.length;i++){
  const x=all[i];assert.equal(x.stages.length,4);
  assert.equal(new Set(x.stages.map(y=>y.id)).size,4);
  assert.equal(x.status,"DRAFT");
  assert.equal(x.version,"v1");
  assert.equal(x.automaticApproval,false);
  assert.equal(x.automaticRewards,false);
  assert.equal(x.drDate,"UNRESOLVED");
  if(i>0)assert.deepEqual(x.prerequisites,[all[i-1].id]);
 }
});
test("chronological and prerequisite gates never auto-grant rewards or travel",()=>{
 const chains=listQuestChains();
 for(let i=0;i<chains.length;i++){
  const p=previewQuestChain(chains[i].id);
  assert.equal(p.planningUnlocked,i===0);
  assert.equal(p.registrationAllowed,false);
  assert.equal(p.requiresDmApproval,true);
  assert.deepEqual(p.worldChanges,[]);
  assert.deepEqual(p.awardedItems,[]);
  assert.equal(p.xpGranted,0);
  assert.equal(p.ascensionGranted,false);
  assert.equal(p.travelUnlocked,false);
 }
 const unlocked=previewQuestChain(chains[1].id,{completedChainIds:[chains[0].id]});
 assert.equal(unlocked.planningUnlocked,true);
 assert.equal(unlocked.registrationAllowed,false);
 assert.equal(previewQuestChain("chain_nonexistent"),null);
 assert.throws(()=>previewQuestChain("bad/path"),TypeError);
 assert.throws(()=>previewQuestChain(chains[0].id,{completedChainIds:["bad/path"]}),TypeError);
});
test("returned quest data cannot mutate module templates",()=>{
 const a=listQuestChains();a[0].stages[0].label="tampered";a[0].factions.push("forged");
 const b=listQuestChains();
 assert.notEqual(b[0].stages[0].label,"tampered");
 assert.equal(b[0].factions.includes("forged"),false);
});
