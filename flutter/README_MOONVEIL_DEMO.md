# Moonveil Visual Codex Flutter demo

**Status:** Source committed; build and runtime not verified. This is a standalone entry point, not a confirmed integration into an existing Flutter application.

## Setup
From the Flutter project root (the directory containing `pubspec.yaml`), copy or merge the `lib/moonveil` files, then run:

```sh
flutter run -t lib/moonveil/demo_main.dart
```

This code imports only Flutter SDK libraries; the standalone demo does not require Provider. The repository's `flutter/` directory may not yet contain a complete Flutter project scaffold. If so, create a standard Flutter project separately, then copy `lib/moonveil/` into its `lib/` directory. Do not overwrite an existing application entry point.

## Features
- Adaptive illustrated cards for Book of Vile Darkness, Hand of Vecna, Eye of Vecna and Level 21 Visage.
- Local vector-style illustrations rendered with CustomPainter (not official D&D artwork or external images).
- Modal item inspection, quest gates and locked statuses.
- Local d20 roll (not a 3D physics engine, and not connected to the AI-DM).
- No item acquisition or story progression from demo interactions.

## Next
Integrate with the actual app's navigation, approved image asset pipeline, validated backend API, and persistent event ledger. Never report a successful server update until the server acknowledges it.
