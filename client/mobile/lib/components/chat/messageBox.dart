import 'package:flutter/material.dart';
import 'package:senior_project/modules/message.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:url_launcher/url_launcher.dart';

class Messagebox extends StatelessWidget {
  final Message message;

  const Messagebox({super.key, required this.message});

  void onImageTap(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        content: Image.network(message.messageContent!),
      ),
    );
  }

  void downloadFile(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      print("Could not launch $url");
    }
  }

  String getFileExtension(String url) {
    final parts = url.split('.');
    return parts.isNotEmpty ? parts.last.split('?').first : 'unknown';
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment:
          message.isSender! ? Alignment.centerRight : Alignment.centerLeft,
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
                  : const Color(0xFF2E2E2E),
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
              width: 280,
              margin: const EdgeInsets.all(8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.insert_drive_file, color: Colors.black87),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Document",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          "Type: ${getFileExtension(message.messageContent!)}",
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.black54,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    onPressed: () => downloadFile(message.messageContent!),
                    icon: const Icon(Icons.download, color: Colors.white),
                    style: IconButton.styleFrom(
                      backgroundColor: AppColors.primaryColor,
                      padding: const EdgeInsets.all(10),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
