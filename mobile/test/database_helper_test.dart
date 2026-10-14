import 'dart:io';
import 'package:path/path.dart' as p;
import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

import 'package:moonveil_universe/engine/database_helper.dart';

void main() {
  sqfliteFfiInit();
  late DatabaseHelper helper;
  late Directory directory;
  setUp(() async {
    directory = await Directory.systemTemp.createTemp('moonveil_sqlite_test_');
    helper = DatabaseHelper(
      factory: databaseFactoryFfi,
      databasePath: p.join(directory.path, 'save.db'),
    );
  });
  tearDown(() async {
    await helper.close();
    await directory.delete(recursive: true);
  });

  test('new game is neutral with unassigned HP', () async {
    final state = await helper.load();
    expect(state['approval']['lyra_solaria'], 0);
    expect(state['player']['gold'], 0);
    expect(state['player']['hp'], isNull);
  });

  test('locked milestone cannot write an event or state', () async {
    await expectLater(helper.applyChoice(choiceId: 10), throwsStateError);
    final db = await helper.database;
    expect(await db.query('events'), isEmpty);
    expect(await db.query('saves'), isEmpty);
  });

  test('hidden covenant cannot be applied directly', () async {
    await expectLater(helper.applyChoice(choiceId: 11), throwsStateError);
    expect((await helper.load())['flags'], isEmpty);
  });

  test('invalid choice is rejected', () async {
    await expectLater(helper.applyChoice(choiceId: 999), throwsStateError);
    expect(await (await helper.database).query('events'), isEmpty);
  });

  test('valid choice is atomic and cannot farm approval', () async {
    expect(await helper.applyChoice(choiceId: 1), isTrue);
    expect(await helper.applyChoice(choiceId: 1), isFalse);
    final state = await helper.load();
    expect(state['approval']['lyra_solaria'], 5);
    expect(state['flags']['shared_vulnerability'], isTrue);
    expect((await (await helper.database).query('events')).length, 1);
  });

  test('saved state survives closing and reopening database', () async {
    expect(await helper.applyChoice(choiceId: 2), isTrue);
    await helper.close();
    final state = await helper.load();
    expect(state['approval']['lyra_solaria'], 2);
    expect(state['flags']['shared_laughter'], isTrue);
  });
  test('fresh v2 database preserves neutral baseline and creates projections', () async {
    final db = await helper.database;
    expect((await db.rawQuery('PRAGMA user_version')).first.values.first, 2);
    expect(await db.query('world_events'), isEmpty);
    expect(await db.query('persistent_flags'), isEmpty);
    expect((await helper.load())['player']['hp'], isNull);
  });

  test('new choice updates both ledgers and flags atomically', () async {
    expect(await helper.applyChoice(choiceId: 1), isTrue);
    final db = await helper.database;
    expect((await db.query('events')).length, 1);
    expect((await db.query('world_events')).length, 1);
    expect((await db.query('persistent_flags')).single['flag_value'], 'true');
    expect(await helper.applyChoice(choiceId: 1), isFalse);
    expect((await db.query('world_events')).length, 1);
  });

  test('world events reject updates and deletions', () async {
    await helper.applyChoice(choiceId: 1);
    final db = await helper.database;
    await expectLater(db.rawUpdate("UPDATE world_events SET scene_id = 'tampered'"),
        throwsA(isA<Exception>()));
    await expectLater(db.rawDelete('DELETE FROM world_events'),
        throwsA(isA<Exception>()));
    expect((await db.query('world_events')).length, 1);
  });

  test('migrates real v1 fixture without losing saved history', () async {
    final dbPath = p.join(directory.path, 'legacy.db');
    final legacy = await databaseFactoryFfi.openDatabase(dbPath,
        options: OpenDatabaseOptions(version: 1, onCreate: (db, version) async {
      await db.execute('CREATE TABLE saves (slot INTEGER PRIMARY KEY, state_json TEXT NOT NULL)');
      await db.execute('CREATE TABLE events (id TEXT PRIMARY KEY, slot INTEGER NOT NULL, choice_id INTEGER NOT NULL, detail_json TEXT NOT NULL)');
      await db.insert('saves', {
        'slot': 1,
        'state_json': '{"player":{"name":"Seralyth","gold":17,"hp":null},"approval":{"lyra_solaria":5},"flags":{"shared_vulnerability":true},"scene":"moonlight_tent"}',
      });
      await db.insert('events', {
        'id': 'moonlight_tent:1', 'slot': 1, 'choice_id': 1,
        'detail_json': '{"approvalDelta":5,"flag":"shared_vulnerability"}',
      });
    }));
    await legacy.close();
    final migrated = DatabaseHelper(
        factory: databaseFactoryFfi, databasePath: dbPath);
    try {
      final state = await migrated.load();
      expect(state['player']['gold'], 17);
      expect(state['player']['hp'], isNull);
      expect(state['approval']['lyra_solaria'], 5);
      final db = await migrated.database;
      expect((await db.query('events')).length, 1);
      final event = (await db.query('world_events')).single;
      expect(event['event_id'], 'moonlight_tent:1');
      expect(event['recorded_at'], isNull);
      expect((await db.query('persistent_flags')).single['flag_value'], 'true');
      expect(await migrated.applyChoice(choiceId: 1), isFalse);
      expect((await db.query('world_events')).length, 1);
    } finally {
      await migrated.close();
    }
  });

}
