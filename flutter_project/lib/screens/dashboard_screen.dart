import 'package:flutter/material.dart';
import '../widgets/dashboard_sidebar.dart';

class DashboardScreen extends StatelessWidget {
  final Widget child;

  const DashboardScreen({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          const DashboardSidebar(),
          Expanded(child: child),
        ],
      ),
    );
  }
}