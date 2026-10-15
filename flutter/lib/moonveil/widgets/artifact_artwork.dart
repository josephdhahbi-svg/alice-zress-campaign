import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../models/codex_item.dart';

/// Procedural illustrated cards, with no image package or network requirement.
/// Replace with licensed/approved image assets when available.
class ArtifactArtwork extends StatelessWidget {
  const ArtifactArtwork({super.key, required this.item, this.large = false});
  final CodexItem item;
  final bool large;

  @override
  Widget build(BuildContext context) => CustomPaint(
    painter: _ArtifactPainter(item.id, item.essence.color),
    child: SizedBox.expand(child: Align(
      alignment: Alignment.bottomRight,
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Icon(Icons.auto_awesome, color: Colors.white.withOpacity(.75),
          size: large ? 26 : 17),
      ),
    )),
  );
}

class _ArtifactPainter extends CustomPainter {
  _ArtifactPainter(this.id, this.accent);
  final String id;
  final Color accent;

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width, h = size.height;
    final rect = Offset.zero & size;
    canvas.drawRect(rect, Paint()..shader = LinearGradient(
      begin: Alignment.topLeft, end: Alignment.bottomRight,
      colors: [const Color(0xFF080914), accent.withOpacity(.32), const Color(0xFF11091F)],
    ).createShader(rect));
    final center = Offset(w * .5, h * .47);
    for (var i = 0; i < 3; i++) {
      canvas.drawCircle(center, math.min(w, h) * (.26 + i * .11),
        Paint()..color = accent.withOpacity(.16 - i * .035)
          ..style = PaintingStyle.stroke..strokeWidth = 1.5);
    }
    final glow = Paint()..color = accent.withOpacity(.28)..maskFilter = const MaskFilter.blur(BlurStyle.normal, 19);
    canvas.drawCircle(center, math.min(w, h) * .2, glow);
    final ink = Paint()..color = const Color(0xFFE8E0F5)..style = PaintingStyle.stroke..strokeWidth = 3;
    final fill = Paint()..color = const Color(0xFFDDD1F4);
    if (id.contains('book')) {
      final p = Path()
        ..moveTo(w * .5, h * .25)..lineTo(w * .2, h * .2)
        ..lineTo(w * .2, h * .7)..lineTo(w * .5, h * .76)
        ..lineTo(w * .8, h * .7)..lineTo(w * .8, h * .2)
        ..close();
      canvas.drawPath(p, ink);
      canvas.drawLine(Offset(w * .5, h * .25), Offset(w * .5, h * .76), ink);
      canvas.drawCircle(Offset(w * .5, h * .49), w * .05, fill);
    } else if (id.contains('hand')) {
      final p = Path()..moveTo(w*.32,h*.72)..lineTo(w*.26,h*.46)
        ..lineTo(w*.33,h*.42)..lineTo(w*.32,h*.23)
        ..lineTo(w*.4,h*.22)..lineTo(w*.45,h*.43)
        ..lineTo(w*.48,h*.18)..lineTo(w*.56,h*.19)
        ..lineTo(w*.56,h*.43)..lineTo(w*.64,h*.26)
        ..lineTo(w*.71,h*.3)..lineTo(w*.63,h*.58)
        ..lineTo(w*.68,h*.72)..close();
      canvas.drawPath(p, ink);
    } else if (id.contains('eye')) {
      final p = Path()..moveTo(w*.18,h*.49)
        ..quadraticBezierTo(w*.5,h*.18,w*.82,h*.49)
        ..quadraticBezierTo(w*.5,h*.8,w*.18,h*.49);
      canvas.drawPath(p, ink);
      canvas.drawCircle(center, w*.105, fill);
      canvas.drawCircle(center, w*.046, Paint()..color = accent);
    } else {
      // Radiant six-wing celestial silhouette.
      final wing = Path()..moveTo(w*.5,h*.54)
        ..quadraticBezierTo(w*.08,h*.12,w*.08,h*.45)
        ..quadraticBezierTo(w*.19,h*.68,w*.5,h*.63);
      canvas.drawPath(wing, ink);
      canvas.save();
      canvas.translate(w, 0);
      canvas.scale(-1, 1);
      canvas.drawPath(wing, ink);
      canvas.restore();
      canvas.drawCircle(Offset(w*.5,h*.34), w*.075, fill);
      canvas.drawLine(Offset(w*.5,h*.42), Offset(w*.5,h*.72), ink);
    }
    final stars = Paint()..color = Colors.white.withOpacity(.65);
    for (var i = 0; i < 16; i++) {
      final x = (i * 79 % 97) / 97 * w;
      final y = (i * 53 % 89) / 89 * h;
      canvas.drawCircle(Offset(x, y), i % 3 == 0 ? 1.6 : .8, stars);
    }
  }
  @override
  bool shouldRepaint(covariant _ArtifactPainter old) => old.id != id || old.accent != accent;
}
