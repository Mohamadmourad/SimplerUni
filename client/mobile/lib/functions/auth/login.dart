import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';
import 'package:senior_project/modules/user.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'dart:convert';

Future<Map<String, dynamic>> loginMethode(
  String email,
  String password, {
  required BuildContext context,
}) async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();

  final requestBody = '{"email": "$email", "password": "$password"}';

  try {
    final response = await makeApiCall('POST', requestBody, 'user/login', null);

    if (response['statusCode'] == 200) {
      final data = response['body'];
      if (data['authToken'] != null) {
        await prefs.setString('authToken', data['authToken']);
      }

      if (data["user"] != null) {
        final user = User.fromJson(data["user"]);
        Provider.of<UserProvider>(context, listen: false).setUser(user);
      }

      return {"statusCode": 200, "data": data, "error": null};
    } else if (response['statusCode'] == 201) {
      final authToken = response['body'];

      if (authToken != null) {
        String tokenStr;
        if (authToken is String) {
          tokenStr = authToken;
        } else {
          tokenStr = authToken.toString();
        }
        // Clean any quotes that might be in the token
        tokenStr = tokenStr.replaceAll('"', '');
        await prefs.setString('authToken', tokenStr);
      }

      return {"statusCode": 201, "data": null, "error": null};
    } else if (response['statusCode'] == 401) {
      final error = response['error'];
      String? authToken;

      try {
        final Map<String, dynamic> errorData =
            error is String && error.trim().startsWith('{')
                ? Map<String, dynamic>.from(jsonDecode(error))
                : {"message": error};
        authToken = errorData["authToken"];
      } catch (e) {
        // Error parsing response
      }

      if (authToken != null && authToken.isNotEmpty) {
        await prefs.setString('authToken', authToken);
      }

      return {"statusCode": 401, "data": null, "error": error};
    } else if (response['statusCode'] == 400) {
      return {"statusCode": 400, "data": null, "error": response['error']};
    }
    return {
      "statusCode": response['statusCode'],
      "data": null,
      "error": response['error'],
    };
  } catch (e) {
    // Return connection error in a safe format that won't be parsed as JSON
    return {
      "statusCode": 500,
      "data": null,
      "error": "Connection error",
      "errorDetails": e.toString(),
    };
  }
}
