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

  Future<Database> get database async {
    if (_db != null && _db!.isOpen) return _db!;
    final location = _databasePath ??
        join(await _factory.getDatabasesPath(), 'moonveil_universe.db');
    _db = await _factory.openDatabase(location,
        options: OpenDatabaseOptions(version: 1, onCreate: (db, version) async {
      await db.execute('CREATE TABLE saves (slot INTEGER PRIMARY KEY, state_json TEXT NOT NULL)');
      await db.execute('CREATE TABLE events (id TEXT PRIMARY KEY, slot INTEGER NOT NULL, choice_id INTEGER NOT NULL, detail_json TEXT NOT NULL)');
    }));
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
