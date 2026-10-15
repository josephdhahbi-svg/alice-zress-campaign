import 'package:flutter/material.dart';
import '../models/codex_item.dart';
import '../services/dice_roller.dart';

/// Standalone MVP. Replace preview [items] with validated backend state later.
class VisualCommandCenter extends StatefulWidget {
  const VisualCommandCenter({super.key, this.items = sampleCodex});
  final List<CodexItem> items;

  @override
  State<VisualCommandCenter> createState() => _VisualCommandCenterState();
}

class _VisualCommandCenterState extends State<VisualCommandCenter> {
  final DiceRoller _roller = DiceRoller();
  DiceResult? _lastRoll;

  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: const Color(0xFF0C0916),
    appBar: AppBar(
      title: const Text('Moonveil Visual Codex'),
      backgroundColor: const Color(0xFF271147),
      foregroundColor: Colors.white,
    ),
    body: LayoutBuilder(builder: (context, constraints) {
      final columns = constraints.maxWidth >= 800 ? 4 : constraints.maxWidth >= 520 ? 3 : 2;
      return GridView.builder(
        padding: const EdgeInsets.all(12),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: columns, crossAxisSpacing: 12, mainAxisSpacing: 12,
          childAspectRatio: 0.75,
        ),
        itemCount: widget.items.length,
        itemBuilder: (context, index) {
          final item = widget.items[index];
          return Semantics(
            button: true,
            label: '${item.name}, ${item.rarity}, ${item.status.name}',
            child: InkWell(
              borderRadius: BorderRadius.circular(14),
              onTap: () => _inspect(item),
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF211B30),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: item.essence.color, width: 1.5),
                ),
                child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                  Expanded(child: ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                    child: item.imageUrl == null
                      ? _imageFallback(item)
                      : Image.network(item.imageUrl!, fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => _imageFallback(item)),
                  )),
                  Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(item.name, maxLines: 2, overflow: TextOverflow.ellipsis,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${item.rarity} · ${item.status.name}',
                        style: const TextStyle(color: Color(0xFFCAC1E1), fontSize: 11)),
                    ]),
                  ),
                ]),
              ),
            ),
          );
        },
      );
    }),
  );

  Widget _imageFallback(CodexItem item) => ColoredBox(
    color: const Color(0xFF140E23),
    child: Center(child: Icon(
      item.canUse ? Icons.auto_awesome : Icons.lock_outline,
      color: item.essence.color, size: 54,
    )),
  );

  void _inspect(CodexItem item) {
    setState(() => _lastRoll = null);
    showModalBottomSheet<void>(
      context: context, isScrollControlled: true,
      backgroundColor: const Color(0xFF211B30),
      builder: (sheetContext) => StatefulBuilder(builder: (sheetContext, refresh) =>
        SafeArea(child: Padding(
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(item.name, style: const TextStyle(color: Colors.white,
                fontSize: 22, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Text('${item.rarity} · ${item.essence.label} · ${item.status.name}',
                style: TextStyle(color: item.essence.color)),
              const SizedBox(height: 12),
              Text(item.description, style: const TextStyle(color: Colors.white)),
              const SizedBox(height: 8),
              Text('Source: ${item.source}', style: const TextStyle(color: Colors.white70)),
              if (item.questId != null)
                Text('Quest gate: ${item.questId}', style: const TextStyle(color: Colors.white70)),
              const SizedBox(height: 18),
              const Text('D20 CHECK (local roll only)',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              if (_lastRoll != null)
                Text('D20: ${_lastRoll!.face}  +  ${_lastRoll!.modifier}  =  ${_lastRoll!.total}',
                  style: const TextStyle(color: Colors.white, fontSize: 20)),
              const SizedBox(height: 12),
              FilledButton.icon(
                onPressed: () => refresh(() => _lastRoll = _roller.rollD20()),
                icon: const Icon(Icons.casino),
                label: const Text('Roll D20'),
              ),
              const Text('No AI-DM request sent. No item granted.',
                style: TextStyle(color: Colors.white60, fontSize: 12)),
            ],
          )),
        )),
      ),
    );
  }
}
