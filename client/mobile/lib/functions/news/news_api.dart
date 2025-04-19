import 'package:senior_project/functions/callApi.dart';
import 'package:senior_project/modules/news.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<String?> getAuthToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('authToken');
}

Future<List<News>> getNews() async {
  final authToken = await getAuthToken();
  if (authToken == null) {
    throw Exception('Authentication token not found');
  }

  final response = await makeApiCall(
    'GET',
    null,
    'news/getNewsForMobile',
    authToken,
  );

  if (response['statusCode'] == 200) {
    final List<dynamic> newsData = response['body'];
    return newsData.map((news) => News.fromJson(news)).toList();
  } else {
    throw Exception(response['error'] ?? 'Failed to load news');
  }
}
