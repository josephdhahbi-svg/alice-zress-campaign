"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listPlanarWeatherHazards,previewPlanarWeatherHazard}=require("./planar-weather-engine");
test("three planar hazards are homebrew, immutable previews",()=>{
 const hazards=listPlanarWeatherHazards();
 assert.equal(hazards.length,3);
 assert.deepEqual(hazards.map(x=>x.damageType),["acid","lightning","necrotic"]);
 assert.ok(hazards.every(x=>x.mode==="PREVIEW_ONLY"&&x.canonStatus==="MOONVEIL_HOMEBREW"));
 const result=previewPlanarWeatherHazard("haz_underdark_slime_rain","unit_alice",5);
 assert.deepEqual(result.damagePerRound,{min:2,max:12,damageType:"acid"});
 assert.deepEqual(result.totalPotentialDamage,{min:10,max:60});
 assert.equal(result.applied,false);assert.equal(result.effect,"NONE");
 assert.equal(result.requiresDmAdjudication,true);
 assert.equal(previewPlanarWeatherHazard("unknown","unit_alice"),null);
 for(const rounds of [0,21,1.5,"5"])assert.throws(()=>previewPlanarWeatherHazard("haz_underdark_slime_rain","unit_alice",rounds),TypeError);
 assert.throws(()=>previewPlanarWeatherHazard("haz_underdark_slime_rain","unit alice"),TypeError);
});
