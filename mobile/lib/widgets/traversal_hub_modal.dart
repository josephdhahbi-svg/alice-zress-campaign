import 'package:flutter/material.dart';

/// Read-only presentation of the Elder Eye campaign's traversal state.
///
/// The parent must validate prerequisites and persist the transition
/// transactionally before changing the displayed traversal/book.
class TraversalHubModal extends StatelessWidget {
  final int currentTraversal;
  final int currentBook;
  final List<Map<String, dynamic>> carriedRelics;
  final VoidCallback onAscendPressed;
  final VoidCallback onClose;

  const TraversalHubModal({
    super.key,
    required this.currentTraversal,
    required this.currentBook,
    required this.carriedRelics,
    required this.onAscendPressed,
    required this.onClose,
  }) : assert(currentTraversal >= 1 && currentTraversal <= 7),
       assert(currentBook >= 1 && currentBook <= 30);

  bool get canAdvance =>
      currentBook == 30 && currentTraversal >= 1 && currentTraversal < 7;
  bool get isFinalEndgame => currentBook == 30 && currentTraversal == 7;

  @override
  Widget build(BuildContext context) {
    const gold = Color(0xFFD4AF37);
    const red = Color(0xFF8C1D23);
    final status = isFinalEndgame
        ? 'Final traversal complete: endgame ascension requires its own prerequisites.'
        : canAdvance
            ? 'Book 30 reached: next traversal is available.'
            : 'Journey ongoing. Reach Book 30 to advance.';

    return SafeArea(
      top: false,
      child: Container(
        height: MediaQuery.sizeOf(context).height * 0.85,
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Color(0xFF14131A),
          borderRadius: BorderRadius.vertical(top: Radius.circular(12)),
          border: Border(
            top: BorderSide(color: gold, width: 2),
            left: BorderSide(color: red),
            right: BorderSide(color: red),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(children: [
              const Icon(Icons.autorenew, color: gold),
              const SizedBox(width: 8),
              const Expanded(
                child: Text('MULTIVERSAL TRAVERSAL HUB',
                    style: TextStyle(color: gold, fontWeight: FontWeight.bold,
                        letterSpacing: 1.1, fontSize: 13)),
              ),
              IconButton(
                tooltip: 'Close traversal hub',
                onPressed: onClose,
                icon: const Icon(Icons.close, color: Colors.white70),
              ),
            ]),
            const Divider(color: red),
            Card(
              color: const Color(0xFF1C1B24),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('TRAVERSAL $currentTraversal / 7',
                        style: const TextStyle(color: gold,
                            fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    Text('Book $currentBook / 30',
                        style: const TextStyle(color: Colors.white70)),
                    const SizedBox(height: 8),
                    Text(status,
                        style: TextStyle(
                            color: canAdvance ? Colors.greenAccent : Colors.white70,
                            fontSize: 12)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text('CARRIED MULTIVERSAL RELICS',
                style: TextStyle(color: gold, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Expanded(
              child: carriedRelics.isEmpty
                  ? const Center(
                      child: Text('No carried relics recorded.',
                          style: TextStyle(color: Colors.white54)))
                  : ListView.builder(
                      itemCount: carriedRelics.length,
                      itemBuilder: (context, index) {
                        final relic = carriedRelics[index];
                        return Card(
                          color: const Color(0xFF1C1B24),
                          child: ListTile(
                            title: Text(
                              (relic['relic_name'] ?? 'Unknown Artifact').toString(),
                              style: const TextStyle(color: Colors.white),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            subtitle: Text(
                              (relic['relic_category'] ?? 'Relic').toString(),
                              style: const TextStyle(color: Colors.white54),
                            ),
                          ),
                        );
                      },
                    ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: red,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              onPressed: canAdvance ? onAscendPressed : null,
              child: Text(
                canAdvance
                    ? 'BEGIN NEXT TRAVERSAL'
                    : isFinalEndgame
                        ? 'FINAL ENDGAME — NO EIGHTH TRAVERSAL'
                        : 'LOCKED — REACH BOOK 30',
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
