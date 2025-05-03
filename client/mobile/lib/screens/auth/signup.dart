import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:senior_project/functions/auth/register.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/components/form_input.dart';
import 'package:senior_project/components/auth_button.dart';
import 'package:senior_project/components/app_title.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => SignupPageState();
}

class SignupPageState extends State<SignupPage> {
  final formKey = GlobalKey<FormState>();
  bool isLoading = false;
  String usernameError = "";
  String emailError = "";
  String passwordError = "";

  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    usernameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> signUp() async {
    if (!formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      isLoading = true;
      usernameError = "";
      emailError = "";
      passwordError = "";
    });

    try {
      String username = usernameController.text;
      String email = emailController.text;
      String password = passwordController.text;

      if (username.isEmpty) {
        setState(() {
          usernameError = "Please enter your username";
          isLoading = false;
        });
        return;
      }
      if (username.length < 3) {
        setState(() {
          usernameError = "Username must be at least 3 characters";
          isLoading = false;
        });
        return;
      }
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
      } else if (password.length < 6) {
        setState(() {
          passwordError = "Password must be at least 6 characters";
          isLoading = false;
        });
        return;
      } else if (password != confirmPasswordController.text) {
        setState(() {
          passwordError = "Passwords mismatch";
          isLoading = false;
        });
        return;
      }

      final result = await sign_up(email, password, username, context: context);

      if (result["statusCode"] == 200) {
        context.go(
          '/otp-verify',
          extra: {
            'email': emailController.text,
            'authToken': result["data"]["authToken"],
          },
        );
      } else if (result["statusCode"] == 401) {
        final dynamic error = result["error"];
        dynamic parsedError;

        if (error is String) {
          try {
            parsedError = jsonDecode(error);
          } catch (e) {
            setState(() {
              emailError = error;
            });
            return;
          }
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
        }
      } else {
        final dynamic error = result["error"];

        if (error is String) {
          try {
            final Map<String, dynamic> parsedJson = jsonDecode(error);

            if (parsedJson.containsKey("errors")) {
              final errorsObj = parsedJson["errors"];
              if (errorsObj is Map) {
                setState(() {
                  if (errorsObj.containsKey("email"))
                    emailError = errorsObj["email"];
                  if (errorsObj.containsKey("username"))
                    usernameError = errorsObj["username"];
                  if (errorsObj.containsKey("password"))
                    passwordError = errorsObj["password"];
                });
              } else {
                setState(() {
                  emailError = errorsObj.toString();
                });
              }
            } else {
              setState(() {
                emailError = error;
              });
            }
          } catch (e) {
            setState(() {
              emailError = error;
            });
          }
        } else if (error is Map) {
          if (error.containsKey("errors")) {
            final errorsObj = error["errors"];
            setState(() {
              if (errorsObj is Map) {
                if (errorsObj.containsKey("email"))
                  emailError = errorsObj["email"];
                if (errorsObj.containsKey("username"))
                  usernameError = errorsObj["username"];
                if (errorsObj.containsKey("password"))
                  passwordError = errorsObj["password"];
              } else if (errorsObj != null) {
                emailError = errorsObj.toString();
              }
            });
          } else {
            setState(() {
              emailError = "An error occurred during signup";
            });
          }
        } else {
          setState(() {
            emailError = "An unexpected error occurred";
          });
        }
      }
    } catch (e) {
      setState(() {
        emailError = "An unexpected error occurred: ${e.toString()}";
      });
      print("Signup error: $e");
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
                  const AppTitle(text: 'UniConnect'),
                  const Icon(
                    Icons.person_add,
                    size: 80,
                    color: AppColors.primaryColor,
                  ),
                  const SizedBox(height: 16),
                  const SizedBox(height: 8),
                  const Text(
                    'Create Account',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 32),
                  FormInput(
                    controller: usernameController,
                    labelText: 'Username',
                    prefixIcon: Icons.person_outline,
                    keyboardType: TextInputType.name,
                    error: usernameError,
                  ),
                  const SizedBox(height: 16),
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
                    error: passwordError,
                    isPassword: true,
                  ),
                  const SizedBox(height: 16),
                  FormInput(
                    controller: confirmPasswordController,
                    labelText: 'Confirm Password',
                    prefixIcon: Icons.lock_outline,
                    error: passwordError,
                    isPassword: true,
                  ),
                  const SizedBox(height: 24),
                  AuthButton(
                    text: 'SIGN UP',
                    isLoading: isLoading,
                    onPressed: signUp,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Already have an account?',
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                      TextButton(
                        onPressed: () {
                          context.go('/login');
                        },
                        child: const Text('Log In'),
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
