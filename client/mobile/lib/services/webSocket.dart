import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket _socket;

  void connect() {
    _socket = IO.io('http://localhost:5000', {
      'transports': ['websocket'],
      'autoConnect': false,
    });

    _socket.connect();

    _socket.onConnect((_) {
      print('Connected to server');
      _socket.emit('join', 'flutter_user');
    });

    _socket.on('message', (data) {
      print('Message from server: $data');
    });

    _socket.onDisconnect((_) => print('Disconnected from server'));
  }

  void sendMessage(String message) {
    _socket.emit('message', message);
  }

  void disconnect() {
    _socket.disconnect();
  }
}
