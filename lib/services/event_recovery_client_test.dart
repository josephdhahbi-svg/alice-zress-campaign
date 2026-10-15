import 'dart:convert';
import 'package:test/test.dart';
import 'event_recovery_client.dart';

class MemoryStore implements EventStore {
  int cursor = 0;
  final events = <String>[];
  bool fail = false;
  @override Future<int> lastAppliedSequence(String profileId) async => cursor;
  @override Future<void> applyAtomically(String profileId, int sequence, String eventId, Map<String, dynamic> event) async {
    if (fail) throw StateError('disk failure');
    events.add(eventId);
    cursor = sequence;
  }
}
String envelope(int seq) => jsonEncode({'type':'SERVER_EVENT','sequence':seq,'eventId':'EV_$seq','event':{'type':'QUEST_UPDATED'}});
void main() {
 test('applies and advances cursor', () async {
   final store=MemoryStore(), client=EventRecoveryClient(store,'alice-zress');
   expect(await client.receive(envelope(1)),isTrue);
   expect(await client.resumeCursor(),1);
 });
 test('ignores duplicate replay', () async {
   final store=MemoryStore(), client=EventRecoveryClient(store,'alice-zress');
   await client.receive(envelope(1));
   expect(await client.receive(envelope(1)),isFalse);
   expect(store.events.length,1);
 });
 test('failed storage leaves cursor unchanged', () async {
   final store=MemoryStore()..fail=true;
   final client=EventRecoveryClient(store,'alice-zress');
   await expectLater(client.receive(envelope(1)),throwsStateError);
   expect(await client.resumeCursor(),0);
 });
 test('accepts global sequence gaps', () async {
   final store=MemoryStore(), client=EventRecoveryClient(store,'alice-zress');
   expect(await client.receive(envelope(7)),isTrue);
   expect(await client.resumeCursor(),7);
 });
 test('rejects client-originated message types', () async {
   final client=EventRecoveryClient(MemoryStore(),'alice-zress');
   await expectLater(client.receive('{"type":"LEVEL_UP"}'),throwsFormatException);
 });
 test('rejects invalid event id', () async {
   final client=EventRecoveryClient(MemoryStore(),'alice-zress');
   await expectLater(client.receive('{"type":"SERVER_EVENT","sequence":1,"eventId":"!","event":{}}'),throwsFormatException);
 });
}
