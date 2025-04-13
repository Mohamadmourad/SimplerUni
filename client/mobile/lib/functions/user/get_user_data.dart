import 'package:senior_project/functions/callApi.dart';
import 'package:senior_project/modules/user.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

Future<User?> fetchCurrentUserData() async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final authToken = prefs.getString('authToken');

    if (authToken == null || authToken.isEmpty) {
      print("No auth token found, cannot fetch user data");
      return null;
    }

    print("Fetching user data with auth token");
    final response = await makeApiCall('GET', null, 'user/getUser', authToken);

    if (response['statusCode'] == 200 && response['body'] != null) {
      print("User data fetched successfully: ${response['body']}");

      final responseBody = response['body'];
      Map<String, dynamic> userData;

      if (responseBody is Map<String, dynamic>) {
        userData = responseBody;
      } else if (responseBody is String) {
        userData = jsonDecode(responseBody);
      } else {
        print("Unexpected response type: ${responseBody.runtimeType}");
        return null;
      }
      print("MEOWWWWWWWWWWW: $userData");
      User user = User(
        userId: userData['userid']?.toString(),
        username: userData['username'],
        email: userData['email'],
        isEmailVerified: userData['isemailverified'] ?? false,
        isStudent: userData['isstudent'] ?? false,
        bio: userData['bio'],
        profilePicture: userData['profilepicture'],
        startingUniYear: userData['startinguniyear'],
        createdAt:
            userData['created_at'] != null
                ? DateTime.parse(userData['created_at'])
                : null,
        universityId: userData['universityid']?.toString(),
        campusId: userData['campusid']?.toString(),
        majorId: userData['majorid']?.toString(),
      );

      print("Created user object: $user");
      return user;
    } else {
      print("Failed to fetch user data: ${response['error']}");
      return null;
    }
  } catch (e) {
    print("Error fetching user data: $e");
    return null;
  }
}
