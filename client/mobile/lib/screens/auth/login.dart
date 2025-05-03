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
      emailError = "";
      passwordError = "";
    });

    try {
      String email = emailController.text;
      String password = passwordController.text;

      if (email.isEmpty) {
        setState(() {
          emailError = "Please enter your email";
          isLoading = false;
        });
        return;
      } else if (!email.contains('@')) {
        setState(() {
          emailError = "Please enter a valid email";
          isLoading = false;
        });
        return;
      }
      if (password.isEmpty) {
        setState(() {
          passwordError = "Please enter your password";
          isLoading = false;
        });
        return;
      }

      final result = await loginMethode(email, password, context: context);

      if (result['statusCode'] == 200) {
        final userProvider = Provider.of<UserProvider>(context, listen: false);
        await userProvider.fetchUserFromAPI();
        context.go('/home');
      } else if (result['statusCode'] == 201) {
        context.go('/complete-profile', extra: {'email': email});
      } else if (result['statusCode'] == 401) {
        final dynamic error = result["error"];
        dynamic parsedError;

        try {
          if (error is String) {
            parsedError = jsonDecode(error);
          } else {
            parsedError = error;
          }

          if (parsedError != null && parsedError["authToken"] != null) {
            context.go(
              '/otp-verify',
              extra: {
                'email': emailController.text,
                'authToken': parsedError["authToken"],
              },
            );
            return;
          }
        } catch (e) {
          setState(() {
            emailError = "Authentication error";
          });
        }
      } else {
        final dynamic error = result["error"];

        try {
          dynamic parsedError;
          if (error is String) {
            parsedError = jsonDecode(error);
          } else {
            parsedError = error;
          }

          if (parsedError != null && parsedError.containsKey("errors")) {
            final errors = parsedError["errors"];

            setState(() {
              if (errors.containsKey("email")) {
                emailError = errors["email"];
              }
              if (errors.containsKey("password")) {
                passwordError = errors["password"];
              }
            });
          } else {
            setState(() {
              emailError = error.toString();
            });
          }
        } catch (e) {
          setState(() {
            emailError = error.toString();
          });
        }
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
