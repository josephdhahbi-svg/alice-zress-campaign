import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'package:moonveil_universe/engine/database_helper.dart';

void main() {
  sqfliteFfiInit();
  late DatabaseHelper helper;
  setUp(() {
    helper = DatabaseHelper(
      factory: databaseFactoryFfi,
      databasePath: inMemoryDatabasePath,
    );
  });
  tearDown(() async => helper.close());

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
}
