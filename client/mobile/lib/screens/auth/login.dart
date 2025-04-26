import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/functions/auth/login.dart';
import 'package:senior_project/components/form_input.dart';
import 'package:senior_project/components/auth_button.dart';
import 'package:senior_project/components/app_title.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:provider/provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => LoginPageState();
}

class LoginPageState extends State<LoginPage> {
  final formKey = GlobalKey<FormState>();
  bool isLoading = false;

  String emailError = "";
  String passwordError = "";

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> handleLogin() async {
    if (!formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      String email = emailController.text;
      String password = passwordController.text;
      setState(() {
        if (email.isEmpty) {
          emailError = "Please enter your email";
          return;
        } else if (!email.contains('@')) {
          emailError = "Please enter a valid email";
          return;
        }
        if (password.isEmpty) {
          passwordError = "Please enter your password";
          return;
        }
      });
      final result = await loginMethode(email, password, context: context);

      if (result['statusCode'] == 200) {
        final userProvider = Provider.of<UserProvider>(context, listen: false);
        await userProvider.fetchUserFromAPI(); 

        context.go('/home');
      } else if (result['statusCode'] == 201) {
        context.go('/complete-profile', extra: {'email': email});
      } else if (result['statusCode'] == 401) {
        final error = result["error"];
        Map<String, dynamic> decodedError = jsonDecode(error);
        context.go(
          '/otp-verify',
          extra: {
            'email': emailController.text,
            'authToken': decodedError["authToken"],
          },
        );
      } else {
        final error = result["error"];
        Map<String, dynamic> decodedError = jsonDecode(error);
        setState(() {
          if (decodedError["email"] != "")
            emailError = decodedError['errors']["email"];
          if (decodedError["password"] != "")
            passwordError = decodedError['errors']["password"];
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Login error: ${e.toString()}')));
    }

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const AppTitle(text: 'SimplerUni'),
                  const Icon(
                    Icons.login,
                    size: 80,
                    color: AppColors.primaryColor,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Log In',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 32),
                  FormInput(
                    controller: emailController,
                    labelText: 'Email',
                    prefixIcon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                    error: emailError,
                  ),
                  const SizedBox(height: 16),
                  FormInput(
                    controller: passwordController,
                    labelText: 'Password',
                    prefixIcon: Icons.lock_outline,
                    isPassword: true,
                    error: passwordError,
                  ),
                  const SizedBox(height: 24),
                  AuthButton(
                    text: 'LOG IN',
                    isLoading: isLoading,
                    onPressed: handleLogin,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Don\'t have an account?',
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                      TextButton(
                        onPressed: () {
                          context.go('/signup');
                        },
                        child: const Text('Sign Up'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
