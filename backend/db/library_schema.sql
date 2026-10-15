PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS omni_content_libraries (
  library_id TEXT PRIMARY KEY,
  library_category TEXT NOT NULL,
  library_name TEXT NOT NULL,
  is_enabled INTEGER NOT NULL DEFAULT 1 CHECK(is_enabled IN (0,1)),
  description TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO omni_content_libraries(library_id,library_category,library_name,is_enabled,description)
VALUES
('lib_srd_weapons','ITEMS','SRD Standard Weapons & Armor',1,'Standard mundane equipment.'),
('lib_rare_magic_items','ITEMS','Rare & Legendary Magic Items',1,'High-tier magical gear; catalog only.'),
('lib_vecna_artifacts','ITEMS','Dark Artifacts & Vile Tome Library',1,'Forbidden items requiring cleansing; catalog only.'),
('lib_hybrid_classes','CHARACTER_OPTIONS','Triumvirate Hybrid Classes',1,'Custom hybrid classes; homebrew.')
ON CONFLICT(library_id) DO UPDATE SET
 library_category=excluded.library_category,library_name=excluded.library_name,
 description=excluded.description;
-- Library enabled does not mean a player owns any items.
