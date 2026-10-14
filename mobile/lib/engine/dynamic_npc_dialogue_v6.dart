import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:sqflite/sqflite.dart';

/// Candidate V6 module for the verified repository.
///
/// The live database is currently version 5. This module deliberately uses
/// V6 rather than the speculative V35-V220 numbering found in design archives.
///
/// It provides a deterministic NPC dialogue request/response queue. No LLM
/// SDK or network dependency is required, so the game remains offline-safe.
class DynamicNpcDialogueMigration {
  static const schemaVersion = 6;

  static Future<void> apply(DatabaseExecutor db) async {
    await db.execute('''
      CREATE TABLE IF NOT EXISTS npc_dialogue_requests (
        request_id TEXT PRIMARY KEY,
        slot INTEGER NOT NULL,
        npc_id TEXT NOT NULL,
        scene_id TEXT NOT NULL,
        player_text TEXT NOT NULL,
        context_json TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
          CHECK(status IN ('pending','processing','completed','failed','cancelled')),
        created_at TEXT NOT NULL,
        completed_at TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE IF NOT EXISTS npc_dialogue_responses (
        response_id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL UNIQUE,
        npc_text TEXT NOT NULL,
        metadata_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(request_id) REFERENCES npc_dialogue_requests(request_id)
      )
    ''');

    await db.execute('''
      CREATE INDEX IF NOT EXISTS idx_npc_dialogue_requests_slot_status
      ON npc_dialogue_requests(slot, status, created_at)
    ''');
  }
}

class NpcDialoguePacket {
  const NpcDialoguePacket({
    required this.requestId,
    required this.slot,
    required this.npcId,
    required this.sceneId,
    required this.playerText,
    required this.context,
  });

  final String requestId;
  final int slot;
  final String npcId;
  final String sceneId;
  final String playerText;
  final Map<String, dynamic> context;

  Map<String, dynamic> toJson() => {
        'requestId': requestId,
        'slot': slot,
        'npcId': npcId,
        'sceneId': sceneId,
        'playerText': playerText,
        'context': context,
      };
}

/// Storage boundary for a future LLM connector.
///
/// The connector must receive only curated context assembled by trusted game
/// code. Model output is stored as dialogue text/metadata and never executed
/// as SQL, Dart, migration code, or authoritative world-state mutations.
class DynamicNpcDialogueStore {
  const DynamicNpcDialogueStore(this.db);

  final Database db;

  Future<void> enqueue(NpcDialoguePacket packet) async {
    if (packet.playerText.trim().isEmpty) {
      throw ArgumentError.value(packet.playerText, 'playerText', 'must not be empty');
    }
    await db.insert(
      'npc_dialogue_requests',
      {
        'request_id': packet.requestId,
        'slot': packet.slot,
        'npc_id': packet.npcId,
        'scene_id': packet.sceneId,
        'player_text': packet.playerText.trim(),
        'context_json': jsonEncode(packet.context),
        'status': 'pending',
        'created_at': DateTime.now().toUtc().toIso8601String(),
      },
      conflictAlgorithm: ConflictAlgorithm.abort,
    );
  }

  Future<List<Map<String, dynamic>>> pending({required int slot, int limit = 20}) {
    return db.query(
      'npc_dialogue_requests',
      where: 'slot = ? AND status = ?',
      whereArgs: [slot, 'pending'],
      orderBy: 'created_at ASC',
      limit: limit.clamp(1, 100),
    );
  }

  Future<void> complete({
    required String requestId,
    required String responseId,
    required String npcText,
    Map<String, dynamic> metadata = const {},
  }) async {
    if (npcText.trim().isEmpty) {
      throw ArgumentError.value(npcText, 'npcText', 'must not be empty');
    }
    await db.transaction((txn) async {
      final request = await txn.query(
        'npc_dialogue_requests',
        columns: ['status'],
        where: 'request_id = ?',
        whereArgs: [requestId],
        limit: 1,
      );
      if (request.isEmpty) throw StateError('Unknown dialogue request: $requestId');
      if (request.single['status'] == 'completed') return;

      final now = DateTime.now().toUtc().toIso8601String();
      await txn.insert(
        'npc_dialogue_responses',
        {
          'response_id': responseId,
          'request_id': requestId,
          'npc_text': npcText.trim(),
          'metadata_json': jsonEncode(metadata),
          'created_at': now,
        },
        conflictAlgorithm: ConflictAlgorithm.abort,
      );
      await txn.update(
        'npc_dialogue_requests',
        {'status': 'completed', 'completed_at': now},
        where: 'request_id = ?',
        whereArgs: [requestId],
      );
    });
  }
}

class DynamicNpcDialogueHud extends StatelessWidget {
  const DynamicNpcDialogueHud({
    super.key,
    required this.npcName,
    required this.messages,
    required this.onSubmit,
  });

  final String npcName;
  final List<String> messages;
  final ValueChanged<String> onSubmit;

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController();
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(npcName, style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            Expanded(
              child: ListView.separated(
                itemCount: messages.length,
                separatorBuilder: (_, __) => const SizedBox(height: 8),
                itemBuilder: (_, i) => Card(
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Text(messages[i]),
                  ),
                ),
              ),
            ),
            TextField(
              controller: controller,
              maxLength: 500,
              decoration: const InputDecoration(
                labelText: 'Speak',
                border: OutlineInputBorder(),
              ),
              onSubmitted: (value) {
                final text = value.trim();
                if (text.isEmpty) return;
                onSubmit(text);
                controller.clear();
              },
            ),
          ],
        ),
      ),
    );
  }
}
