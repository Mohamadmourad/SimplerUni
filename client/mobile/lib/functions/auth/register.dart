import 'package:senior_project/functions/callApi.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/modules/user.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:flutter/material.dart';

Future<Map<String, dynamic>> sign_up(
  String email,
  String password,
  String username, {
  required BuildContext context,
}) async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();

  final requestBody =
      '{"email": "$email", "password": "$password", "username": "$username"}';

  final response = await makeApiCall('POST', requestBody, 'user/signup', null);

  if (response['statusCode'] == 200) {
    final data = response['body'];
    await prefs.setString('authToken', data["authToken"]);

    if (data["user"] != null) {
      final user = User.fromJson(data["user"]);
      Provider.of<UserProvider>(context, listen: false).setUser(user);
    }

    return {"statusCode": 200, "data": data, "error": null};
  } else {
    return {
      "statusCode": response['statusCode'],
      "data": null,
      "error": response['error'],
    };
  }
}
