import 'dart:convert';
import 'package:senior_project/functions/callApi.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<String?> getAuthToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('authToken');
}

Future<List<dynamic>> getQuestions(String type) async {
  final authToken = await getAuthToken();
  if (authToken == null) {
    throw Exception('Authentication token not found');
  }

  final response = await makeApiCall(
    'GET',
    null,
    'questions/getQuestions/$type',
    authToken,
  );

  if (response['statusCode'] == 200) {
    return response['body'];
  } else {
    throw Exception(response['error'] ?? 'Failed to load questions');
  }
}

Future<List<dynamic>> getAnswersForQuestion(String questionId) async {
  final authToken = await getAuthToken();
  if (authToken == null) {
    throw Exception('Authentication token not found');
  }

  try {
    final response = await makeApiCall(
      'GET',
      null,
      'questions/getAnswers/$questionId',
      authToken,
    );
    print("questionId: $questionId");

    if (response['statusCode'] == 200) {
      return response['body'];
    } else {
      print('Error fetching answers: ${response['error']}');
      return [];
    }
  } catch (e) {
    print('Exception while fetching answers: $e');
    return [];
  }
}

Future<Map<String, dynamic>> addQuestion(
  String title,
  String content,
  List<String> tags,
) async {
  final authToken = await getAuthToken();
  if (authToken == null) {
    throw Exception('Authentication token not found');
  }

  final body = {'title': title, 'content': content, 'tags': tags};

  final jsonBody = jsonEncode(body);

  final response = await makeApiCall(
    'POST',
    jsonBody,
    'questions/addQuestion',
    authToken,
  );

  if (response['statusCode'] == 201) {
    return response['body'];
  } else {
    throw Exception(response['error'] ?? 'Failed to add question');
  }
}

Future<Map<String, dynamic>> upvoteQuestion(String questionId) async {
  final authToken = await getAuthToken();
  if (authToken == null) {
    throw Exception('Authentication token not found');
  }

  final body = {'questionId': questionId};

  final jsonBody = jsonEncode(body);

  final response = await makeApiCall(
    'POST',
    jsonBody,
    'questions/upvoteQuestion',
    authToken,
  );

  if (response['statusCode'] == 201) {
    return response['body'];
  } else {
    throw Exception(response['error'] ?? 'Failed to upvote question');
  }
}

Future<String> answerQuestion(String questionId, String content) async {
  final authToken = await getAuthToken();
  if (authToken == null) {
    throw Exception('Authentication token not found');
  }

  final body = {'questionId': questionId, 'content': content};

  final jsonBody = jsonEncode(body);

  final response = await makeApiCall(
    'POST',
    jsonBody,
    'questions/answerQuestion',
    authToken,
  );

  if (response['statusCode'] == 200) {
    return response['body'];
  } else {
    throw Exception(response['error'] ?? 'Failed to answer question');
  }
}

Future<String> deleteQuestion(String questionId) async {
  final authToken = await getAuthToken();
  if (authToken == null) {
    throw Exception('Authentication token not found');
  }

  final response = await makeApiCall(
    'DELETE',
    null,
    'questions/deleteQuestion/$questionId',
    authToken,
  );

  if (response['statusCode'] == 200) {
    return 'Question deleted successfully';
  } else {
    throw Exception(response['error'] ?? 'Failed to delete question');
  }
}

Future<String> removeUpvoteFromQuestion(String questionId) async {
  final authToken = await getAuthToken();
  if (authToken == null) {
    throw Exception('Authentication token not found');
  }

  final response = await makeApiCall(
    'DELETE',
    null,
    'questions/removeUpvoteFromQuestion/$questionId',
    authToken,
  );

  if (response['statusCode'] == 200) {
    return 'Upvote removed successfully';
  } else {
    throw Exception(response['error'] ?? 'Failed to remove upvote');
  }
}
