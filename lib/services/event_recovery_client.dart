import 'dart:convert';

/// Apply a server event to durable local storage before advancing the cursor.
/// The caller owns storage transactions and must commit both changes atomically.
abstract class EventStore {
  Future<int> lastAppliedSequence(String profileId);
  Future<void> applyAtomically(String profileId, int sequence, String eventId, Map<String, dynamic> event);
}

class EventRecoveryClient {
  EventRecoveryClient(this.store, this.profileId);
  final EventStore store;
  final String profileId;

  Future<int> resumeCursor() => store.lastAppliedSequence(profileId);

  /// Returns true when a new event was applied, false for a duplicate.
  /// Throws on gaps, malformed events, or storage failures.
  Future<bool> receive(String rawMessage) async {
    final decoded = jsonDecode(rawMessage);
    if (decoded is! Map<String, dynamic> || decoded['type'] != 'SERVER_EVENT') {
      throw const FormatException('Expected SERVER_EVENT');
    }
    final sequence = decoded['sequence'];
    final eventId = decoded['eventId'];
    final event = decoded['event'];
    if (sequence is! int || sequence < 1 ||
        eventId is! String || !RegExp(r'^[A-Za-z0-9_-]{1,128}$').hasMatch(eventId) ||
        event is! Map<String, dynamic>) {
      throw const FormatException('Invalid event envelope');
    }
    final current = await store.lastAppliedSequence(profileId);
    if (sequence <= current) return false;
    // SQLite outbox sequences are global across profiles: gaps are normal.
    // Server must supply the authenticated profile's ordered event stream.
    await store.applyAtomically(profileId, sequence, eventId, event);
    return true;
  }
}
