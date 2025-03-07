import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  static const String _baseUrl = 'http://localhost:5000/auth';

 
  static Future<String?> signUp(
    String email,
    String password,
    String username,
  ) async {
    final Uri url = Uri.parse('$_baseUrl/signup');

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
      return data["authToken"];
    } else {
      print('Error: ${response.statusCode}, ${response.body}');
      return null;
    }
  }

  static Future<String?> login(String email, String password) async {
    final Uri url = Uri.parse('$_baseUrl/login');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print('Login successful: ${data["message"]}');
      return data["authToken"];
    } else if (response.statusCode == 400) {
      print('Invalid credentials.');
    } else {
      print('Error: ${response.statusCode}, ${response.body}');
    }
    return null;
  }
  static Future<bool> sendOtp(String email, String authToken) async {
    final Uri url = Uri.parse('$_baseUrl/sendotp');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'emailReceiver': email, 'authToken': authToken}),
    );

    if (response.statusCode == 200) {
      print('OTP sent successfully.');
      return true;
    } else {
      print('Error: ${response.statusCode}, ${response.body}');
      return false;
    }
  }

  static Future<bool> verifyOtp(String authToken, String enteredOtp) async {
    final Uri url = Uri.parse('$_baseUrl/verifyotp');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'authToken': authToken, 'enteredOtp': enteredOtp}),
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
