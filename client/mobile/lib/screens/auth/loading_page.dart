import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/functions/user/get_user_data.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class LoadingPage extends StatefulWidget {
  const LoadingPage({Key? key}) : super(key: key);

  @override
  State<LoadingPage> createState() => LoadingPageState();
}

class LoadingPageState extends State<LoadingPage> {
  bool isUserBanned = false;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      checkAuthStatus();
    });
  }

  Future<void> checkAuthStatus() async {
    try {
      await Future.delayed(const Duration(seconds: 1));

      final prefs = await SharedPreferences.getInstance();
      final userData = prefs.getString('userData');

      if (mounted) {
        if (userData != null) {
          final userMap = jsonDecode(userData);
          final userId = userMap['userId'];

          if (userId != null) {
            try {
              final user = await fetchCurrentUserData();
              if (user == null) {
                print("User not found on the server. Logging out.");
                await clearUserDataAndLogout();
                return;
              }

              if (user.isBanned == true) {
                setState(() {
                  isUserBanned = true;
                  isLoading = false;
                });
                return;
              }
            } catch (e) {
              print("Error fetching user profile: $e");

              if (e.toString().contains("404") ||
                  e.toString().contains("not found") ||
                  e.toString().contains("deleted")) {
                print("User likely deleted or not found. Logging out.");
                await clearUserDataAndLogout();
                return;
              }
            }
          }

          final userProvider = Provider.of<UserProvider>(
            context,
            listen: false,
          );
          await userProvider.initializeUser();
          context.go('/home');
        } else {
          context.go('/login');
        }
      }
    } catch (e) {
      print("Error checking authentication: $e");
      if (mounted) {
        context.go('/login');
      }
    }
  }

  Future<void> clearUserDataAndLogout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('userData');
      await prefs.remove('authToken');

      await prefs.remove('selectedMajorId');
      await prefs.remove('selectedCampusId');

      if (mounted) {
        context.go('/login');
      }
    } catch (e) {
      print("Error during logout: $e");
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Error logging out: $e')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isUserBanned) {
      return _buildBannedUserScreen();
    }

    // Regular loading screen
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(height: 30),
            const CircularProgressIndicator(),
            const SizedBox(height: 20),
            const Text(
              'Loading...',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBannedUserScreen() {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.block, color: Colors.red, size: 80),
              const SizedBox(height: 24),
              const Text(
                'Account Banned',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Your account has been banned by an administrator. '
                'If you believe this is a mistake, please contact your university.',
                style: TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: clearUserDataAndLogout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 12,
                  ),
                ),
                child: const Text(
                  'Return to Login',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
