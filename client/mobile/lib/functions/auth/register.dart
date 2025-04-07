import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';

Future<String?> sign_up(
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
    null, // No auth token needed for signup
  );

  if (response['statusCode'] == 200) {
    final data = response['body'];
    print('User registered successfully: ${data["message"]}');
    print('Auth token: ${data["authToken"]}');
    await prefs.setString('authToken', data["authToken"]);
    return data["authToken"];
  } else {
    print('Error: ${response['statusCode']}, ${response['error']}');
    return null;
  }
}