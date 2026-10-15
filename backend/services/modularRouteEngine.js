'use strict';
// Route discovery is read-only. Traversal requires a separate authenticated command.
const ID=/^[A-Za-z0-9_-]{1,128}$/;
function requireId(value,label){if(typeof value!=='string'||!ID.test(value))throw new TypeError('Invalid '+label);return value;}
function migrate(db){
 db.exec(`CREATE TABLE IF NOT EXISTS world_routes(
 profile_id TEXT NOT NULL, route_id TEXT NOT NULL, from_sector TEXT NOT NULL,
 to_sector TEXT NOT NULL, route_name TEXT NOT NULL, status TEXT NOT NULL
 CHECK(status IN ('DISCOVERED','LOCKED','BLOCKED')),
 hazard_multiplier REAL NOT NULL CHECK(hazard_multiplier>=1 AND hazard_multiplier<=10),
 tactical_advantage TEXT, PRIMARY KEY(profile_id,route_id));
 CREATE INDEX IF NOT EXISTS idx_world_routes_sector ON world_routes(profile_id,from_sector,status);`);
}
function listRoutes(db,{profileId,sectorId}){
 requireId(profileId,'profile');requireId(sectorId,'sector');
 return db.prepare(`SELECT route_id,from_sector,to_sector,route_name,status,hazard_multiplier,tactical_advantage
 FROM world_routes WHERE profile_id=? AND from_sector=? ORDER BY route_id`).all(profileId,sectorId)
 .map(r=>({routeId:r.route_id,fromSector:r.from_sector,toSector:r.to_sector,routeName:r.route_name,
 status:r.status,hazardMultiplier:r.hazard_multiplier,tacticalAdvantage:r.tactical_advantage,
 canRequestTravel:r.status==='DISCOVERED'}));
}
function upsertRoute(db,{profileId,routeId,fromSector,toSector,routeName,status='LOCKED',hazardMultiplier=1,tacticalAdvantage=null}){
 for(const [v,l] of [[profileId,'profile'],[routeId,'route'],[fromSector,'origin'],[toSector,'destination']])requireId(v,l);
 if(typeof routeName!=='string'||!routeName.trim()||routeName.length>160)throw new TypeError('Invalid route name');
 if(!['DISCOVERED','LOCKED','BLOCKED'].includes(status))throw new RangeError('Invalid route status');
 if(typeof hazardMultiplier!=='number'||!Number.isFinite(hazardMultiplier)||hazardMultiplier<1||hazardMultiplier>10)throw new RangeError('Invalid hazard');
 if(tacticalAdvantage!==null&&(typeof tacticalAdvantage!=='string'||tacticalAdvantage.length>240))throw new TypeError('Invalid tactical advantage');
 db.prepare(`INSERT INTO world_routes(profile_id,route_id,from_sector,to_sector,route_name,status,hazard_multiplier,tactical_advantage)
 VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(profile_id,route_id) DO UPDATE SET
 from_sector=excluded.from_sector,to_sector=excluded.to_sector,route_name=excluded.route_name,
 status=excluded.status,hazard_multiplier=excluded.hazard_multiplier,tactical_advantage=excluded.tactical_advantage`)
 .run(profileId,routeId,fromSector,toSector,routeName.trim(),status,hazardMultiplier,tacticalAdvantage);
}
module.exports={migrate,listRoutes,upsertRoute};
