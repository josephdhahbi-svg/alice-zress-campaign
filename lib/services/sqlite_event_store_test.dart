import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';
import 'event_recovery_client.dart';
import 'sqlite_event_store.dart';

void main(){
 sqfliteFfiInit();
 databaseFactory=databaseFactoryFfi;
 late Database db;
 late SqliteEventStore store;
 setUp(() async {
   db=await databaseFactory.openDatabase(inMemoryDatabasePath);
   await SqliteEventStore.migrate(db);
   store=SqliteEventStore(db);
 });
 tearDown(() async => db.close());
 test('cursor starts at zero',() async {
   expect(await store.lastAppliedSequence('alice-zress'),0);
 });
 test('stores event and cursor atomically',() async {
   await store.applyAtomically('alice-zress',4,'EV_4',{'type':'QUEST_UPDATED'});
   expect(await store.lastAppliedSequence('alice-zress'),4);
   expect((await db.query('client_event_log')).length,1);
 });
 test('duplicate sequence is idempotent',() async {
   await store.applyAtomically('alice-zress',4,'EV_4',{});
   await store.applyAtomically('alice-zress',4,'EV_4',{});
   expect((await db.query('client_event_log')).length,1);
 });
 test('profiles are isolated',() async {
   await store.applyAtomically('alice-zress',4,'EV_4',{});
   expect(await store.lastAppliedSequence('another-player'),0);
 });
 test('duplicate event id rolls back cursor',() async {
   await store.applyAtomically('alice-zress',1,'EV_1',{});
   await expectLater(store.applyAtomically('alice-zress',2,'EV_1',{}),throwsA(isA<Exception>()));
   expect(await store.lastAppliedSequence('alice-zress'),1);
 });
 test('recovery client resumes after local save',() async {
   final client=EventRecoveryClient(store,'alice-zress');
   await client.receive(jsonEncode({'type':'SERVER_EVENT','sequence':8,'eventId':'EV_8','event':{'type':'QUEST_UPDATED'}}));
   expect(await client.resumeCursor(),8);
 });
}
