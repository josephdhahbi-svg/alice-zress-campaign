"use strict";
// Mount only behind the existing server's authorization middleware.
// Staged catalog API: no game-state mutations, autonomous scheduling, or fake live SSE.
const express=require("express");
const catalog=require("../data/integrations/2026-10-16-lego-handoff-staging.json");
function createMoonveilMasterLegoRouter(){
 const router=express.Router();
 router.get("/lego/status",(req,res)=>{
   res.json({success:true,mode:"STAGING_READ_ONLY",live:false,modulesLoaded:{
     erasCount:3,sectorsCount:catalog.proposedSectors.length,
     npcImportCandidatesCount:catalog.characterImports.length,
     autonomousAgentFixturesCount:catalog.telemetryFixtures.length
   },warnings:catalog.requestedButNotSupplied});
 });
 router.get("/lego/npc-imports",(req,res)=>res.json({success:true,records:catalog.characterImports}));
 router.get("/lego/sectors",(req,res)=>res.json({success:true,verified:false,records:catalog.proposedSectors}));
 router.get("/lego/telemetry-snapshot",(req,res)=>res.json({success:true,live:false,mode:"STATIC_FIXTURE",agents:catalog.telemetryFixtures}));
 router.post("/lego/inject-module",(req,res)=>res.status(409).json({success:false,error:"WRITE_DISABLED_STAGING_ONLY",reason:"Requires schema validation, role authorization, provenance and DM approval"}));
 return router;
}
module.exports={createMoonveilMasterLegoRouter};
