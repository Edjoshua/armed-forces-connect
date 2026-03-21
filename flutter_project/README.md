# Armed Forces Connect - Flutter App

This Flutter application is a conversion of the original React web application for managing military personnel and related services.

## Features

- User authentication with Supabase
- Dashboard with multiple sections:
  - Personnel management
  - Retail discounts
  - Supply chain
  - Education fund
  - Audit & compliance
  - Settings
- Responsive design with sidebar navigation

## Setup

1. Install Flutter: https://flutter.dev/docs/get-started/install
2. Clone or copy this project
3. Run `flutter pub get` to install dependencies
4. Configure Supabase:
   - Create a Supabase project
   - Update `lib/main.dart` with your Supabase URL and anon key
5. Run `flutter run` to start the app

## Project Structure

- `lib/main.dart`: App entry point with routing
- `lib/services/auth_service.dart`: Authentication logic
- `lib/screens/`: Screen widgets
- `lib/widgets/`: Reusable widgets
- `lib/models/`: Data models (if needed)

## Conversion Notes

This Flutter app replicates the functionality of the original React app:
- Landing screen corresponds to `Landing.tsx`
- Dashboard layout with sidebar corresponds to `DashboardLayout.tsx` and `DashboardSidebar.tsx`
- Personnel dashboard corresponds to `PersonnelDashboard.tsx`
- Authentication uses Supabase, matching the original

## Dependencies

- supabase_flutter: For backend services
- provider: For state management
- go_router: For navigation