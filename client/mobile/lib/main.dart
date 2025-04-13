import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:senior_project/screens/auth/chat/chat.dart';
import 'package:senior_project/screens/auth/complete_profile.dart';
import 'package:senior_project/screens/auth/optional_profile_info.dart';
import 'package:senior_project/screens/auth/otp_verification_page.dart';
import 'package:senior_project/screens/auth/signup.dart';
import 'package:senior_project/screens/auth/login.dart';
import 'package:senior_project/screens/home/homepage.dart';
import 'package:senior_project/theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) {
        final userProvider = UserProvider();
        userProvider.initializeUser();
        return userProvider;
      },
      child: Builder(
        builder: (context) {
          final GoRouter router = GoRouter(
            initialLocation: '/',
            routes: [
              GoRoute(
                path: '/',
                builder: (context, state) => const LoginPage(),
              ),
              GoRoute(
                path: '/signup',
                builder: (context, state) => const SignupPage(),
              ),
              GoRoute(
                path: '/login',
                builder: (context, state) => const LoginPage(),
              ),
              GoRoute(
                path: '/otp-verify',
                builder: (context, state) {
                  final Map<String, dynamic> args =
                      state.extra as Map<String, dynamic>;
                  return OtpVerificationPage(email: args['email']);
                },
              ),
              GoRoute(
                path: '/complete-profile',
                builder: (context, state) {
                  final Map<String, dynamic> args =
                      state.extra as Map<String, dynamic>;
                  return CompleteProfile(email: args['email']);
                },
              ),
              GoRoute(
                path: '/optional-profile-info',
                builder: (context, state) {
                  final Map<String, dynamic> params =
                      state.extra as Map<String, dynamic>;
                  return OptionalProfileInfo(
                    email: params['email'] ?? '',
                    majorId: params['majorId'] ?? '',
                    campusId: params['campusId'] ?? '',
                  );
                },
              ),
              GoRoute(
                path: '/home',
                builder: (context, state) => const Homepage(),
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
        },
      ),
    );
  }
}
