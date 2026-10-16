"use strict";
/** Optional DM planning templates. Evidence and approvals remain authoritative. */
const {previewEpicQuestCandidate}=require("./epic-quest-candidates");
const TEMPLATES=Object.freeze({
 quest_act1_pit_awakening:Object.freeze([
  {id:"investigate_pit",label:"Investigate the Pit without accepting Ghaunadaur's corruption"},
  {id:"identify_slime_vault",label:"Locate and document the slime vault"},
  {id:"secure_core_safely",label:"Resolve the primordial core without an automatic artifact award"}
 ]),
 quest_act2_mystra_weave:Object.freeze([
  {id:"verify_myth_drannor_era",label:"Verify Myth Drannor exists and is accessible in the campaign era"},
  {id:"locate_weave_shards",label:"Locate three proposed Weave shards with DM-approved evidence"},
  {id:"restore_weave_safely",label:"Resolve the Weave restoration objective"}
 ]),
 quest_act3_lich_ascension:Object.freeze([
  {id:"complete_heroic_sacrifice",label:"Complete Alice's Eilistraee Freedom sacrifice arc"},
  {id:"verify_future_ritual",label:"Verify all future ritual prerequisites and chronological placement"},
  {id:"obtain_dm_ritual_approval",label:"Obtain explicit separate DM approval for the ritual"}
 ])
});
function getEpicQuestTemplate(questId){
 const quest=previewEpicQuestCandidate(questId);
 if(!quest)return null;
 const objectives=TEMPLATES[questId];
 return {quest:quest.quest,objectives:objectives.map(x=>({...x})),requiredObjectiveIds:objectives.map(x=>x.id),registrationAllowed:quest.quest.status!=="FUTURE_LOCKED",automaticApproval:false,automaticCompletion:false,awardedArtifacts:[],reputationGranted:0,ascensionGranted:false};
}
module.exports={getEpicQuestTemplate};
