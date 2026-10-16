"use strict";
/** Experimental Glyph action economy; separate from official D&D rules. */
const {applyGlyphAction,PLANS}=require("./glyph-tactics");
function createGlyphTurnController(state,{roll}={}){
 if(!state||!Array.isArray(state.allies)||!Array.isArray(state.enemies)||!Array.isArray(state.log))throw new TypeError("Invalid encounter");
 let round=1,spent=false;
 function act(action){
  if(!PLANS.includes(action))throw new RangeError("Unknown action");
  if(spent)throw new Error("Glyph action already spent this round");
  const result=applyGlyphAction(state,action,{roll});
  spent=true;
  return {...result,round,actionSpent:true};
 }
 function nextRound(){
  if(round>=100000)throw new RangeError("Round limit reached");
  round++;spent=false;
  return {round,actionAvailable:true};
 }
 return {act,nextRound,status:()=>({round,actionAvailable:!spent})};
}
module.exports={createGlyphTurnController};
