import 'package:flutter/foundation.dart';
import 'package:senior_project/modules/message.dart';
import 'package:senior_project/modules/user.dart';

class ChatroomProvider with ChangeNotifier {
  String? _currentChatroomId = "";
  List<Message> messageList = [];

  String? get currentChatroomId => _currentChatroomId;

  void setChatroomId(String chatroomId) {
    if (_currentChatroomId != chatroomId) {
      _currentChatroomId = chatroomId;
      notifyListeners();
    }
  }

  void clearChatroomId() {
    _currentChatroomId = null;
    notifyListeners();
  }

  void addMessage(Map<String, dynamic> message,  User currentUser) {
    if (message == null || !message.containsKey('chatroomId')) {
      print('Invalid message data: $message');
      return;
    }

    if (message['chatroomId'] != _currentChatroomId) {
      return;
    }

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
      isSender: message['userid'] == currentUser.userId,
    );

    messageList.insert(0, msg);
    notifyListeners(); 
  }
}
