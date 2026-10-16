"use strict";

/**
 * Deterministic, transport-independent prototype of Moonveil automaton state.
 * No physical hardware control, no database, and no WebSocket connection here.
 */
const STATES=Object.freeze({
 IDLE:"IDLE",PATROL:"PATROL",ENGAGE:"ENGAGE",
 RECALIBRATE:"RECALIBRATE",EMERGENCY_SHUTDOWN:"EMERGENCY_SHUTDOWN"
});
const TRANSITIONS=Object.freeze({
 IDLE:Object.freeze({START_PATROL:STATES.PATROL,RECALIBRATE:STATES.RECALIBRATE,EMERGENCY_STOP:STATES.EMERGENCY_SHUTDOWN}),
 PATROL:Object.freeze({STOP_PATROL:STATES.IDLE,DETECT_TARGET:STATES.ENGAGE,RECALIBRATE:STATES.RECALIBRATE,EMERGENCY_STOP:STATES.EMERGENCY_SHUTDOWN}),
 ENGAGE:Object.freeze({TARGET_LOST:STATES.PATROL,DISENGAGE:STATES.IDLE,EMERGENCY_STOP:STATES.EMERGENCY_SHUTDOWN}),
 RECALIBRATE:Object.freeze({RECALIBRATION_COMPLETE:STATES.IDLE,EMERGENCY_STOP:STATES.EMERGENCY_SHUTDOWN}),
 EMERGENCY_SHUTDOWN:Object.freeze({})
});
const MAX_BATTERY=100;
function assertId(value){if(typeof value!=="string"||!/^[A-Z0-9][A-Z0-9_-]{1,63}$/.test(value))throw new TypeError("Invalid automaton ID");}
function validateCommand(command,payload){
 if(typeof command!=="string"||!Object.prototype.hasOwnProperty.call({START_PATROL:1,STOP_PATROL:1,DETECT_TARGET:1,TARGET_LOST:1,DISENGAGE:1,RECALIBRATE:1,RECALIBRATION_COMPLETE:1,EMERGENCY_STOP:1,RESET_EMERGENCY:1},command))throw new TypeError("Unknown command");
 if(payload===undefined)payload={};
 if(payload===null||typeof payload!=="object"||Array.isArray(payload)||Object.keys(payload).length>0)throw new TypeError("Payload must be an empty object in FSM v1");
 return payload;
}
class AutomatonFSM{
 constructor(entityId,{battery=100,sensorRangeMeters=10}={}){
  assertId(entityId);
  if(!Number.isFinite(battery)||battery<0||battery>MAX_BATTERY)throw new RangeError("Invalid battery");
  if(!Number.isFinite(sensorRangeMeters)||sensorRangeMeters<=0||sensorRangeMeters>10000)throw new RangeError("Invalid sensor range");
  this.entityId=entityId;
  this.currentState=STATES.IDLE;
  this.batteryLevel=battery;
  this.sensorRangeMeters=sensorRangeMeters;
  this.sequence=0;
 }
 transition(command,payload={}){
  validateCommand(command,payload);
  const previousState=this.currentState;
  if(command==="RESET_EMERGENCY")throw new Error("Emergency reset requires a separate authorized operator workflow");
  if(command==="START_PATROL"&&this.batteryLevel<15)throw new Error("Insufficient battery to start patrol");
  const next=TRANSITIONS[previousState][command];
  if(!next)throw new Error("Invalid transition: "+previousState+" + "+command);
  this.currentState=next;
  return Object.freeze({eventId:this.entityId+":"+(++this.sequence),entityId:this.entityId,command,previousState,currentState:next,battery:this.batteryLevel,sensorRangeMeters:this.sensorRangeMeters});
 }
 snapshot(){return Object.freeze({entityId:this.entityId,currentState:this.currentState,battery:this.batteryLevel,sensorRangeMeters:this.sensorRangeMeters,sequence:this.sequence});}
}
module.exports={STATES,TRANSITIONS,AutomatonFSM,validateCommand};
