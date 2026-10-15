PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS cosmic_sector_registry (
  sector_id TEXT PRIMARY KEY,
  sector_name TEXT NOT NULL,
  cosmic_plane TEXT NOT NULL,
  environmental_modifier TEXT NOT NULL,
  grid_x INTEGER NOT NULL,
  grid_y INTEGER NOT NULL,
  grid_z INTEGER NOT NULL,
  is_active_sector INTEGER NOT NULL DEFAULT 0 CHECK(is_active_sector IN (0,1)),
  canon_status TEXT NOT NULL DEFAULT 'HOMEBREW'
);
INSERT INTO cosmic_sector_registry
(sector_id,sector_name,cosmic_plane,environmental_modifier,grid_x,grid_y,grid_z,is_active_sector,canon_status)
VALUES
('sec_promenade_01','The Living Promenade','Prime Material / Far Realm Border','Gravity fluctuates by 10% each round',0,0,0,0,'HOMEBREW'),
('sec_tea_party_99','Mad Hatter Void Nexus','Beyond Wonderland','Time flows backward during initiative count 20',120,-60,80,0,'HOMEBREW'),
('sec_lich_spire_03','Bone Cathedral of Vecna','Undeath Void','Necromantic spells deal max damage',-140,100,-50,0,'HOMEBREW')
ON CONFLICT(sector_id) DO NOTHING;
-- All sectors are proposals and are not unlocked or visited.
