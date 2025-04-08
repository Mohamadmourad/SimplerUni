import 'package:flutter/foundation.dart';
import 'package:senior_project/modules/user.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class UserProvider with ChangeNotifier {
  User? _currentUser;

  User? get currentUser => _currentUser;

  void setUser(User user) {
    _currentUser = user;
    _saveUserToPrefs(user);
    notifyListeners();
  }

  void clearUser() {
    _currentUser = null;
    _removeUserFromPrefs();
    notifyListeners();
  }

  Future<void> _saveUserToPrefs(User user) async {
    final prefs = await SharedPreferences.getInstance();
    final userData = {
      'userId': user.userId,
      'username': user.username,
      'email': user.email,
      'isEmailVerified': user.isEmailVerified,
      'isStudent': user.isStudent,
      'bio': user.bio,
      'profilePicture': user.profilePicture,
      'startingUniYear': user.startingUniYear,
    };
    await prefs.setString('userData', jsonEncode(userData));
  }

  Future<void> _removeUserFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('userData');
  }

  Future<void> initializeUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('userData');

    if (userData != null) {
      _currentUser = User.fromJson(jsonDecode(userData));
      notifyListeners();
    }
  }
}
