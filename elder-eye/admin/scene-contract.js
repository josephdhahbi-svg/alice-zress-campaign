"use strict";
const CHOICE_ORDER=Object.freeze(["lawful_good","neutral_good","chaotic_good","utility","action"]);
function validateScene(scene){
  const errors=[];
  if(!scene||typeof scene!=="object"||Array.isArray(scene))return ["Scene must be an object"];
  if(typeof scene.id!=="string"||!scene.id)errors.push("Missing scene ID");
  if(!Array.isArray(scene.choices)||scene.choices.length!==5)errors.push("Exactly five choices required");
  else scene.choices.forEach((choice,index)=>{
    if(choice.order!==index+1||choice.kind!==CHOICE_ORDER[index])errors.push("Incorrect choice order at "+(index+1));
    if(typeof choice.id!=="string"||!choice.id)errors.push("Choice missing ID at "+(index+1));
  });
  if(Array.isArray(scene.choices)&&new Set(scene.choices.map(c=>c.id)).size!==scene.choices.length)errors.push("Duplicate choice IDs");
  if(!scene.location_id)errors.push("Missing location ID");
  if(!scene.character_id)errors.push("Missing character ID");
  return errors;
}
function resolveSceneChoice(scene,option,roll,modifier){
  const errors=validateScene(scene);
  if(errors.length)throw new Error(errors.join("; "));
  if(!Number.isInteger(option)||option<1||option>5)throw new RangeError("Choice must be 1-5");
  const choice=scene.choices[option-1];
  const check=choice.check;
  if(!check)return {sceneId:scene.id,choiceId:choice.id,option,outcome:choice.success??null,requiresRoll:false,tags:choice.consequence_tags??[]};
  if(!Number.isInteger(roll)||roll<1||roll>20)throw new RangeError("A d20 result of 1-20 is required");
  if(!Number.isInteger(modifier)||modifier< -30||modifier>30)throw new RangeError("Verified ability modifier required (-30 to 30)");
  const total=roll+modifier,success=total>=check.dc;
  return {sceneId:scene.id,choiceId:choice.id,option,ability:check.ability,skill:check.skill,dc:check.dc,roll,modifier,total,success,outcome:success?choice.success:choice.failure,tags:choice.consequence_tags??[]};
}
module.exports={CHOICE_ORDER,validateScene,resolveSceneChoice};
