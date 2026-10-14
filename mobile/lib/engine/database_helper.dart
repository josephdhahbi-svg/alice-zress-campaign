import 'dart:convert';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

/// Validated, single-scene prototype. Never trust approval or flags from UI.
class DatabaseHelper {
  DatabaseHelper({DatabaseFactory? factory, String? databasePath})
      : _factory = factory ?? databaseFactory,
        _databasePath = databasePath;
  static final instance = DatabaseHelper();
  final DatabaseFactory _factory;
  final String? _databasePath;
  Database? _db;

  static const choices = <int, ({int approval, String flag})>{
    1: (approval: 5, flag: 'shared_vulnerability'),
    2: (approval: 2, flag: 'shared_laughter'),
    3: (approval: 3, flag: 'accepted_help'),
    4: (approval: 1, flag: 'hospice_lead'),
    5: (approval: 2, flag: 'conduit_clue'),
    6: (approval: 3, flag: 'listened_to_lyra'),
    7: (approval: 2, flag: 'shared_watch'),
    8: (approval: 1, flag: 'discussed_faith'),
    9: (approval: 0, flag: 'boundary_respected'),
    10: (approval: 3, flag: 'vow_spoken'),
    11: (approval: 0, flag: 'sun_moon_covenant'),
  };

  static bool isAllowed(int id, Map<String, dynamic> state) {
    if (!choices.containsKey(id) || state['scene'] != 'moonlight_tent') return false;
    final approval = (state['approval'] as Map?)?['lyra_solaria'];
    final flags = state['flags'] as Map?;
    if (approval is! num || flags == null) return false;
    if (id == 10) {
      return approval >= 40 && flags['shared_vulnerability'] == true;
    }
    if (id == 11) {
      return approval >= 40 && flags['vow_spoken'] == true &&
          flags['sanctuary_restored'] == true &&
          flags['mutual_covenant_ready'] == true;
    }
    return true;
  }

  static Future<void> _createV1(DatabaseExecutor db) async {
    await db.execute('CREATE TABLE IF NOT EXISTS saves (slot INTEGER PRIMARY KEY, state_json TEXT NOT NULL)');
    await db.execute('CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, slot INTEGER NOT NULL, choice_id INTEGER NOT NULL, detail_json TEXT NOT NULL)');
  }

  static Future<void> _createV2(DatabaseExecutor db) async {
    await _createV1(db);
    // New tables are additive projections; legacy saves remain authoritative.
    await db.execute('CREATE TABLE IF NOT EXISTS world_events (event_id TEXT PRIMARY KEY, slot INTEGER NOT NULL, scene_id TEXT NOT NULL, choice_id INTEGER NOT NULL, detail_json TEXT NOT NULL, recorded_at TEXT)');
    await db.execute('CREATE TABLE IF NOT EXISTS persistent_flags (slot INTEGER NOT NULL, flag_key TEXT NOT NULL, flag_value TEXT NOT NULL, PRIMARY KEY (slot, flag_key))');
    await db.execute("CREATE TRIGGER IF NOT EXISTS world_events_no_update BEFORE UPDATE ON world_events BEGIN SELECT RAISE(ABORT, 'world events are immutable'); END");
    await db.execute("CREATE TRIGGER IF NOT EXISTS world_events_no_delete BEFORE DELETE ON world_events BEGIN SELECT RAISE(ABORT, 'world events are immutable'); END");
  }


