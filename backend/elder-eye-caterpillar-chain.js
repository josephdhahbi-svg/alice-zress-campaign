"use strict";
const chain=require("../data/quest-packs/elder-eye-caterpillar-seven-stage-chain.json");
const byId=new Map(chain.stages.map(x=>[x.id,x]));
function listStages(){return chain.stages.map(x=>({id:x.id,sequence:x.sequence,title:x.title,sceneId:x.sceneId,prerequisites:x.prerequisites}))}
function previewStage(id,{completedStages=[],hasSeeingStone=false,dmApproved=false}={}){
 const stage=byId.get(id);
 if(!stage)return {available:false,reason:"UNKNOWN_STAGE"};
 if(!Array.isArray(completedStages))throw TypeError("INVALID_COMPLETIONS");
 const prior=stage.sequence===1?[]:[`eye_caterpillar_${stage.sequence-1}`];
 if(prior.some(x=>!completedStages.includes(x)))return {available:false,reason:"PRIOR_STAGE_REQUIRED"};
 if(stage.sequence===1&&!hasSeeingStone)return {available:false,reason:"SEEING_STONE_OR_APPROVED_PROXY_REQUIRED"};
 return {available:dmApproved===true,reason:dmApproved===true?"PREVIEW_READY":"DM_AND_CANON_REVIEW_REQUIRED",stage:structuredClone(stage),applied:false};
}
module.exports={listStages,previewStage};
