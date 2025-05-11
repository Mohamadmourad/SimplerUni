import 'dart:convert';
import 'package:senior_project/functions/callApi.dart';

Future<Map<String, dynamic>> sendPasswordResetEmail(String email) async {
  try {
    final requestBody = jsonEncode({'email': email});

    final response = await makeApiCall(
      'POST',
      requestBody,
      'user/sendChangePasswordLink',
      null,
    );

    if (response['statusCode'] == 200 || response['statusCode'] == 201) {
      return {
        'success': true,
        'message': 'Password reset link sent successfully!',
      };
    } else {
      String errorMessage = 'Email not found.';
      if (response['error'] != null) {
        try {
          final errorData = jsonDecode(response['error']);
          errorMessage = errorData['message'] ?? errorMessage;
        } catch (e) {
          errorMessage = response['error'] ?? errorMessage;
        }
      }
      return {'success': false, 'message': errorMessage};
    }
  } catch (e) {
    return {'success': false, 'message': 'An error occurred: ${e.toString()}'};
  }
}
