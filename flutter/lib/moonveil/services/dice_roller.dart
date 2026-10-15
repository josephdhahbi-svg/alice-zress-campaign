import 'dart:math';

class DiceResult {
  const DiceResult({required this.face, required this.modifier, required this.rolledAt});
  final int face;
  final int modifier;
  final DateTime rolledAt;
  int get total => face + modifier;
  bool get natural20 => face == 20;
  bool get natural1 => face == 1;
}

class DiceRoller {
  DiceRoller({Random? random}) : _random = random ?? Random.secure();
  final Random _random;

  DiceResult rollD20({int modifier = 0}) => DiceResult(
    face: _random.nextInt(20) + 1,
    modifier: modifier,
    rolledAt: DateTime.now().toUtc(),
  );
}
