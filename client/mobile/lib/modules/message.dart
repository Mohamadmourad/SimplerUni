import 'package:senior_project/modules/user.dart';

class Message{
  String? messageId;
  String? messageContent;
  String? messageType;
  bool? isSender;
  String?sendedAt; 
  User? user;

  Message({
    this.messageId,
    this.messageContent,
    this.messageType,
    this.isSender,
    this.user,
    this.sendedAt
    });

  @override
  String toString() {
    return '$messageContent ||| $sendedAt';
  }
}