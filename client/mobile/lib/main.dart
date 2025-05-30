import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/modules/user_profile.dart';
import 'package:senior_project/providers/chatroomProvider.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:senior_project/screens/auth/forgot_password_page.dart';
import 'package:senior_project/screens/chats/chat.dart';
import 'package:senior_project/screens/auth/complete_profile.dart';
import 'package:senior_project/screens/auth/profile_optional_info.dart';
import 'package:senior_project/screens/auth/otp_verification_page.dart';
import 'package:senior_project/screens/auth/signup.dart';
import 'package:senior_project/screens/auth/login.dart';
import 'package:senior_project/screens/home/homepage.dart';
import 'package:senior_project/screens/profile/profile_page.dart';
import 'package:senior_project/screens/auth/loading_page.dart';
import 'package:senior_project/services/webSocket.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:senior_project/screens/profile/edit_profile_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final userProvider = UserProvider();
  await userProvider.initializeUser();

  final chatroomProvider = ChatroomProvider();
  final socketService = SocketService();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<UserProvider>.value(value: userProvider),
        ChangeNotifierProvider<ChatroomProvider>.value(value: chatroomProvider),
        Provider<SocketService>.value(value: socketService), 
      ],
      child: const MyApp(),
    ),
  );
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
                builder: (context, state) => const LoadingPage(),
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
                      state.extra as Map<String, dynamic>? ?? {};
                  return ProfileOptionalInfo(
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
              GoRoute(
                path: '/chat/:chatroomName/:chatroomId',
                builder: (context, state) {
                  final String chatroomName =
                      state.pathParameters['chatroomName']!;
                  final String chatroomId = state.pathParameters['chatroomId']!;
                  return Chat(
                    chatroomName: chatroomName,
                    chatroomId: chatroomId,
                  );
                },
              ),
              GoRoute(
                path: '/profile/:userId',
                builder: (context, state) {
                  final userId = state.pathParameters['userId'];
                  return ProfilePage(fromBottomNav: false, userId: userId);
                },
              ),
              GoRoute(
                path: '/edit-profile',
                builder:
                    (context, state) => EditProfilePage(
                      userProfile: state.extra as UserProfile,
                    ),
              ),
              GoRoute(
                path: '/forgot-password',
                builder: (context, state) => const ForgotPasswordPage(),
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