  // V30 reference catalog. Campaign-dependent relationships are initial defaults.
  static Future<void> _createV5(DatabaseExecutor db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS canon_factions (
        faction_id TEXT PRIMARY KEY,
        faction_name TEXT NOT NULL,
        canonical_alignment TEXT NOT NULL,
        primary_deity TEXT NOT NULL,
        influence_score INTEGER NOT NULL DEFAULT 50 CHECK(influence_score BETWEEN 0 AND 100),
        hostility_status TEXT NOT NULL DEFAULT 'Neutral'
      )
    ''');
    await db.execute('''
      CREATE TABLE IF NOT EXISTS canon_locations (
        location_id TEXT PRIMARY KEY,
        location_name TEXT NOT NULL,
        region_type TEXT NOT NULL,
        controlling_faction_id TEXT,
        danger_level REAL NOT NULL,
        is_discovered INTEGER NOT NULL DEFAULT 0 CHECK(is_discovered IN (0, 1)),
        FOREIGN KEY (controlling_faction_id) REFERENCES canon_factions(faction_id)
      )
    ''');
    const factions = <List<Object?>>[
      ['house_baenre', 'House Baenre of Menzoberranzan', 'Chaotic Evil', 'Lolth', 95, 'Hostile'],
      ['promenade_eilistraee', 'The Dark Maiden Concordat', 'Chaotic Good', 'Eilistraee', 40, 'Allied'],
      ['chosen_ghaunadaur', 'The Ooze-Bound Covenant', 'Chaotic Evil', 'Ghaunadaur', 60, 'Hostile'],
      ['underdark_merchants', 'Deep Realm Trade Syndicate', 'True Neutral', 'None', 70, 'Neutral'],
      ['harpers_underground', 'The Harpers (Underdark Cell)', 'Neutral Good', 'Mielikki / Mystra', 50, 'Allied'],
    ];
    for (final row in factions) {
      await db.rawInsert('INSERT OR IGNORE INTO canon_factions (faction_id, faction_name, canonical_alignment, primary_deity, influence_score, hostility_status) VALUES (?, ?, ?, ?, ?, ?)', row);
    }
    const locations = <List<Object?>>[
      ['menzoberranzan', 'Menzoberranzan (City of Spiders)', 'Underdark City', 'house_baenre', 22.0, 1],
      ['promenade_grove', 'Promenade of the Dark Maiden', 'Underdark Sanctuary', 'promenade_eilistraee', 12.0, 1],
      ['ghaunadaur_spire', 'Abyssal Spore-Spire', 'Far Realm Sanctum', 'chosen_ghaunadaur', 24.0, 0],
      ['blingdenstone', 'Blingdenstone (Svirfneblin Enclave)', 'Underdark City', 'underdark_merchants', 10.0, 0],
      ['undermountain', "Halaster's Undermountain (Level 23)", 'Dungeon Labyrinth', null, 26.0, 0],
    ];
    for (final row in locations) {
      await db.rawInsert('INSERT OR IGNORE INTO canon_locations (location_id, location_name, region_type, controlling_faction_id, danger_level, is_discovered) VALUES (?, ?, ?, ?, ?, ?)', row);
    }
  }

  static Future<void> _upgrade(Database db: int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await _createV2(db);
      // Preserve every legacy event, including its original ID and payload.
      // A legacy timestamp was never recorded: do not invent one.
      final oldEvents = await db.query('events');
      for (final event in oldEvents) {
        final id = event['id'] as String;
        final choiceId = event['choice_id'] as int;
        final suffix = ':$choiceId';
        final sceneId = id.endsWith(suffix)
            ? id.substring(0, id.length - suffix.length)
            : 'legacy_unknown';
        await db.insert('world_events', {
          'event_id': id,
          'slot': event['slot'],
          'scene_id': sceneId,
          'choice_id': choiceId,
          'detail_json': event['detail_json'],
          'recorded_at': null,
        }, conflictAlgorithm: ConflictAlgorithm.abort);
      }
      // Existing flags remain in saves.state_json. This table is a
      // forward-looking index, never a substitute for the snapshot.
      final saves = await db.query('saves');
      for (final save in saves) {
        final slot = save['slot'] as int;
        final state = jsonDecode(save['state_json'] as String);
        if (state is Map && state['flags'] is Map) {
          for (final entry in (state['flags'] as Map).entries) {
            await db.insert('persistent_flags', {
              'slot': slot,
              'flag_key': entry.key.toString(),
              'flag_value': jsonEncode(entry.value),
            }, conflictAlgorithm: ConflictAlgorithm.abort);
          }
        }
      }
    }
    if (oldVersion < 5) await _createV5(db);
  }

  Future<Database> get database async {
    if (_db != null && _db!.isOpen) return _db!;
    final location = _databasePath ??
        join(await _factory.getDatabasesPath(), 'moonveil_universe.db');
    _db = await _factory.openDatabase(location,
        options: OpenDatabaseOptions(version: 5,
            onCreate: (db, version) async { await _createV2(db); await _createV5(db); },
            onUpgrade: _upgrade));
    return _db!;
  }

  Map<String, dynamic> freshState() => {
    'player': {'name': 'Seralyth', 'gold': 0, 'hp': null},
    'approval': {'lyra_solaria': 0},
    'flags': <String, dynamic>{},
    'scene': 'moonlight_tent',
  };

  Future<Map<String, dynamic>> load() async {
    final db = await database;
    final rows = await db.query('saves', where: 'slot = ?', whereArgs: [1]);
    return rows.isEmpty ? freshState() :
        Map<String, dynamic>.from(jsonDecode(rows.first['state_json'] as String));
  }

  /// Returns false for repeated actions; throws StateError for invalid actions.
  /// Approval deltas and rewards are defined here, never accepted from callers.
  Future<bool> applyChoice({required int choiceId}) async {
    final db = await database;
    return db.transaction((txn) async {
      final rows = await txn.query('saves', where: 'slot = ?', whereArgs: [1]);
      final state = rows.isEmpty ? freshState() :
          Map<String, dynamic>.from(jsonDecode(rows.first['state_json'] as String));
      if (!isAllowed(choiceId, state)) {
        throw StateError('Choice is locked or invalid for this scene');
      }
      final eventId = '${state['scene']}:$choiceId';
      if ((await txn.query('events', where: 'id = ?', whereArgs: [eventId])).isNotEmpty) {
        return false;
      }
      final choice = choices[choiceId]!;
      final approval = Map<String, dynamic>.from(state['approval'] as Map);
      final flags = Map<String, dynamic>.from(state['flags'] as Map);
      final previous = (approval['lyra_solaria'] as num).toInt();
      approval['lyra_solaria'] = (previous + choice.approval).clamp(-50, 50);
      flags[choice.flag] = true;
      state['approval'] = approval;
      state['flags'] = flags;
      await txn.insert('events', {
        'id': eventId, 'slot': 1, 'choice_id': choiceId,
        'detail_json': jsonEncode({'approvalDelta': choice.approval, 'flag': choice.flag})
      });
      await txn.insert('world_events', {
        'event_id': eventId, 'slot': 1, 'scene_id': state['scene'],
        'choice_id': choiceId,
        'detail_json': jsonEncode({'approvalDelta': choice.approval, 'flag': choice.flag}),
        'recorded_at': DateTime.now().toUtc().toIso8601String(),
      }, conflictAlgorithm: ConflictAlgorithm.abort);
      await txn.insert('persistent_flags', {
        'slot': 1, 'flag_key': choice.flag, 'flag_value': jsonEncode(true),
      }, conflictAlgorithm: ConflictAlgorithm.replace);
      await txn.insert('saves', {'slot': 1, 'state_json': jsonEncode(state)},
          conflictAlgorithm: ConflictAlgorithm.replace);
      return true;
    });
  }

  Future<void> close() async {
    await _db?.close();
    _db = null;
  }
}
