import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';

Future<Map<String, dynamic>> loginMethode(
  String email,
  String password,
) async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();

  final requestBody = '{"email": "$email", "password": "$password"}';

  try {
    final response = await makeApiCall(
      'POST',
      requestBody,
      'user/login',
      null, 
    );

    if (response['statusCode'] == 200) {
      final data = response;
      await prefs.setString('authToken', data["authToken"]);
      return {
        "statusCode": 200,
        "data": data,
        "error": null,
      };
    } else if (response['statusCode'] == 204) {
      final authToken = response['body'] ?? '';
      await prefs.setString('authToken', authToken);
      return {
        "statusCode": 204,
        "data": null,
        "error": null,
      };
    } else if (response['statusCode'] == 400) {
      return {
        "statusCode": 400,
        "data": null,
        "error": response['error'],
      };
    }
    return {
      "statusCode": response['statusCode'],
      "data": null,
      "error": response['error']
    };
  } catch (e) {
    return {
      "statusCode": 500,
      "data": null,
      "error": 'Connection error',
      "message": 'Connection error: $e',
    };
  }
}
