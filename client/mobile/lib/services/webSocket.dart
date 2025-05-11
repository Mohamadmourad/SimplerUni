import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;

  void connect(
    {
    required String currentChatroomId,
    required Function(dynamic) addNewMessage,
  }
  ) {
    socket = IO.io('http://localhost:5000', {
      'transports': ['websocket'],
      'autoConnect': false,
    });

    socket.connect();

    socket.onConnect((e) {
      socket.emit('join', e);
    });

    socket.on('message', (data) {
      print('Message from server: $data');
       if (data['chatroomId'] == currentChatroomId) {
          addNewMessage(data); 
        }
    });

    socket.onDisconnect((d) => print("disconnected"));
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
