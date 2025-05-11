import 'package:senior_project/modules/user.dart';
import 'package:senior_project/providers/chatroomProvider.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;

  void connect({
    required ChatroomProvider chatroomProvider,
    required User currentUser,
  }) {
    final currentChatroomId = chatroomProvider.currentChatroomId;
    if (currentChatroomId == null) return;

    socket = IO.io('https://api.simpleruni.com', {
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.onConnect((_) {
      print("Connected to socket");
      socket.emit('join', currentChatroomId);
    });
    socket.off('message');
    socket.on('message', (data) {
      print('Message from server: $data');
      chatroomProvider.addMessage(data, currentUser);
    });

    socket.onDisconnect((_) => print("Disconnected from socket"));
  }

  void sendMessage(var message) {
    socket.emit('message', message);
  }

  void disconnect() {
    if (socket.connected) {
      socket.disconnect();
    }
  }
}
