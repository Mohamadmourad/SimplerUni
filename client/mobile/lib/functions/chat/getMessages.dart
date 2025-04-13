import 'dart:convert';

import 'package:senior_project/functions/callApi.dart';
import 'package:senior_project/modules/message.dart';
import 'package:senior_project/modules/user.dart';

Future<List<Message>> getMessages(
  String chatroomId,
  String? before
) async {
  final Map<String, dynamic> requestBody = {
    "chatroomId": chatroomId,
  };
  if (before != null) {
    requestBody["before"] = before;
  }
  try {
    final response = await makeApiCall(
      'POST',
      jsonEncode(requestBody),
      'chat/getMessages',
      null, 
    );
    if (response['statusCode'] == 200) {
      List<Message> messagesList = [];
     final List<dynamic> data = response['body'];
      for (var message in data) {
        User user = User(
          userId: message['userid'],
          username: message['username'],
          email: message['email'],
          isEmailVerified: message['isemailverified'],
          isStudent: message['isstudent'],
          bio: message['bio'],
          profilePicture: message['profilepicture'],
          startingUniYear: message['startinguniyear'],
          createdAt: message['created_at'] != null ? DateTime.parse(message['created_at']) : null,
        );
        Message msg = Message(
          messageId: message["messageId"],
          messageContent: message["content"],
          messageType: message["type"],
          user: user,
          isSender: true,
          sendedAt: message['created_at']
        );
        messagesList.add(msg);
      }
      return messagesList;
    } 
    return [];
  } catch (e) {
    return [];
  }
}
