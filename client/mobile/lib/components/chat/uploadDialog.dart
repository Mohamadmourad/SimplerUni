import 'package:flutter/material.dart';

class UploadDialog {
  static Future<void> show(BuildContext context, {
    required VoidCallback onUploadImage,
    required VoidCallback onUploadDocument,
  }) {
    return showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Upload File"),
          content: const Text("Choose a file type to upload:"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                onUploadImage();
              },
              child: const Text("Upload Image"),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                onUploadDocument();
              },
              child: const Text("Upload Document"),
            ),
          ],
        );
      },
    );
  }
}
