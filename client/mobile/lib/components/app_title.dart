import 'package:flutter/material.dart';
import 'package:senior_project/theme/app_theme.dart';

class AppTitle extends StatelessWidget {
  final String text;

  const AppTitle({
    super.key,
    required this.text,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      textAlign: TextAlign.center,
      style: const TextStyle(
        fontSize: 50,
        fontWeight: FontWeight.bold,
        color: AppColors.primaryColor,
      ),
    );
  }
}