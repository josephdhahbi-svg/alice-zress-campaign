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

  static Future<void> _upgrade(Database db, int oldVersion, int newVersion) async {
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
  }

  Future<Database> get database async {
    if (_db != null && _db!.isOpen) return _db!;
    final location = _databasePath ??
        join(await _factory.getDatabasesPath(), 'moonveil_universe.db');
    _db = await _factory.openDatabase(location,
        options: OpenDatabaseOptions(version: 2,
            onCreate: (db, version) => _createV2(db),
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
