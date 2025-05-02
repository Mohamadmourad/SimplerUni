import 'package:flutter/foundation.dart';
import 'package:senior_project/modules/user.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'package:senior_project/functions/user/get_user_data.dart';

class UserProvider with ChangeNotifier {
  User? currentUser;
  bool initialized = false;
  bool isLoading = false;

  void setUser(User user) {
    print("Setting user in provider: ${user.email}");
    currentUser = user;
    saveUserToPrefs(user);
    notifyListeners();
  }

  void clearUser() {
    print("Clearing user in provider");
    currentUser = null;
    removeUserFromPrefs();
    notifyListeners();
  }

  Future<void> saveUserToPrefs(User user) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userData = user.toJson();
      final encodedData = jsonEncode(userData);
      print("Saving user data to prefs: $encodedData");
      await prefs.setString('userData', encodedData);
    } catch (e) {
      print("Error saving user to preferences: $e");
    }
  }

  Future<void> removeUserFromPrefs() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('userData');
      print("User data removed from preferences");
    } catch (e) {
      print("Error removing user from preferences: $e");
    }
  }

  Future<void> initializeUser() async {
    try {
      isLoading = true;
      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      final userData = prefs.getString('userData');

      print(
        "Initializing user provider. User data in prefs: ${userData != null ? 'exists' : 'not found'}",
      );

      if (userData != null) {
        final decodedData = jsonDecode(userData);
        currentUser = User.fromJson(decodedData);
        print("User loaded from prefs: ${currentUser?.email}");
      } else {
        print("No user data found in preferences, trying to fetch from API...");
        await fetchUserFromAPI();
      }

      initialized = true;
      isLoading = false;
      notifyListeners();
    } catch (e) {
      print("Error initializing user: $e");
      initialized = true;
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> reloadUserFromPrefs() async {
    await initializeUser();
  }

  Future<bool> fetchUserFromAPI() async {
    try {
      isLoading = true;
      notifyListeners();

      final user = await fetchCurrentUserData();

      if (user != null) {
        currentUser = user;
        await saveUserToPrefs(user);
        print("User fetched from API and saved: ${user.email}");
        isLoading = false;
        notifyListeners();
        return true;
      } else {
        print("Could not fetch user from API");
        isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      print("Error fetching user from API: $e");
      isLoading = false;
      notifyListeners();
      return false;
    }
  }

  
}
