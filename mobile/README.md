# Moonveil Android prototype (not yet verified)
This is an early offline Flutter interface with SQLite persistence, 5 choices per page, and idempotent event IDs. It is not the full D&D game.
Create Flutter platform scaffolding locally from this folder: `flutter create --platforms=android .` (review changes before accepting). Then `flutter pub get`, `flutter analyze`, `flutter run`.
Only simple dialogue flags are implemented. The Investigation D20 check, combat, quest prerequisites, and complete event validation are pending. Never use this prototype to declare campaign canon.
The initial gold is 0 and HP is unset pending character creation. Approval starts at neutral 0. No relationship milestone is pre-awarded.
