"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {resolveAttack}=require("./combat-attack-rules");
test("natural 1 misses regardless of bonus",()=>{
 assert.deepEqual(resolveAttack({rawRoll:1,attackBonus:40,armorClass:1,damageDice:[8]}),{rawRoll:1,attackBonus:40,armorClass:1,total:41,hit:false,critical:false,damage:0});
});
test("natural 20 hits and flags critical; doubling dice is caller responsibility",()=>{
 const r=resolveAttack({rawRoll:20,attackBonus:-20,armorClass:40,damageDice:[5,4],damageBonus:2});
 assert.equal(r.hit,true);assert.equal(r.critical,true);assert.equal(r.damage,11);
});
test("normal attack, miss, damage floor and invalid inputs",()=>{
 assert.equal(resolveAttack({rawRoll:12,attackBonus:3,armorClass:15,damageDice:[4],damageBonus:2}).damage,6);
 assert.equal(resolveAttack({rawRoll:12,attackBonus:2,armorClass:15,damageDice:[4]}).damage,0);
 assert.equal(resolveAttack({rawRoll:10,armorClass:10,damageDice:[2],damageBonus:-5}).damage,0);
 for(const bad of [{rawRoll:NaN,armorClass:10},{rawRoll:21,armorClass:10},{rawRoll:10,armorClass:Infinity},{rawRoll:10,armorClass:10,damageDice:[0]},{rawRoll:10,armorClass:10,damageDice:new Array(21).fill(1)}])assert.throws(()=>resolveAttack(bad),/INVALID_ATTACK/);
});
