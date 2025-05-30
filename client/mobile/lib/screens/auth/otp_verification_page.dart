import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:senior_project/functions/auth/verify_otp.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/functions/auth/send_otp.dart';
import 'package:shared_preferences/shared_preferences.dart'; 
import 'dart:convert';

import 'package:senior_project/components/auth_button.dart';
import 'package:senior_project/components/app_title.dart';

class OtpVerificationPage extends StatefulWidget {
  final String email;

  const OtpVerificationPage({super.key, required this.email});

  @override
  State<OtpVerificationPage> createState() => _OtpVerificationPageState();
}

class _OtpVerificationPageState extends State<OtpVerificationPage> {
  List<TextEditingController> otpControllers = List.generate(
    6,
    (_) => TextEditingController(),
  );
  List<FocusNode> focusNodes = List.generate(6, (_) => FocusNode());

  bool isLoading = false;
  String? errorMessage;

  @override
  void dispose() {
    for (var controller in otpControllers) {
      controller.dispose();
    }
    for (var node in focusNodes) {
      node.dispose();
    }
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    initialSendOtp();
  }

  Future<void> initialSendOtp() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    final result = await sendOtp(widget.email);

    setState(() {
      isLoading = false;
    });

    if (!result['success']) {
      if (result['message'] == 'otpAlreadySent' &&
          result['minutesLeft'] != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'OTP already sent. Please wait ${result['minutesLeft']} minutes before requesting another one.',
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to send OTP: ${result['message']}')),
        );
      }
    }
  }

  Future<void> verifyOtp() async {
    String otp = otpControllers.map((controller) => controller.text).join();

    if (otp.length != 6) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please enter a valid OTP')));
      return;
    }

    setState(() {
      isLoading = true;
    });

    bool success = await verify_otp(otp);

    if (success) {
      try {
        final userProvider = Provider.of<UserProvider>(context, listen: false);
        await userProvider.fetchUserFromAPI();

        final currentUser = userProvider.currentUser;

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('OTP verified successfully!')),
        );

        if (currentUser != null && currentUser.isStudent == false) {

          final prefs = await SharedPreferences.getInstance();

          if (currentUser.toJson != null) {
            try {
              final userJson = currentUser.toJson();
              await prefs.setString('userData', jsonEncode(userJson));
            } catch (e) {
              print('Error saving user data: $e');
            }
          }

          final authToken = prefs.getString('authToken');
          if (authToken == null || authToken.isEmpty) {
            print('Warning: Auth token not found after verification');
          }

          context.go('/home');
        } else {
          context.go('/complete-profile', extra: {'email': widget.email});
        }
      } catch (e) {
        print('Error fetching user data: $e');
        context.go('/complete-profile', extra: {'email': widget.email});
      }
    } else {
      setState(() {
        isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Invalid OTP. Please try again.')),
      );
    }
  }

  Future<void> resendOtp() async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });

    final result = await sendOtp(widget.email);

    setState(() {
      isLoading = false;
    });

    if (result['success']) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('OTP resent successfully!')));
    } else {
      if (result['message'] == 'otpAlreadySent' &&
          result['minutesLeft'] != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Please wait ${result['minutesLeft']} minutes before requesting another OTP',
            ),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to resend OTP: ${result['message']}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('OTP Verification')),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const AppTitle(text: 'SimplerUni'),
                const Icon(
                  Icons.verified_user_outlined,
                  size: 64,
                  color: AppColors.primaryColor,
                ),
                const SizedBox(height: 24),
                const Text(
                  'Verification Code',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  'We have sent the verification code to\n${widget.email}',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: List.generate(
                    6,
                    (index) => SizedBox(
                      width: 40,
                      child: TextField(
                        controller: otpControllers[index],
                        focusNode: focusNodes[index],
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        maxLength: 1,
                        style: const TextStyle(fontSize: 20),
                        decoration: const InputDecoration(
                          counterText: '',
                          contentPadding: EdgeInsets.zero,
                        ),
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        onChanged: (value) {
                          if (value.isNotEmpty && index < 5) {
                            focusNodes[index + 1].requestFocus();
                          }
                        },
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 32),

                if (errorMessage != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Text(
                      errorMessage!,
                      style: const TextStyle(color: Colors.red),
                      textAlign: TextAlign.center,
                    ),
                  ),

                AuthButton(
                  text: 'VERIFY',
                  isLoading: isLoading,
                  onPressed: verifyOtp,
                ),

                const SizedBox(height: 24),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Didn\'t receive the code?',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                    TextButton(
                      onPressed: resendOtp,
                      child: const Text('Resend'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
