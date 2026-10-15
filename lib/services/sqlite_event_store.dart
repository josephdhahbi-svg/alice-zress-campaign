import 'dart:convert';
import 'package:sqflite/sqflite.dart';
import 'event_recovery_client.dart';

/// SQLite implementation: event and cursor update share one transaction.
/// Initialize with an opened sqflite Database; caller owns lifecycle.
class SqliteEventStore implements EventStore {
  SqliteEventStore(this.database);
  final Database database;

  static Future<void> migrate(Database db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS client_event_log (
        profile_id TEXT NOT NULL,
        sequence INTEGER NOT NULL,
        event_id TEXT NOT NULL,
        event_json TEXT NOT NULL,
        PRIMARY KEY(profile_id, sequence),
        UNIQUE(profile_id, event_id)
      )
    ''');
    await db.execute('''
      CREATE TABLE IF NOT EXISTS client_event_cursor (
        profile_id TEXT PRIMARY KEY,
        last_sequence INTEGER NOT NULL DEFAULT 0
      )
    ''');
  }

  @override
  Future<int> lastAppliedSequence(String profileId) async {
    final rows=await database.query('client_event_cursor',
      columns:['last_sequence'],where:'profile_id = ?',whereArgs:[profileId],limit:1);
    return rows.isEmpty ? 0 : rows.first['last_sequence'] as int;
  }

  @override
  Future<void> applyAtomically(String profileId,int sequence,String eventId,Map<String,dynamic> event) async {
    if (sequence < 1) throw ArgumentError.value(sequence,'sequence');
    await database.transaction((txn) async {
      final rows=await txn.query('client_event_cursor',columns:['last_sequence'],
        where:'profile_id = ?',whereArgs:[profileId],limit:1);
      final current=rows.isEmpty ? 0 : rows.first['last_sequence'] as int;
      if (sequence <= current) return;
      await txn.insert('client_event_log',{
        'profile_id':profileId,'sequence':sequence,
        'event_id':eventId,'event_json':jsonEncode(event)
      },conflictAlgorithm:ConflictAlgorithm.abort);
      await txn.insert('client_event_cursor',{
        'profile_id':profileId,'last_sequence':sequence
      },conflictAlgorithm:ConflictAlgorithm.replace);
    });
  }
}
