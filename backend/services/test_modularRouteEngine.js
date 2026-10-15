'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {DatabaseSync}=require('node:sqlite');
const {migrate,listRoutes,upsertRoute}=require('./modularRouteEngine');
function db(){const d=new DatabaseSync(':memory:');migrate(d);return d;}
const route={profileId:'alice',routeId:'U01_MEDICINE_ROUTE',fromSector:'UNDERDARK_SAFEHOUSE',toSector:'TRADE_PASSAGE',routeName:'Medicine Trade Route'};
test('route defaults locked and never auto-travels',()=>{const d=db();upsertRoute(d,route);const r=listRoutes(d,{profileId:'alice',sectorId:'UNDERDARK_SAFEHOUSE'});assert.equal(r[0].status,'LOCKED');assert.equal(r[0].canRequestTravel,false);d.close()});
test('discovered route allows request, not traversal',()=>{const d=db();upsertRoute(d,{...route,status:'DISCOVERED'});assert.equal(listRoutes(d,{profileId:'alice',sectorId:'UNDERDARK_SAFEHOUSE'})[0].canRequestTravel,true);d.close()});
test('blocked route cannot request travel',()=>{const d=db();upsertRoute(d,{...route,status:'BLOCKED'});assert.equal(listRoutes(d,{profileId:'alice',sectorId:'UNDERDARK_SAFEHOUSE'})[0].canRequestTravel,false);d.close()});
test('profiles cannot see other routes',()=>{const d=db();upsertRoute(d,route);assert.deepEqual(listRoutes(d,{profileId:'bob',sectorId:'UNDERDARK_SAFEHOUSE'}),[]);d.close()});
test('rejects invalid hazard',()=>{const d=db();assert.throws(()=>upsertRoute(d,{...route,hazardMultiplier:-1}));d.close()});
test('rejects invalid status',()=>{const d=db();assert.throws(()=>upsertRoute(d,{...route,status:'TRAVERSED'}));d.close()});
test('route updates are idempotent',()=>{const d=db();upsertRoute(d,route);upsertRoute(d,{...route,status:'DISCOVERED'});assert.equal(listRoutes(d,{profileId:'alice',sectorId:'UNDERDARK_SAFEHOUSE'}).length,1);d.close()});
test('origin filtering',()=>{const d=db();upsertRoute(d,route);assert.deepEqual(listRoutes(d,{profileId:'alice',sectorId:'OTHER_SECTOR'}),[]);d.close()});
