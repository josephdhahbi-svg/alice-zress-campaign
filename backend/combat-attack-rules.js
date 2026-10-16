"use strict";
/** Pure combat roll resolver. The server must generate rawRoll; clients cannot select it.
 * D&D-style natural 1 always misses and natural 20 always hits/criticals.
 * This does not itself mutate HP, spend spell slots, or award loot.
 */
const valid=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
function resolveAttack({rawRoll,attackBonus=0,armorClass,damageDice=[],damageBonus=0}){
 if(!valid(rawRoll,1,20)||!valid(attackBonus,-20,40)||!valid(armorClass,1,40)||
    !valid(damageBonus,-20,40)||!Array.isArray(damageDice)||damageDice.length>20||
    damageDice.some(d=>!valid(d,1,100)))throw new RangeError("INVALID_ATTACK");
 const critical=rawRoll===20;
 const hit=critical||(rawRoll!==1&&rawRoll+attackBonus>=armorClass);
 const damage=hit?Math.max(0,damageDice.reduce((sum,die)=>sum+die,0)+damageBonus):0;
 return Object.freeze({rawRoll,attackBonus,armorClass,total:rawRoll+attackBonus,hit,critical,damage});
}
module.exports={resolveAttack};
