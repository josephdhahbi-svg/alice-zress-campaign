import 'package:flutter/material.dart';
import 'screens/visual_command_center.dart';

/// Launch with: flutter run -t lib/moonveil/demo_main.dart
void main() => runApp(const MoonveilDemoApp());

class MoonveilDemoApp extends StatelessWidget {
  const MoonveilDemoApp({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Moonveil Visual Command Center',
    debugShowCheckedModeBanner: false,
    theme: ThemeData.dark(useMaterial3: true).copyWith(
      colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF8B5CF6),
        brightness: Brightness.dark),
    ),
    home: const VisualCommandCenter(),
  );
}
