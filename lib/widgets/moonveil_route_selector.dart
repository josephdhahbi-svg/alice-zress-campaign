import 'package:flutter/material.dart';

/// Read-only route choices. The parent must send an authenticated command
/// and wait for server confirmation before changing the saved sector.
class MoonveilRouteSelector extends StatelessWidget {
  final String currentSector;
  final List<Map<String, dynamic>> routes;
  final ValueChanged<String> onTravelRequested;
  const MoonveilRouteSelector({
    super.key,
    required this.currentSector,
    required this.routes,
    required this.onTravelRequested,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Routes from $currentSector', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        if (routes.isEmpty) const Text('No discovered routes.'),
        ...routes.map((route) {
          final id = route['routeId'] as String? ?? '';
          final name = route['routeName'] as String? ?? 'Unknown passage';
          final status = route['status'] as String? ?? 'LOCKED';
          final canRequest = route['canRequestTravel'] == true &&
              status == 'DISCOVERED' && id.isNotEmpty;
          return Card(
            child: ListTile(
              title: Text(name),
              subtitle: Text('Status: $status  |  Hazard: ${route['hazardMultiplier'] ?? '?'}'),
              trailing: FilledButton(
                onPressed: canRequest ? () => onTravelRequested(id) : null,
                child: Text(canRequest ? 'Request travel' : 'Locked'),
              ),
            ),
          );
        }),
      ],
    );
  }
}
