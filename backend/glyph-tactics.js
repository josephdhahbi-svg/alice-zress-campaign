"use strict";
/** Isolated experimental Glyph tactics. NOT authoritative D&D character rules. */
const PLANS=Object.freeze(["ATTACK","SUPPORT","CONTROL","DEFEND","SCAN"]);
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function chooseGlyphAction({glyph,allies,enemies}){
 if(!glyph||!Array.isArray(allies)||!Array.isArray(enemies))throw new TypeError("Invalid encounter");
 const alive=unit=>unit&&Number.isFinite(unit.hp)&&unit.hp>0;
 const valid=unit=>alive(unit)&&Number.isFinite(unit.maxHp)&&unit.maxHp>0;
 if(!valid(glyph))return "INACTIVE";
 const alice=allies.find(x=>x.id==="alice"&&valid(x));
 if(alice&&alice.hp/alice.maxHp<0.5)return "SUPPORT";
 if(glyph.hp/glyph.maxHp<0.3)return "DEFEND";
 if(enemies.filter(alive).length>=2)return "CONTROL";
 if(enemies.some(alive))return "ATTACK";
 return "SCAN";
}
function applyGlyphAction(state,action,{roll=()=>4}={}){
 if(!state||!Array.isArray(state.allies)||!Array.isArray(state.enemies)||!Array.isArray(state.log))
  throw new TypeError("Invalid state");
 if(!PLANS.includes(action))throw new RangeError("Unknown action");
 const glyph=state.allies.find(x=>x.id==="glyph");
 if(!glyph||!Number.isFinite(glyph.hp)||glyph.hp<=0||!Number.isFinite(glyph.maxHp)||glyph.maxHp<=0)throw new Error("Glyph unavailable");
 const alice=state.allies.find(x=>x.id==="alice");
 const result={action,detail:""};
 if(action==="SUPPORT"){
  if(!alice||!Number.isFinite(alice.hp)||!Number.isFinite(alice.maxHp)||alice.maxHp<=0||alice.hp<=0||alice.hp>=alice.maxHp)result.detail="No eligible ally";
  else {const raw=Number(roll());const amount=clamp(Number.isFinite(raw)?raw:1,1,6)+2;alice.hp=Math.min(alice.maxHp,alice.hp+amount);result.detail="Alice restored "+amount+" HP (prototype)";}
 }else if(action==="ATTACK"){
  const enemy=state.enemies.find(x=>x&&Number.isFinite(x.hp)&&x.hp>0);
  if(!enemy)result.detail="No target";
  else {const raw=Number(roll());const damage=clamp(Number.isFinite(raw)?raw:1,1,6)+2;enemy.hp=Math.max(0,enemy.hp-damage);result.detail=enemy.id+" took "+damage+" prototype damage";}
 }else if(action==="DEFEND"){result.detail="Glyph guards this round";result.effect={defenseBonus:2,expires:"END_OF_ROUND"};}
 else if(action==="CONTROL"){result.detail="Glyph marks enemy movement lanes";result.effect={control:true,expires:"END_OF_ROUND"};}
 else result.detail="Glyph scans for hazards";
 state.log.push("Glyph: "+result.detail);
 return result;
}
module.exports={chooseGlyphAction,applyGlyphAction,PLANS};
