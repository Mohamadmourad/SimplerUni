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
    });

    try {
      String username = usernameController.text;
      String email = emailController.text;
      String password = passwordController.text;

      setState(() {
      if (username.isEmpty) {
          usernameError = "Please enter your username";
        return;
      }
     if (username.length < 3) {
          usernameError = "Please enter your username";
          return;
       }
      if (email.isEmpty) {
      emailError = "Please enter your email";
      return;
      } 
      else if (!email.contains('@')) {
        emailError = "Please enter a valid email";
        return;
      }
      if (password.isEmpty) {
        passwordError = "Please enter your password";
        return;
      } 
      else if (password.length < 6) {
        passwordError = "Password must be at least 6 characters";
        return;
      }
      else if (password != confirmPasswordController.text){
        passwordError = "Passwords mismatch";
        return;
      }
    });

      final result = await sign_up(
        email,
        password,
        username
      );
      if (result["statusCode"] == 200) {
        context.go(
            '/otp-verify',
            extra: {'email': emailController.text, 'authToken': result["data"]["authToken"]},
          );
      } else {
        final error = result["error"];
        Map<String, dynamic> decodedError = jsonDecode(error);
        setState(() {
          if(decodedError["email"] != "")emailError = decodedError["email"];
          if(decodedError["username"] != "")usernameError = decodedError["username"];
          if(decodedError["password"] != "")passwordError = decodedError["password"];
        });
      }
    } catch (e) {
      print(e);
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
                  //Username
                  FormInput(
                    controller: usernameController,
                    labelText: 'Username',
                    prefixIcon: Icons.person_outline,
                    keyboardType: TextInputType.name,
                    error: usernameError
                  ),
                  const SizedBox(height: 16),
                  // Email
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
                    error: usernameError,
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