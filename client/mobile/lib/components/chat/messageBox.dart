import 'package:flutter/material.dart';
import 'package:senior_project/modules/message.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:http/http.dart' as http;



class Messagebox extends StatelessWidget {
  final Message message;

  const Messagebox({super.key, required this.message});

  void onImageTap(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        content: Image.network(message.messageContent!),
      ),
    );
  }

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
          const SizedBox(height: 4),
          if (message.messageType == "text")
            Card(
              elevation: 8,
              color: message.isSender!
                  ? AppColors.primaryColor
                  : Color(0xFF2E2E2E),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(
                  message.messageContent!,
                  style: const TextStyle(color: Colors.white),
                ),
              ),
            )
          else if (message.messageType == "image")
            GestureDetector(
              onTap: () => onImageTap(context),
              child: Container(
                width: 200,
                height: 200,
                margin: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  image: DecorationImage(
                    image: NetworkImage(message.messageContent!),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            )
          else if (message.messageType == "document")
            Container(
              width: 250,
              margin: const EdgeInsets.all(8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: const [
                  Icon(Icons.insert_drive_file, color: Colors.black87),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Document",
                      style: TextStyle(color: Colors.black87),
                    ),
                  ),
                ],
              ),
            )
        ],
      ),
    );
  }
}
