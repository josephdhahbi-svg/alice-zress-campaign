import 'package:flutter/material.dart';
import 'engine/database_helper.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MoonveilApp());
}

class MoonveilApp extends StatelessWidget {
  const MoonveilApp({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Moonveil Universe',
    theme: ThemeData.dark(),
    home: const MoonveilScreen(),
  );
}

class MoonveilScreen extends StatefulWidget {
  const MoonveilScreen({super.key});
  @override
  State<MoonveilScreen> createState() => _MoonveilScreenState();
}

class _MoonveilScreenState extends State<MoonveilScreen> {
  Map<String, dynamic>? state;
  String feedback = '';
  int page = 0;
  bool busy = false;
  final choices = const [
    (1, 'Stay with Lyra', 5, 'shared_vulnerability'),
    (2, 'Share a joke', 2, 'shared_laughter'),
    (3, 'Accept healing', 3, 'accepted_help'),
    (4, 'Ask about missing healers', 1, 'hospice_lead'),
    (5, 'Study the conduit', 2, 'conduit_clue'),
    (6, 'Listen to Lyra', 3, 'listened_to_lyra'),
    (7, 'Offer to stand watch', 2, 'shared_watch'),
    (8, 'Discuss faith', 1, 'discussed_faith'),
    (9, 'Request quiet', 0, 'boundary_respected'),
    (10, 'Share a deeper vow', 3, 'vow_spoken'),
    (11, 'Sun–Moon Covenant', 0, 'sun_moon_covenant'),
  ];

  @override
  void initState() {
    super.initState();
    refresh();
  }

  Future<void> refresh() async {
    try {
      final next = await DatabaseHelper.instance.load();
      if (mounted) setState(() => state = next);
    } catch (e) {
      if (mounted) setState(() => feedback = 'Save error: $e');
    }
  }

  bool allowed(int id) => state != null && DatabaseHelper.isAllowed(id, state!);

  Future<void> choose((int, String, int, String) choice) async {
    if (busy || !allowed(choice.$1)) return;
    setState(() => busy = true);
    try {
      final saved = await DatabaseHelper.instance.applyChoice(choiceId: choice.$1);
      await refresh();
      if (mounted) setState(() => feedback = saved ? 'Choice recorded and saved.' : 'Choice already recorded.');
    } catch (e) {
      if (mounted) setState(() => feedback = 'Could not save: $e');
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final visible = choices.where((c) => c.$1 != 11 || allowed(11)).toList();
    final maxPage = (visible.length - 1) ~/ 5;
    final shown = visible.skip(page * 5).take(5);
    return Scaffold(
      appBar: AppBar(title: const Text('Moonveil Universe')),
      body: state == null ? const Center(child: CircularProgressIndicator()) :
        SafeArea(child: Padding(padding: const EdgeInsets.all(16), child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Expanded(child: SingleChildScrollView(child: Text(
              'Lyra: You do not have to carry every wound alone, Seralyth.',
              style: TextStyle(fontSize: 21)))),
            Text('Lyra approval: ${state!['approval']['lyra_solaria']} / 50'),
            Text(feedback),
            for (final c in shown)
              Padding(padding: const EdgeInsets.symmetric(vertical: 4), child:
                ElevatedButton(onPressed: busy || !allowed(c.$1) ? null : () => choose(c),
                  child: Text('${c.$1}. ${c.$2}${allowed(c.$1) ? '' : ' [Locked]'}'))),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              TextButton(onPressed: page > 0 ? () => setState(() => page--) : null, child: const Text('Previous')),
              Text('Page ${page + 1} / ${maxPage + 1}'),
              TextButton(onPressed: page < maxPage ? () => setState(() => page++) : null, child: const Text('Next')),
            ]),
          ],
        ))),
    );
  }
}
