import 'dart:convert';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  DatabaseHelper._();
  static final instance = DatabaseHelper._();
  Database? _db;

  Future<Database> get database async {
    if (_db != null && _db!.isOpen) return _db!;
    final location = join(await getDatabasesPath(), 'moonveil_universe.db');
    _db = await openDatabase(location, version: 1, onCreate: (db, version) async {
      await db.execute('CREATE TABLE saves (slot INTEGER PRIMARY KEY, state_json TEXT NOT NULL)');
      await db.execute('CREATE TABLE events (id TEXT PRIMARY KEY, slot INTEGER NOT NULL, choice_id INTEGER NOT NULL, detail_json TEXT NOT NULL)');
    });
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
    return rows.isEmpty ? freshState() : Map<String, dynamic>.from(jsonDecode(rows.first['state_json'] as String));
  }

  Future<bool> applyChoice({required String eventId, required int choiceId,
    required int approvalDelta, required String flag}) async {
    final db = await database;
    return db.transaction((txn) async {
      if ((await txn.query('events', where: 'id = ?', whereArgs: [eventId])).isNotEmpty) return false;
      final rows = await txn.query('saves', where: 'slot = ?', whereArgs: [1]);
      final state = rows.isEmpty ? freshState() : Map<String, dynamic>.from(jsonDecode(rows.first['state_json'] as String));
      final approval = Map<String, dynamic>.from(state['approval'] as Map);
      final flags = Map<String, dynamic>.from(state['flags'] as Map);
      final previous = (approval['lyra_solaria'] as num).toInt();
      approval['lyra_solaria'] = (previous + approvalDelta).clamp(-50, 50);
      flags[flag] = true;
      state['approval'] = approval;
      state['flags'] = flags;
      await txn.insert('events', {'id': eventId, 'slot': 1, 'choice_id': choiceId,
        'detail_json': jsonEncode({'approvalDelta': approvalDelta, 'flag': flag})});
      await txn.insert('saves', {'slot': 1, 'state_json': jsonEncode(state)},
        conflictAlgorithm: ConflictAlgorithm.replace);
      return true;
    });
  }
}
