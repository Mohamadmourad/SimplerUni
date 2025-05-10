import 'package:senior_project/functions/callApi.dart';
import 'package:senior_project/modules/club.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

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

Future<List<Club>> getAdminClubList() async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final result = await makeApiCall(
      'GET',
      null,
      'clubs/getAdminClubList',
      token,
    );

    if (result['statusCode'] == 200) {
      final List<dynamic> clubsJson = result['body'];
      return clubsJson.map((json) => Club.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load admin clubs: ${result['error']}');
    }
  } catch (e) {
    throw Exception('Failed to load admin clubs: $e');
  }
}

Future<List<Club>> getUnderReviewClubs() async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final result = await makeApiCall(
      'GET',
      null,
      'clubs/underReviewClubs',
      token,
    );

    if (result['statusCode'] == 200) {
      final List<dynamic> clubsJson = result['body'];
      print(result);
      return clubsJson.map((json) => Club.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load clubs under review: ${result['error']}');
    }
  } catch (e) {
    throw Exception('Failed to load clubs under review: $e');
  }
}

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

Future<bool> requestJoinClub(String clubId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }
    print("club id" + clubId);
    final requestBody = jsonEncode({'clubId': clubId});

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

Future<bool> acceptJoinRequest(String userId, String clubId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final requestBody = jsonEncode({'userId': userId, 'clubId': clubId});

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

Future<bool> rejectJoinRequest(String userId, String clubId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final requestBody = jsonEncode({'userId': userId, 'clubId': clubId});

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

Future<List<dynamic>> getClubJoinRequests(String clubId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final result = await makeApiCall(
      'GET',
      null,
      'clubs/getClubJoinRequests/$clubId',
      token,
    );
    print(result);
    if (result['statusCode'] == 200) {
      return result['body'] as List<dynamic>;
    } else {
      throw Exception('Failed to load join requests: ${result['error']}');
    }
  } catch (e) {
    throw Exception('Failed to load join requests: $e');
  }
}

Future<Map<String, dynamic>> getClubInfo(String clubId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final result = await makeApiCall(
      'GET',
      null,
      'clubs/getClubInfo/$clubId',
      token,
    );
    print(result);
    if (result['statusCode'] == 200) {
      return result['body'] as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load club information: ${result['error']}');
    }
  } catch (e) {
    throw Exception('Failed to load club information: $e');
  }
}

Future<bool> removeStudentFromClub(String clubId, String userId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final result = await makeApiCall(
      'DELETE',
      null,
      'clubs/removerStudentFromClub/$clubId/$userId',
      token,
    );

    return result['statusCode'] == 200;
  } catch (e) {
    throw Exception('Failed to remove student from club: $e');
  }
}

Future<bool> removeJoinClubRequest(String clubId) async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? token = prefs.getString('authToken');

    if (token == null) {
      throw Exception('No authentication token found');
    }

    final result = await makeApiCall(
      'DELETE',
      null,
      'clubs/removeJoinClubRequest/$clubId',
      token,
    );

    return result['statusCode'] == 200;
  } catch (e) {
    throw Exception('Failed to remove join request: $e');
  }
}
