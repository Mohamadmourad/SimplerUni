import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String baseUrl = 'http://192.168.1.104:5000/user';

  static Future<String?> signUp(
    String email,
    String password,
    String username,
  ) async {
    
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final Uri url = Uri.parse('$baseUrl/signup');

    final response = await http.post(
      url,
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

  static Future<String?> login(String email, String password) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final Uri url = Uri.parse('$baseUrl/login');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print('Login successful: ${data["message"]}');
      prefs.setString('authToken', data["authToken"]);
      return data["authToken"];
    } else if (response.statusCode == 400) {
      print('Invalid credentials.');
    } else {
      print('Error: ${response.statusCode}, ${response.body}');
    }
    return null;
  }

  static Future<bool> sendOtp(String email, String authToken) async {
    final Uri url = Uri.parse('$baseUrl/sendotp');
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('authToken');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'emailReceiver': email, 'authToken': token}),
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
    final Uri url = Uri.parse('$baseUrl/verifyotp');
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('authToken');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
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
