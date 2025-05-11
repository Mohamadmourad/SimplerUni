import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:mime/mime.dart';
import 'dart:convert';
import 'package:senior_project/functions/callApi.dart'; 

Future<String?> uploadFileToServerCrossPlatform({
  required Uint8List fileBytes,
  required String fileName,
  required String fieldName,
}) async {
  try {
    final mimeType = lookupMimeType(fileName) ?? 'application/octet-stream';
    final base64File = base64Encode(fileBytes);

    final requestBody = jsonEncode({
      'fileName': fileName,
      'fieldName': fieldName,
      'fileData': base64File,
      'mimeType': mimeType,
    });

    final response = await makeApiCall(
      'POST',
      requestBody,
      'document/uploadDocumentMobile',
      null, 
    );

    if (response['statusCode'] == 200) {
      return response['body'].toString();
    } else {
      print('Upload failed: ${response['statusCode']} - ${response['error']}');
      return null;
    }
  } catch (e) {
    print('Upload exception: $e');
    return null;
  }
}

Future<void> handleImageUpload(Function(String url) onComplete) async {
  final picker = ImagePicker();
  final pickedFile = await picker.pickImage(source: ImageSource.gallery);

  if (pickedFile != null) {
    final fileBytes = await pickedFile.readAsBytes();
    final url = await uploadFileToServerCrossPlatform(
      fileBytes: fileBytes,
      fileName: pickedFile.name,
      fieldName: 'image',
    );
    if (url != null) onComplete(url);
  }
}

Future<void> handleDocumentUpload(Function(String url) onComplete) async {
  final result = await FilePicker.platform.pickFiles();

  if (result != null && result.files.single.bytes != null) {
    final url = await uploadFileToServerCrossPlatform(
      fileBytes: result.files.single.bytes!,
      fileName: result.files.single.name,
      fieldName: 'document',
    );
    if (url != null) onComplete(url);
  }
}
