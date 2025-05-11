import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/components/chat/messageBox.dart';
import 'package:senior_project/components/chat/uploadDialog.dart';
import 'package:senior_project/functions/chat/getMessages.dart';
import 'package:senior_project/functions/chat/sendMessage.dart';
import 'package:senior_project/functions/chat/uploadDocuments.dart';
import 'package:senior_project/modules/message.dart';
import 'package:senior_project/providers/chatroomProvider.dart';
import 'package:senior_project/providers/user_provider.dart';
import 'package:senior_project/services/webSocket.dart';
import 'package:senior_project/theme/app_theme.dart';

class Chat extends StatefulWidget {
  final String chatroomName;
  final String chatroomId;

  const Chat({
    super.key,
    required this.chatroomName,
    required this.chatroomId,
  });

  @override
  State<Chat> createState() => _ChatState();
}

class _ChatState extends State<Chat> {
  final TextEditingController messagecontroller = TextEditingController();
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    final chatroomProvider = Provider.of<ChatroomProvider>(context, listen: false);
    final socketService = Provider.of<SocketService>(context, listen: false);
    final currentUser = Provider.of<UserProvider>(context, listen: false).currentUser!;

    chatroomProvider.setChatroomId(widget.chatroomId);
    getData();
    socketService.connect(chatroomProvider: chatroomProvider, currentUser: currentUser);
  }

  @override
  void dispose() {
    final chatroomProvider = Provider.of<ChatroomProvider>(context, listen: false);
    final socketService = Provider.of<SocketService>(context, listen: false);

    chatroomProvider.clearChatroomId();
    socketService.disconnect();
    super.dispose();
  }

  void handleSubmit() {
    final message = messagecontroller.text.trim();
    if (message.isNotEmpty) {
      final user = Provider.of<UserProvider>(context, listen: false).currentUser!;
      final socketService = Provider.of<SocketService>(context, listen: false);
      messagecontroller.clear();
      sendMessage(socketService, "text", message, widget.chatroomId, user.userId);
    }
  }

  Future<void> getData() async {
    final user = Provider.of<UserProvider>(context, listen: false).currentUser!;
    final chatroomProvider = Provider.of<ChatroomProvider>(context, listen: false);
    List<Message> messages = await getMessages(widget.chatroomId, user, null);
    chatroomProvider.messageList = messages;
    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final chatroomProvider = Provider.of<ChatroomProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.chatroomName),
        centerTitle: true,
      ),
      body: isLoading
          ? Center(child: CircularProgressIndicator(color: AppColors.primaryColor))
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    reverse: true,
                    itemCount: chatroomProvider.messageList.length,
                    itemBuilder: (context, index) {
                      return Messagebox(message: chatroomProvider.messageList[index]);
                    },
                  ),
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
                          final socketService = Provider.of<SocketService>(context, listen: false);
                          final user = Provider.of<UserProvider>(context, listen: false).currentUser!;

                          UploadDialog.show(
                            context,
                            onUploadImage: () async {
                              await handleImageUpload((cdnUrl) {
                                String url = jsonDecode(cdnUrl)['url'];
                                sendMessage(socketService, "image", url, widget.chatroomId, user.userId);
                              });
                            },
                            onUploadDocument: () async {
                              await handleDocumentUpload((cdnUrl) {
                                String url = jsonDecode(cdnUrl)['url'];
                                sendMessage(socketService, "document", url, widget.chatroomId, user.userId);
                              });
                            },
                          );
                        },
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.send),
                        onPressed: handleSubmit,
                      ),
                    ],
                  ),
                ),
              ],
            ),
    );
  }
}
