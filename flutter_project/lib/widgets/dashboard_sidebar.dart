import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../services/auth_service.dart';

class DashboardSidebar extends StatefulWidget {
  const DashboardSidebar({super.key});

  @override
  State<DashboardSidebar> createState() => _DashboardSidebarState();
}

class _DashboardSidebarState extends State<DashboardSidebar> {
  bool _collapsed = false;

  final List<Map<String, dynamic>> _navItems = [
    {'label': 'Personnel', 'icon': Icons.people, 'path': '/dashboard'},
    {'label': 'Retail Discounts', 'icon': Icons.shopping_bag, 'path': '/dashboard/retail'},
    {'label': 'Supply Chain', 'icon': Icons.local_shipping, 'path': '/dashboard/supply'},
    {'label': 'Education Fund', 'icon': Icons.school, 'path': '/dashboard/education'},
    {'label': 'Audit & Compliance', 'icon': Icons.checklist, 'path': '/dashboard/audit'},
    {'label': 'Settings', 'icon': Icons.settings, 'path': '/dashboard/settings'},
  ];

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final user = authService.user;
    final userName = user?.userMetadata?['full_name'] ?? user?.email?.split('@')[0] ?? '';
    final initials = userName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

    return Container(
      width: _collapsed ? 64 : 240,
      color: Colors.grey[100],
      child: Column(
        children: [
          // Logo - corresponds to the logo in React sidebar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.grey)),
            ),
            child: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  color: Colors.grey,
                  child: const Icon(Icons.shield),
                ),
                if (!_collapsed) ...[
                  const SizedBox(width: 8),
                  const Text('MWCIP', style: TextStyle(fontWeight: FontWeight.bold)),
                ],
              ],
            ),
          ),
          // User profile - corresponds to user profile in React
          Container(
            padding: const EdgeInsets.all(12),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Colors.grey)),
            ),
            child: _collapsed
                ? CircleAvatar(
                    radius: 16,
                    child: Text(initials),
                  )
                : Row(
                    children: [
                      CircleAvatar(
                        radius: 18,
                        child: Text(initials),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(userName, style: const TextStyle(fontWeight: FontWeight.medium)),
                            Text(user?.email ?? '', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        ),
                      ),
                    ],
                  ),
          ),
          // Navigation - corresponds to nav in React
          Expanded(
            child: ListView(
              children: _navItems.map((item) {
                final isActive = GoRouter.of(context).location == item['path'];
                return ListTile(
                  leading: Icon(item['icon'], size: 20),
                  title: _collapsed ? null : Text(item['label']),
                  selected: isActive,
                  onTap: () => context.go(item['path']),
                  dense: true,
                );
              }).toList(),
            ),
          ),
          // Footer - corresponds to sign out and collapse
          Container(
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: Colors.grey)),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.logout, size: 20),
                  title: _collapsed ? null : const Text('Sign Out'),
                  onTap: () async {
                    await authService.signOut();
                    if (mounted) context.go('/');
                  },
                  dense: true,
                ),
                IconButton(
                  onPressed: () => setState(() => _collapsed = !_collapsed),
                  icon: Icon(_collapsed ? Icons.chevron_right : Icons.chevron_left),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}