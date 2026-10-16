"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const {listLichdomPaths,getLichdomPath,previewLichdomPath}=require("./lichdom-eleven-paths");
test("nine alignments and two transcendent lich paths are proposed but never unlocked",()=>{
 const paths=listLichdomPaths();
 assert.equal(paths.length,11);
 assert.equal(paths.filter(p=>p.category==="ALIGNMENT_9").length,9);
 assert.equal(paths.filter(p=>p.category==="TRANSCENDENT").length,2);
 assert.ok(paths.every(p=>p.ritualApproved===false&&p.phylacteryApproved===false));
 assert.equal(getLichdomPath("lich_true_trinity").core,"THE_RABBIT_HOLE_ITSELF");
 assert.equal(getLichdomPath("lich_true_trinity").physicalAnchor,"PIT_OF_GHAUNADAUR_UNDERDARK");
 assert.equal(previewLichdomPath("lich_true_trinity").allowed,false);
 assert.equal(previewLichdomPath("invalid").reason,"UNKNOWN_PATH");
 paths[0].ritualApproved=true;
 assert.equal(getLichdomPath(paths[0].id).ritualApproved,false);
});
