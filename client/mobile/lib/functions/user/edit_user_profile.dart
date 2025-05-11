import 'dart:convert';
import 'package:senior_project/functions/callApi.dart';

Future<Map<String, dynamic>> editUserProfile({
  required String authToken,
  String? username,
  String? bio,
  String? profilePicture,
  String? campusId,
  String? majorId,
}) async {
  // Only include fields that are provided
  final Map<String, dynamic> requestData = {};

  if (username != null) requestData['username'] = username;
  if (bio != null) requestData['bio'] = bio;
  if (profilePicture != null) requestData['profilePicture'] = profilePicture;
  if (campusId != null) requestData['campusId'] = campusId;
  if (majorId != null) requestData['majorId'] = majorId;

  // Only make the API call if there are fields to update
  if (requestData.isEmpty) {
    return {'success': true, 'message': 'No changes to update'};
  }

  final response = await makeApiCall(
    'POST',
    jsonEncode(requestData),
    'user/editUserProfile',
    authToken,
  );

  if (response['statusCode'] == 200 || response['statusCode'] == 201) {
    return {'success': true, 'data': response['body']};
  } else {
    return {
      'success': false,
      'message': response['error'] ?? 'Failed to update profile',
    };
  }
}
