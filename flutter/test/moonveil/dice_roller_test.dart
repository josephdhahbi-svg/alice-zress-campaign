import 'dart:math';
import 'package:flutter_test/flutter_test.dart';
import '../../lib/moonveil/services/dice_roller.dart';

void main() {
  test('d20 stays within 1..20 and total includes modifier', () {
    final roller = DiceRoller(random: Random(42));
    for (var i = 0; i < 1000; i++) {
      final roll = roller.rollD20(modifier: 3);
      expect(roll.face, inInclusiveRange(1, 20));
      expect(roll.total, roll.face + 3);
    }
  });
}
