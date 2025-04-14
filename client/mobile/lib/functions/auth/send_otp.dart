import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';

Future<Map<String, dynamic>> sendOtp(String email) async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('authToken');

  if (token == null) {
    return {'success': false, 'message': 'No auth token found'};
  }

  try {
    final requestBody = '{"emailReceiver": "$email"}';
    
    final response = await makeApiCall(
      'POST',
      requestBody,
      'user/sendotp',
      token,
    );

    if (response['statusCode'] == 200) {
      return {'success': true, 'message': 'OTP sent successfully'};
    } else {
      Map<String, dynamic> errorData = {};
      try {
        if (response['error'] is String) {
          try {
            errorData = jsonDecode(response['error']);
          } catch (e) {
            errorData = {'message': response['error']};
          }
        } else if (response['error'] is Map) {
          errorData = response['error'];
        } else {
          errorData = {'message': 'Unknown error'};
        }
      } catch (e) {
        errorData = {'message': 'Unknown error'};
      }

      return {
        'success': false,
        'statusCode': response['statusCode'],
        'message': errorData['message'] ?? 'Unknown error',
        'minutesLeft': errorData['minutesLeft'],
      };
    }
  } catch (e) {
    return {'success': false, 'message': 'Network error: $e'};
  }
}