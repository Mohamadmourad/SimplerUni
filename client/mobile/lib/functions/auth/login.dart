import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';

Future<Map<String, dynamic>> login(
  String email,
  String password,
) async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  
  try {
    final requestBody = '{"email": "$email", "password": "$password"}';
    
    final response = await makeApiCall(
      'POST',
      requestBody,
      'user/login',
      null, // No auth token needed for login
    );

    print("Available here");
    
    if (response['statusCode'] == 200) {
      final data = response['body'];
      print('Login successful: ${data["message"]}');
      final authToken = data["authToken"];
      await prefs.setString('authToken', authToken);
      return {
        'success': true,
        'token': authToken,
        'message': 'Login successful',
      };
    } else if (response['statusCode'] == 204) {
      // 204 responses usually have empty body
      final data = response['body'] ?? {};
      final authToken = data.isNotEmpty ? data.toString() : '';
      await prefs.setString('authToken', authToken);
      return {
        'success': true,
        'token': authToken,
        'message': 'Please complete your profile',
        'requiresProfileCompletion': true,
      };
    } else if (response['statusCode'] == 400) {
      final data = response['error'] != null ? 
                   (response['error'] is String ? 
                     {"errors": {"message": response['error']}} : 
                     response['error']) : 
                   {};
      
      if (data["errors"] != null) {
        if (data["errors"]["email"] == 'Please verify your email before logging in.') {
          final authToken = data["errors"]["authToken"];
          await prefs.setString('authToken', authToken);
          return {
            'success': false,
            'message': 'Please verify your email before logging in',
            'token': authToken,
            'requiresEmailVerification': true,
          };
        } else if (data["errors"]["email"] != null) {
          return {
            'success': false,
            'message': data["errors"]["email"],
            'field': 'email',
          };
        } else if (data["errors"]["password"] != null) {
          return {
            'success': false,
            'message': data["errors"]["password"],
            'field': 'password',
          };
        }
      }
      
      return {
        'success': false,
        'message': 'Login failed: ${response['error']}',
      };
    } else {
      return {
        'success': false,
        'message': 'Error: ${response['statusCode']}',
        'details': response['error'],
      };
    }
  } catch (e) {
    print('Exception during login: $e');
    return {
      'success': false,
      'message': 'Connection error',
      'details': e.toString(),
    };
  }
}