"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {AutomatonFSM,STATES}=require("./automaton_fsm");

test("valid patrol/engage/recalibration lifecycle is deterministic",()=>{
 const f=new AutomatonFSM("UNIT-VANGUARD-09");
 assert.equal(f.transition("START_PATROL").currentState,STATES.PATROL);
 assert.equal(f.transition("DETECT_TARGET").currentState,STATES.ENGAGE);
 assert.equal(f.transition("TARGET_LOST").currentState,STATES.PATROL);
 assert.equal(f.transition("RECALIBRATE").currentState,STATES.RECALIBRATE);
 assert.equal(f.transition("RECALIBRATION_COMPLETE").currentState,STATES.IDLE);
 assert.equal(f.sequence,5);
});
test("invalid transitions do not mutate the state or event count",()=>{
 const f=new AutomatonFSM("UNIT-VANGUARD-09");
 assert.throws(()=>f.transition("DETECT_TARGET"),/Invalid transition/);
 assert.equal(f.currentState,STATES.IDLE);
 assert.equal(f.sequence,0);
});
test("unknown commands and malformed payloads are rejected",()=>{
 const f=new AutomatonFSM("UNIT-VANGUARD-09");
 assert.throws(()=>f.transition("LAUNCH_MISSILE"),/Unknown command/);
 assert.throws(()=>f.transition("START_PATROL",{admin:true}),/empty object/);
 assert.equal(f.sequence,0);
});
test("emergency stop is terminal until separate authorized recovery exists",()=>{
 const f=new AutomatonFSM("UNIT-VANGUARD-09");
 const event=f.transition("EMERGENCY_STOP");
 assert.equal(event.currentState,STATES.EMERGENCY_SHUTDOWN);
 assert.throws(()=>f.transition("RESET_EMERGENCY"),/authorized operator/);
 assert.throws(()=>f.transition("START_PATROL"),/Invalid transition/);
});
test("low battery and invalid configuration are refused",()=>{
 assert.throws(()=>new AutomatonFSM("UNIT-VANGUARD-09",{battery:101}),/battery/);
 assert.throws(()=>new AutomatonFSM("bad id"),/ID/);
 const f=new AutomatonFSM("UNIT-VANGUARD-09",{battery:10});
 assert.throws(()=>f.transition("START_PATROL"),/Insufficient battery/);
});
test("event sequence and immutable snapshots",()=>{
 const f=new AutomatonFSM("UNIT-VANGUARD-09");
 const e=f.transition("START_PATROL");
 assert.equal(e.eventId,"UNIT-VANGUARD-09:1");
 assert.ok(Object.isFrozen(e));
 assert.equal(f.snapshot().sequence,1);
});
