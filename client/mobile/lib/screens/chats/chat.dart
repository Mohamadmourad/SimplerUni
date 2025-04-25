import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/components/chat/messageBox.dart';
import 'package:senior_project/components/chat/uploadDialog.dart';
import 'package:senior_project/functions/chat/getMessages.dart';
import 'package:senior_project/functions/chat/sendMessage.dart';
import 'package:senior_project/functions/chat/uploadDocuments.dart';
import 'package:senior_project/modules/message.dart';
import 'package:senior_project/modules/user.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:senior_project/services/webSocket.dart';
import 'package:senior_project/theme/app_theme.dart';

class Chat extends StatefulWidget {
  final String chatroomName;
  final String chatroomId;
  const Chat({
    super.key,
    required this.chatroomName,
    required this.chatroomId
  });

  @override
  State<Chat> createState() => _ChatState();
}

class _ChatState extends State<Chat> {
  final TextEditingController messagecontroller = TextEditingController();
  final SocketService socketService = SocketService();
  bool isLoading = true;
  List<Message> messagesList = [];

    @override
  void initState(){
    super.initState();
    getData();
    socketService.connect(
      currentChatroomId:widget.chatroomId,
      addNewMessage: addMessage
    );
  }
   @override
  void dispose() {
    socketService.disconnect();
    super.dispose();
  }
  void addMessage(message){
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
          isSender: true
        );
        setState(() {
          messagesList.insert(0, msg);
        });
  }
  void handleSubmit(){
    final message = messagecontroller.text.trim();
    if (message.isNotEmpty){
    User user = Provider.of<UserProvider>(context, listen: false).currentUser!;
    messagecontroller.clear();
    sendMessage(socketService, "text", message,widget.chatroomId,user.userId);
    }
  }
  Future<void> getData() async{
    User user = Provider.of<UserProvider>(context, listen: false).currentUser!;
    var messages = await getMessages(widget.chatroomId,user,null);
    setState(() {
      messagesList = messages;
      isLoading = false;
    });
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.chatroomName),
        centerTitle: true,
      ),
      body: isLoading ? 
      Center(
        child: CircularProgressIndicator(color: AppColors.primaryColor,)
      )
      :
      Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              itemCount: messagesList.length,
              itemBuilder: (context, index) {
              return Messagebox(message: messagesList[index],);
            },)
          ),
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: messagecontroller,
                    decoration: const InputDecoration(
                      hintText: 'Type a message...',
                      contentPadding: EdgeInsets.symmetric(horizontal: 16),
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.file_present),
                  onPressed: () {
                    UploadDialog.show(
                      context,
                      onUploadImage: () async {
                      User user = Provider.of<UserProvider>(context, listen: false).currentUser!;
                      await handleImageUpload((cdnUrl) {
                        String url = jsonDecode(cdnUrl)['url'];
                        sendMessage(socketService, "image", url,widget.chatroomId,user.userId);
                      });
                    },
                    onUploadDocument: () async {
                      User user = Provider.of<UserProvider>(context, listen: false).currentUser!;
                      await handleDocumentUpload((cdnUrl) {
                        String url = jsonDecode(cdnUrl)['url'];
                        sendMessage(socketService, "document", url,widget.chatroomId,user.userId);
                      });
                    },

                    );
                  },
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send),
                  onPressed: () {
                   handleSubmit();
                  },
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
