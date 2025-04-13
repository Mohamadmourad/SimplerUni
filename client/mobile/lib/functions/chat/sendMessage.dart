Future<void> sendMessage(socketService, type, content, chatroomId) async {
  final messageData = {
    'type': type,
    'content': content,
    'userId': "87385e5a-5dae-4cf9-a3e4-c2232737e5e6",
    'chatroomId': chatroomId,
    'timestamp': DateTime.now().toIso8601String(),
  };

  socketService.sendMessage(messageData);
}
