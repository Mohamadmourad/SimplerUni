import 'package:senior_project/modules/user_profile.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';

Future<UserProfile?> getUserProfileData(String userId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      print('No auth token found');
      return null;
    }

    final response = await makeApiCall(
      'GET',
      null,
      'user/getUserAccountInfo/$userId',
      token,
    );

    if (response['statusCode'] == 200) {
      final data = response['body'];
      return UserProfile.fromJson(data);
    } else {
      print('Error fetching user profile: ${response['statusCode']}');
      print('Response error: ${response['error']}');
      return null;
    }
  } catch (e) {
    print('Exception while fetching user profile: $e');
    return null;
  }
}
