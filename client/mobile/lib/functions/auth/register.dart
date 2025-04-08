import 'dart:convert';
import 'package:senior_project/functions/callApi.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<Map<String, dynamic>> sign_up(
  String email,
  String password,
  String username,
) async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();

  final requestBody = '{"email": "$email", "password": "$password", "username": "$username"}';

  final response = await makeApiCall(
    'POST',
    requestBody,
    'user/signup',
    null,
  );

  if (response['statusCode'] == 200) {
    final data = response['body'];
    await prefs.setString('authToken', data["authToken"]);
    return {
      "statusCode": 200,
      "data": data,
      "error": null,
    };
  } else {
    return {
      "statusCode": response['statusCode'],
      "data": null,
      "error": response['error'],
    };
  }
}
