import 'package:flutter/material.dart';

enum CodexStatus { unknown, discovered, secured, owned, equipped, purified }

enum Essence { farRealm, undead, light, magic, fiend }

extension EssenceVisual on Essence {
  Color get color => switch (this) {
    Essence.farRealm => const Color(0xFF8B5CF6),
    Essence.undead => const Color(0xFF22C55E),
    Essence.light => Colors.white,
    Essence.magic => const Color(0xFF3B82F6),
    Essence.fiend => const Color(0xFF9E9E9E), // Color undecided.
  };
  String get label => switch (this) {
    Essence.farRealm => 'Far Realm',
    Essence.undead => 'Undead',
    Essence.light => 'Light',
    Essence.magic => 'Magic',
    Essence.fiend => 'Fiend',
  };
}

class CodexItem {
  const CodexItem({
    required this.id,
    required this.name,
    required this.rarity,
    required this.description,
    required this.essence,
    required this.status,
    required this.source,
    this.imageUrl,
    this.questId,
  });

  final String id;
  final String name;
  final String rarity;
  final String description;
  final Essence essence;
  final CodexStatus status;
  final String source;
  final String? imageUrl;
  final String? questId;

  bool get canUse => status == CodexStatus.owned ||
      status == CodexStatus.equipped ||
      status == CodexStatus.purified;
}

/// Preview data only; NOT an inventory grant or saved game state.
const sampleCodex = <CodexItem>[
  CodexItem(id: 'vecna_book', name: 'Book of Vile Darkness',
    rarity: 'Artifact', description: 'A dangerous tome sought in Vecna\'s ritual. Quest locked.',
    essence: Essence.undead, status: CodexStatus.unknown,
    source: 'Published D&D artifact; custom campaign quest', questId: 'vecna_m5'),
  CodexItem(id: 'vecna_hand', name: 'Hand of Vecna',
    rarity: 'Artifact', description: 'A necromantic relic. Not acquired or attached.',
    essence: Essence.undead, status: CodexStatus.unknown,
    source: 'Published D&D artifact; custom campaign quest', questId: 'vecna_m6'),
  CodexItem(id: 'vecna_eye', name: 'Eye of Vecna',
    rarity: 'Artifact', description: 'A relic of hidden sight. Not acquired or implanted.',
    essence: Essence.farRealm, status: CodexStatus.unknown,
    source: 'Published D&D artifact; custom campaign quest', questId: 'vecna_m7'),
  CodexItem(id: 'threefold_visage', name: 'Visage of the Dark Maiden',
    rarity: 'Legendary Divine Boon (homebrew)',
    description: 'Level 21 Path of Balance: Undead, Light, and Far Realm. Not earned.',
    essence: Essence.light, status: CodexStatus.unknown,
    source: 'Moonveil homebrew', questId: 'threefold_l21'),
];
