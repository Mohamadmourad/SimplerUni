import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String baseUrl = 'http://192.168.1.106:5000/user';

  static Future<String?> signUp(
    String email,
    String password,
    String username,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final Uri url = Uri.parse('$baseUrl/signup');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'username': username,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print('User registered successfully: ${data["message"]}');
      print('Auth token: ${data["authToken"]}');
      prefs.setString('authToken', data["authToken"]);
      return data["authToken"];
    } else {
      print('Error: ${response.statusCode}, ${response.body}');
      return null;
    }
  }

  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final Uri url = Uri.parse('$baseUrl/login');

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      print("Available here");

      Map<String, dynamic> data = {};
      if (response.body.isNotEmpty) {
        try {
          data = jsonDecode(response.body);
          print('Response data: $data');
        } catch (e) {
          return {
            'success': false,
            'message': 'Invalid JSON from server',
            'details': e.toString(),
          };
        }
      }

      print('Response status code: ${response.statusCode}');

      if (response.statusCode == 200) {
        print('Login successful: ${data["message"]}');
        final authToken = data["authToken"];
        await prefs.setString('authToken', authToken);
        return {
          'success': true,
          'token': authToken,
          'message': 'Login successful',
        };
      } else if (response.statusCode == 204) {
        // 204 responses usually have empty body
        // You might want to extract token from headers or handle differently
        final authToken = data.isNotEmpty ? data.toString() : '';
        await prefs.setString('authToken', authToken);
        return {
          'success': true,
          'token': authToken,
          'message': 'Please complete your profile',
          'requiresProfileCompletion': true,
        };
      } else if (response.statusCode == 400) {
        if (data["errors"] != null) {
          if (data["errors"]["email"] ==
              'Please verify your email before logging in.') {
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

        return {'success': false, 'message': 'Login failed: ${response.body}'};
      } else {
        return {
          'success': false,
          'message': 'Error: ${response.statusCode}',
          'details': response.body,
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

  static Future<Map<String, dynamic>> sendOtp(String email) async {
    final Uri url = Uri.parse('$baseUrl/sendotp');

    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('authToken');

    if (token == null) {
      print('No auth token found.');
      return {'success': false, 'message': 'No auth token found'};
    }

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json', 'Authorization': token},
        body: jsonEncode({'emailReceiver': email}),
      );

      if (response.statusCode == 200) {
        print('OTP sent successfully.');
        return {'success': true, 'message': 'OTP sent successfully'};
      } else {
        print('Error: ${response.statusCode}, ${response.body}');

        Map<String, dynamic> errorData = {};
        try {
          errorData = jsonDecode(response.body);
        } catch (e) {
          errorData = {'message': 'Unknown error'};
        }

        return {
          'success': false,
          'statusCode': response.statusCode,
          'message': errorData['message'] ?? 'Unknown error',
          'minutesLeft': errorData['minutesLeft'],
        };
      }
    } catch (e) {
      print('Exception occurred: $e');
      return {'success': false, 'message': 'Network error: $e'};
    }
  }

  static Future<bool> verifyOtp(String authToken, String enteredOtp) async {
    final Uri url = Uri.parse('$baseUrl/verifyotp');
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('authToken');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json', 'Authorization': token!},
      body: jsonEncode({'authToken': token, 'enteredOtp': enteredOtp}),
    );

    if (response.statusCode == 200) {
      print('OTP verified successfully.');
      return true;
    } else {
      print('Error: ${response.statusCode}, ${response.body}');
      return false;
    }
  }
}
