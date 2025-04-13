import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:senior_project/functions/callApi.dart';

Future<Map<String, dynamic>> completeUserProfile(
  String majorId,
  String campusId, {
  required Map<String, dynamic> optionalData,
}) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? authToken = prefs.getString('authToken');

    if (authToken == null) {
      return {
        'success': false,
        'message': 'No authentication token found. Please login again.',
      };
    }

    final Map<String, dynamic> payload = {
      'majorId': majorId,
      'campusId': campusId,
      'optionalData': optionalData,
    };

    final response = await makeApiCall(
      'POST',
      jsonEncode(payload),
      'user/addAdditionalUserData',
      authToken,
    );

    if (response['statusCode'] == 200 || response['statusCode'] == 201) {
      return {'success': true, 'message': 'Profile completed successfully!'};
    } else {
      String errorMessage = 'Failed to complete profile.';
      if (response['error'] != null) {
        try {
          final errorData = jsonDecode(response['error']);
          errorMessage = errorData['message'] ?? errorMessage;
        } catch (e) {
          errorMessage = response['error'] ?? errorMessage;
        }
      }
      return {'success': false, 'message': errorMessage};
    }
  } catch (e) {
    return {'success': false, 'message': 'An error occurred: ${e.toString()}'};
  }
}

Future<List<Map<String, dynamic>>> fetchMajors() async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  final authToken = prefs.getString('authToken') ?? '';

  if (authToken.isEmpty) {
    throw Exception("Not authenticated");
  }

  try {
    final response = await makeApiCall(
      'GET',
      null,
      'university/getAllMajors',
      authToken,
    );

    if (response['statusCode'] == 200 && response['body'] != null) {
      // Fix for proper data extraction - the API returns an object with a "data" property
      if (response['body'] is Map && response['body']['data'] != null) {
        List<dynamic> majorsData = response['body']['data'];
        return List<Map<String, dynamic>>.from(majorsData);
      } else {
        throw Exception("Invalid response format for majors");
      }
    } else {
      throw Exception(response['error'] ?? "Failed to fetch majors");
    }
  } catch (e) {
    throw Exception("Error fetching majors: ${e.toString()}");
  }
}

Future<List<Map<String, dynamic>>> fetchCampuses() async {
  final SharedPreferences prefs = await SharedPreferences.getInstance();
  final authToken = prefs.getString('authToken') ?? '';

  if (authToken.isEmpty) {
    throw Exception("Not authenticated");
  }

  try {
    final response = await makeApiCall(
      'GET',
      null,
      'university/getAllCampsus',
      authToken,
    );

    if (response['statusCode'] == 200 && response['body'] != null) {
      // Fix for proper data extraction - the API returns an object with a "data" property
      if (response['body'] is Map && response['body']['data'] != null) {
        List<dynamic> campusesData = response['body']['data'];
        return List<Map<String, dynamic>>.from(campusesData);
      } else {
        throw Exception("Invalid response format for campuses");
      }
    } else {
      throw Exception(response['error'] ?? "Failed to fetch campuses");
    }
  } catch (e) {
    throw Exception("Error fetching campuses: ${e.toString()}");
  }
}
