import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:senior_project/functions/chat/get_user_chatrooms.dart';
import 'package:senior_project/modules/user.dart';
import 'package:senior_project/theme/app_theme.dart';
import 'package:provider/provider.dart';
import 'package:senior_project/providers/user_provider.dart';

class ChatsPage extends StatefulWidget {
  const ChatsPage({super.key});

  @override
  State<ChatsPage> createState() => ChatsPageState();
}

class ChatsPageState extends State<ChatsPage> {
  List<Chatroom> chatrooms = [];
  bool isLoading = true;
  String? errorMessage;

  @override
  void initState() {
    super.initState();
    loadChatrooms();

    // Safely access user without non-null assertion
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final User? user = userProvider.currentUser;

      if (user != null) {
        print("Chat page loaded for user: ${user.username}");
      } else {
        print("Chat page loaded but no user is logged in");
      }
    });
  }

  Future<void> loadChatrooms() async {
    try {
      setState(() {
        isLoading = true;
        errorMessage = null;
      });

      final loadedChatrooms = await getUserChatrooms();

      setState(() {
        chatrooms = loadedChatrooms;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chatrooms'), elevation: 0),
      body: buildBody(),
    );
  }

  Widget buildBody() {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (errorMessage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.error_outline,
              size: 48,
              color: AppColors.errorColor,
            ),
            const SizedBox(height: 16),
            Text(
              'Error loading chats',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              errorMessage!,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: loadChatrooms,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (chatrooms.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.chat_bubble_outline,
              size: 64,
              color: Colors.white54,
            ),
            const SizedBox(height: 24),
            const Text(
              'No chatrooms yet',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Your conversations will appear here',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: loadChatrooms,
      color: AppColors.primaryColor,
      child: ListView.builder(
        padding: const EdgeInsets.only(top: 8, bottom: 80),
        itemCount: chatrooms.length,
        itemBuilder: (context, index) {
          final chatroom = chatrooms[index];
          return buildChatroomItem(chatroom);
        },
      ),
    );
  }

  Widget buildChatroomItem(Chatroom chatroom) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: AppColors.primaryColor,
          child: Text(
            chatroom.name.isNotEmpty ? chatroom.name[0].toUpperCase() : '?',
            style: const TextStyle(color: Colors.white),
          ),
        ),
        title: Text(chatroom.name),
        onTap: () {
          context.push('/chat/${chatroom.name}/${chatroom.chatroomId}');
        },
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      ),
    );
  }
}
