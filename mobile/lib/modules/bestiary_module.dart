import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';

enum MonsterEnvironment { underdarkCaverns, ravenloftMists, spelljammerWildspace, infernalAvernus }

class BestiaryEntry {
  final String monsterId, name, typeCategory, primaryWeakness, tacticalLoot;
  final double challengeRating;
  final MonsterEnvironment environment;
  const BestiaryEntry({
    required this.monsterId, required this.name, required this.typeCategory,
    required this.challengeRating, required this.environment,
    required this.primaryWeakness, required this.tacticalLoot,
  });

  // Original campaign variants. Weaknesses and loot are homebrew.
  static const masterBestiary = <BestiaryEntry>[
    BestiaryEntry(monsterId:'mst_drider', name:'Drider Fanatic',
      typeCategory:'Monstrosity (Drow)', challengeRating:6,
      environment:MonsterEnvironment.underdarkCaverns,
      primaryWeakness:'Radiant / Moonlight (homebrew)',
      tacticalLoot:'Phase-Spider Venom & Drow Poison Gland'),
    BestiaryEntry(monsterId:'mst_hook_horror', name:'Underdark Hook Horror',
      typeCategory:'Monstrosity', challengeRating:3,
      environment:MonsterEnvironment.underdarkCaverns,
      primaryWeakness:'Sonic / Thunder (homebrew)',
      tacticalLoot:'Hooked Scythe Carapace'),
    BestiaryEntry(monsterId:'mst_strahd_zombie', name:'Strahd-Corrupted Zombie',
      typeCategory:'Undead', challengeRating:1,
      environment:MonsterEnvironment.ravenloftMists,
      primaryWeakness:'Radiant (homebrew)',
      tacticalLoot:'Tarnished Barovian Coinage'),
    BestiaryEntry(monsterId:'mst_abyssal_slime', name:'Ghaunadaur Primordial Ooze',
      typeCategory:'Aberration', challengeRating:9,
      environment:MonsterEnvironment.underdarkCaverns,
      primaryWeakness:'Force (homebrew)',
      tacticalLoot:'Abyssal Ooze Vial'),
  ];
}

/// Call from the main DatabaseHelper migration, in its existing transaction.
/// Does not independently modify database version or open another database.
class BestiaryDatabaseMigration {
  static Future<void> applyMigration(DatabaseExecutor db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS mythic_bestiary_codex (
        monster_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type_category TEXT NOT NULL,
        challenge_rating REAL NOT NULL CHECK(challenge_rating >= 0),
        environment TEXT NOT NULL,
        primary_weakness TEXT NOT NULL,
        tactical_loot TEXT NOT NULL
      )
    ''');
    await db.execute('''
      CREATE TABLE IF NOT EXISTS bestiary_discoveries (
        slot INTEGER NOT NULL,
        monster_id TEXT NOT NULL,
        discovered_at TEXT,
        PRIMARY KEY(slot, monster_id),
        FOREIGN KEY(monster_id) REFERENCES mythic_bestiary_codex(monster_id)
      )
    ''');
    for (final e in BestiaryEntry.masterBestiary) {
      await db.insert('mythic_bestiary_codex', {
        'monster_id':e.monsterId, 'name':e.name, 'type_category':e.typeCategory,
        'challenge_rating':e.challengeRating, 'environment':e.environment.name,
        'primary_weakness':e.primaryWeakness, 'tactical_loot':e.tacticalLoot,
      }, conflictAlgorithm:ConflictAlgorithm.ignore);
    }
  }

  static Future<List<Map<String, Object?>>> recordsForSlot(
      Database db, int slot) {
    return db.rawQuery('''
      SELECT b.*, CASE WHEN d.monster_id IS NULL THEN 0 ELSE 1 END AS is_discovered
      FROM mythic_bestiary_codex b
      LEFT JOIN bestiary_discoveries d
        ON b.monster_id = d.monster_id AND d.slot = ?
      ORDER BY b.name
    ''', [slot]);
  }

  static Future<void> discover(Database db, int slot, String monsterId) async {
    await db.insert('bestiary_discoveries', {
      'slot':slot, 'monster_id':monsterId,
      'discovered_at':DateTime.now().toUtc().toIso8601String(),
    }, conflictAlgorithm:ConflictAlgorithm.ignore);
  }
}

class BestiaryHubModal extends StatelessWidget {
  final List<Map<String, dynamic>> bestiaryRecords;
  final ValueChanged<String> onInspectMonster;
  final VoidCallback? onClose;

  const BestiaryHubModal({
    super.key, required this.bestiaryRecords,
    required this.onInspectMonster, this.onClose,
  });

  @override
  Widget build(BuildContext context) {
    const gold = Color(0xFFD4AF37), crimson = Color(0xFF8C1D23);
    return SafeArea(
      top:false,
      child:Container(
        height:MediaQuery.sizeOf(context).height * 0.85,
        padding:const EdgeInsets.all(20),
        decoration:const BoxDecoration(
          color:Color(0xFF14131A),
          borderRadius:BorderRadius.vertical(top:Radius.circular(12)),
          border:Border(top:BorderSide(color:crimson,width:2)),
        ),
        child:Column(crossAxisAlignment:CrossAxisAlignment.stretch,children:[
          Row(children:[
            const Icon(Icons.menu_book,color:gold),
            const SizedBox(width:8),
            const Expanded(child:Text('MYTHIC BESTIARY & ENCOUNTER CODEX',
              style:TextStyle(color:gold,fontWeight:FontWeight.bold,fontSize:13))),
            IconButton(
              tooltip:'Close bestiary',
              onPressed:onClose ?? () => Navigator.of(context).maybePop(),
              icon:const Icon(Icons.close,color:Colors.white70)),
          ]),
          const Divider(color:crimson),
          const Text('Discovered creatures, tactical notes, and loot.',
            style:TextStyle(color:Colors.white70,fontSize:12)),
          const SizedBox(height:12),
          Expanded(child:bestiaryRecords.isEmpty
            ? const Center(child:Text('No bestiary records synchronized.',
                style:TextStyle(color:Colors.white54)))
            : ListView.builder(
              itemCount:bestiaryRecords.length,
              itemBuilder:(context,index) {
                final mob=bestiaryRecords[index];
                final discovered=mob['is_discovered']==1 || mob['is_discovered']==true;
                final id=(mob['monster_id'] ?? '').toString();
                return Card(
                  color:const Color(0xFF1C1B24),
                  child:ListTile(
                    enabled:discovered && id.isNotEmpty,
                    onTap:discovered && id.isNotEmpty
                      ? () => onInspectMonster(id) : null,
                    title:Text(discovered
                        ? (mob['name'] ?? 'Unknown Entity').toString()
                        : '??? [UNDISCOVERED]',
                      style:TextStyle(color:discovered?Colors.white:Colors.white54)),
                    subtitle:discovered
                      ? Text("Type: ${mob['type_category']}\nWeakness: ${mob['primary_weakness']}\nLoot: ${mob['tactical_loot']}",
                          style:const TextStyle(color:Colors.white70))
                      : const Text('Discover to unlock details.',
                          style:TextStyle(color:Colors.white54)),
                    trailing:discovered
                      ? Text("CR ${mob['challenge_rating']}",
                          style:const TextStyle(color:gold))
                      : const Icon(Icons.lock,color:Colors.white54),
                  ),
                );
              },
            )),
        ]),
      ),
    );
  }
}
