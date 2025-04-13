import 'package:flutter/material.dart';
import 'package:senior_project/modules/message.dart';
import 'package:senior_project/theme/app_theme.dart';

class Messagebox extends StatelessWidget {
  final Message message;

  const Messagebox({super.key, required this.message});

  @override
Widget build(BuildContext context) {
  return Align(
    alignment: message.isSender! ? Alignment.centerRight : Alignment.centerLeft,
    child: Column(
      crossAxisAlignment:
          message.isSender! ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 8, right: 8),
          child: Text(
            message.user!.username!,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
            ),
          ),
        ),
        Card(
          elevation: 8,
          color: message.isSender!
              ? AppColors.primaryColor
              : AppColors.textSecondary,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Text(message.messageContent!),
          ),
        ),
      ],
    ),
  );
}

}