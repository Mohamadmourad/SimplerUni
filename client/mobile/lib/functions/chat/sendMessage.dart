Future<void> sendMessage(socketService, type, content, chatroomId,userId) async {
  final messageData = {
    'type': type,
    'content': content,
    'userId': userId,
    'chatroomId': chatroomId,
    'timestamp': DateTime.now().toIso8601String(),
  };

  socketService.sendMessage(messageData);
}
