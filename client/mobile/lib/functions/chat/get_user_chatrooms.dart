import 'package:shared_preferences/shared_preferences.dart';
import '../callApi.dart';

class Chatroom {
  final String chatroomId;
  final String name;
  final String createdAt;

  Chatroom({
    required this.chatroomId,
    required this.name,
    required this.createdAt,
  });

  factory Chatroom.fromJson(Map<String, dynamic> json) {
    return Chatroom(
      chatroomId: json['chatroomid']?.toString() ?? '',
      name: json['name'] ?? 'Unnamed Chat',
      createdAt: json['created_at'] ?? '',
    );
  }
}

Future<List<Chatroom>> getUserChatrooms() async {
  try {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    final String? authToken = prefs.getString('authToken');

    if (authToken == null) {
      throw Exception('No auth token found');
    }

    final response = await makeApiCall(
      'GET',
      null,
      'chat/getUserChatrooms',
      authToken,
    );

    if (response['error'] != null) {
      throw Exception('Failed to load chatrooms: ${response['error']}');
    }

    final List<dynamic> chatroomsJson = response['body'] as List<dynamic>;
    return chatroomsJson.map((json) => Chatroom.fromJson(json)).toList();
  } catch (e) {
    throw Exception('Failed to load chatrooms: $e');
  }
}
