import 'package:senior_project/modules/user.dart';

class Message{
  String? messageId;
  String? messageContent;
  String? messageType;
  bool? isSender;
  User? user;

  Message({
    this.messageId,
    this.messageContent,
    this.messageType,
    this.isSender,
    this.user
    });
}