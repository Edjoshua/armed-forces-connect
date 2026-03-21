import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'screens/landing_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/personnel_dashboard.dart';
import 'screens/retail_dashboard.dart';
import 'screens/supply_dashboard.dart';
import 'screens/education_dashboard.dart';
import 'screens/audit_dashboard.dart';
import 'screens/settings_dashboard.dart';
import 'screens/reset_password_screen.dart';
import 'screens/not_found_screen.dart';
import 'services/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase (replace with your actual URL and key)
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
      ],
      child: MaterialApp.router(
        title: 'Armed Forces Connect',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        routerConfig: _router,
      ),
    );
  }
}

final GoRouter _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const LandingScreen(),
    ),
    GoRoute(
      path: '/reset-password',
      builder: (context, state) => const ResetPasswordScreen(),
    ),
    ShellRoute(
      builder: (context, state, child) => DashboardScreen(child: child),
      routes: [
        GoRoute(
          path: '/dashboard',
          builder: (context, state) => const PersonnelDashboard(),
        ),
        GoRoute(
          path: '/dashboard/retail',
          builder: (context, state) => const RetailDashboard(),
        ),
        GoRoute(
          path: '/dashboard/supply',
          builder: (context, state) => const SupplyDashboard(),
        ),
        GoRoute(
          path: '/dashboard/education',
          builder: (context, state) => const EducationDashboard(),
        ),
        GoRoute(
          path: '/dashboard/audit',
          builder: (context, state) => const AuditDashboard(),
        ),
        GoRoute(
          path: '/dashboard/settings',
          builder: (context, state) => const SettingsDashboard(),
        ),
      ],
    ),
    GoRoute(
      path: '/not-found',
      builder: (context, state) => const NotFoundScreen(),
    ),
  ],
  redirect: (context, state) {
    final authService = Provider.of<AuthService>(context, listen: false);
    final isLoggedIn = authService.user != null;
    final isLoggingIn = state.matchedLocation == '/';

    if (!isLoggedIn && !isLoggingIn) return '/';
    if (isLoggedIn && isLoggingIn) return '/dashboard';
    return null;
  },
);