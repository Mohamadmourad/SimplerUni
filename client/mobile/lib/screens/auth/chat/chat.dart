import 'package:flutter/material.dart';
import 'package:senior_project/components/chat/messageBox.dart';
import 'package:senior_project/functions/chat/getMessages.dart';
import 'package:senior_project/modules/message.dart';
import 'package:senior_project/modules/user.dart';

class Chat extends StatefulWidget {
  const Chat({super.key});

  @override
  State<Chat> createState() => _ChatState();
}

class _ChatState extends State<Chat> {
  final TextEditingController messagecontroller = TextEditingController();
  List<Message> messagesList = [];

    @override
  void initState(){
    super.initState();
    getData();
  }

  Future<void> getData()async{
    var messages = await getMessages("574c8e93-3184-4662-9fc0-8544cbf396b8");
    setState(() {
      messagesList = messages;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
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
                  icon: const Icon(Icons.send),
                  onPressed: () {
                    messagecontroller.clear();
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
