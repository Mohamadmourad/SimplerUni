import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/screens/auth/chat/chat.dart';
import 'package:senior_project/screens/auth/complete_profile.dart';
import 'package:senior_project/screens/auth/otp_verification_page.dart';
import 'package:senior_project/screens/auth/signup.dart';
import 'package:senior_project/screens/auth/login.dart';
import 'package:senior_project/theme/app_theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final GoRouter router = GoRouter(
      initialLocation: '/',
      routes: [
        GoRoute(path: '/', builder: (context, state) => const LoginPage()),
        GoRoute(
          path: '/signup',
          builder: (context, state) => const SignupPage(),
        ),
        GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
        GoRoute(
          path: '/otp-verify',
          builder: (context, state) {
            final Map<String, dynamic> args =
                state.extra as Map<String, dynamic>;
            return OtpVerificationPage(
              email: args['email'],
              authToken: args['authToken'],
            );
          },
        ),
        GoRoute(
          path: '/complete-profile',
          builder: (context, state) {
            final Map<String, dynamic> args =
                state.extra as Map<String, dynamic>;
            return CompleteProfile();
          },
        ),
      ],
    );

    return MaterialApp.router(
      routerConfig: router,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.dark,
      debugShowCheckedModeBanner: false,
    );
  }
}
