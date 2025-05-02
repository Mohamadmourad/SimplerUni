import 'package:senior_project/functions/callApi.dart';
import 'package:senior_project/modules/club.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

// Get clubs the user is not a member of
Future<List<Club>> getClubsUserNotIn() async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final result = await makeApiCall(
      'GET',
      null,
      'clubs/getClubsUserNotIn',
      token,
    );

    if (result['statusCode'] == 200) {
      final List<dynamic> clubsJson = result['body'];
      return clubsJson.map((json) => Club.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load clubs: ${result['error']}');
    }
  } catch (e) {
    throw Exception('Failed to load clubs: $e');
  }
}

// Get clubs the user is a member of
Future<List<Club>> getClubsUserIsIn() async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final result = await makeApiCall(
      'GET',
      null,
      'clubs/getClubsUserIsIn',
      token,
    );

    if (result['statusCode'] == 200) {
      final List<dynamic> clubsJson = result['body'];
      return clubsJson.map((json) => Club.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load clubs: ${result['error']}');
    }
  } catch (e) {
    throw Exception('Failed to load clubs: $e');
  }
}

// Make a request to create a club
Future<bool> makeClubRequest(String name, String description) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final requestBody = jsonEncode({'name': name, 'description': description});

    final result = await makeApiCall(
      'POST',
      requestBody,
      'clubs/makeClubRequest',
      token,
    );

    return result['statusCode'] == 200;
  } catch (e) {
    throw Exception('Failed to create club request: $e');
  }
}

// Request to join a club
Future<bool> requestJoinClub(String chatroomId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final requestBody = jsonEncode({'chatroomId': chatroomId});

    final result = await makeApiCall(
      'POST',
      requestBody,
      'clubs/requestJoinClub',
      token,
    );

    return result['statusCode'] == 200;
  } catch (e) {
    throw Exception('Failed to request club join: $e');
  }
}

// Accept a request to join a club
Future<bool> acceptJoinRequest(String userId, String chatroomId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final requestBody = jsonEncode({
      'userId': userId,
      'chatroomId': chatroomId,
    });

    final result = await makeApiCall(
      'POST',
      requestBody,
      'clubs/acceptJoinRequest',
      token,
    );

    return result['statusCode'] == 200;
  } catch (e) {
    throw Exception('Failed to accept join request: $e');
  }
}

// Reject a request to join a club
Future<bool> rejectJoinRequest(String userId, String chatroomId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final requestBody = jsonEncode({
      'userId': userId,
      'chatroomId': chatroomId,
    });

    final result = await makeApiCall(
      'POST',
      requestBody,
      'clubs/rejectJoinRequest',
      token,
    );

    return result['statusCode'] == 200;
  } catch (e) {
    throw Exception('Failed to reject join request: $e');
  }
}
