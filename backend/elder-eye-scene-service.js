"use strict";
/** Elder Eye scene adapter for the existing VTT event journal; no second database. */
const crypto=require("node:crypto");
const {validateScene,resolveSceneChoice}=require("../elder-eye/admin/scene-contract");
function createElderEyeSceneService(db,{scenes}){
  if(!Array.isArray(scenes))throw new TypeError("scenes array required");
  const byId=new Map();
  for(const scene of scenes){
    const errors=validateScene(scene);
    if(errors.length)throw new Error("Invalid scene "+scene.id+": "+errors.join("; "));
    if(byId.has(scene.id))throw new Error("Duplicate scene ID: "+scene.id);
    byId.set(scene.id,scene);
  }
  const member=db.prepare("SELECT role FROM vtt_campaign_members WHERE campaign_id=? AND actor_id=?");
  const revision=db.prepare("SELECT COALESCE(MAX(revision),0) AS revision FROM vtt_campaign_events WHERE campaign_id=?");
  const prior=db.prepare("SELECT revision,actor_id,event_type,payload_json FROM vtt_campaign_events WHERE campaign_id=? AND event_id=?");
  const insert=db.prepare("INSERT INTO vtt_campaign_events(campaign_id,revision,event_id,actor_id,event_type,payload_json,occurred_at) VALUES(?,?,?,?,?,?,?)");
  const apply=db.transaction(({campaignId,actorId,eventId,expectedRevision,sceneId,option,roll,modifier})=>{
    const access=member.get(campaignId,actorId);
    if(!access||access.role==="OBSERVER")return {status:403,error:"FORBIDDEN"};
    const scene=byId.get(sceneId);
    if(!scene)return {status:404,error:"SCENE_NOT_FOUND"};
    let result;
    try{result=resolveSceneChoice(scene,option,roll,modifier)}
    catch{return {status:400,error:"INVALID_SCENE_CHOICE"}}
    const payload=JSON.stringify(result);
    const old=prior.get(campaignId,eventId);
    if(old){
      if(old.actor_id!==actorId||old.event_type!=="ELDER_EYE_CHOICE"||old.payload_json!==payload)return {status:409,error:"IDEMPOTENCY_CONFLICT"};
      return {status:200,revision:old.revision,duplicate:true,result};
    }
    const current=revision.get(campaignId).revision;
    if(current!==expectedRevision)return {status:409,error:"REVISION_CONFLICT",revision:current};
    insert.run(campaignId,current+1,eventId,actorId,"ELDER_EYE_CHOICE",payload,new Date().toISOString());
    return {status:201,revision:current+1,duplicate:false,result};
  });
  function submit(input){
    if(!input||typeof input!=="object")return {status:400,error:"INVALID_INPUT"};
    for(const key of ["campaignId","actorId","eventId","sceneId"]){
      if(typeof input[key]!=="string"||!/^[a-zA-Z0-9:_-]{1,100}$/.test(input[key]))return {status:400,error:"INVALID_INPUT"};
    }
    if(!Number.isSafeInteger(input.expectedRevision)||input.expectedRevision<0)return {status:400,error:"INVALID_INPUT"};
    return apply(input);
  }
  return {submit,getScene:id=>byId.get(id)||null};
}
module.exports={createElderEyeSceneService};
