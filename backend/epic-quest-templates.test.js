"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {getEpicQuestTemplate}=require("./epic-quest-templates");
test("epic quest templates have distinct objectives and no automatic progression",()=>{
 for(const id of ["quest_act1_pit_awakening","quest_act2_mystra_weave","quest_act3_lich_ascension"]){
  const t=getEpicQuestTemplate(id);
  assert.equal(t.objectives.length,3);
  assert.deepEqual(t.requiredObjectiveIds,t.objectives.map(o=>o.id));
  assert.equal(new Set(t.requiredObjectiveIds).size,3);
  assert.equal(t.automaticApproval,false);
  assert.equal(t.automaticCompletion,false);
  assert.deepEqual(t.awardedArtifacts,[]);
  assert.equal(t.reputationGranted,0);
  assert.equal(t.ascensionGranted,false);
 }
 assert.equal(getEpicQuestTemplate("quest_act3_lich_ascension").registrationAllowed,false);
 assert.equal(getEpicQuestTemplate("quest_act1_pit_awakening").registrationAllowed,true);
 assert.equal(getEpicQuestTemplate("unknown"),null);
});
