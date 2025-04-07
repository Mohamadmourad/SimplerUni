module.exports.connectWebSocket = async (io)=>{
    io.on('connection', (socket) => {
        console.log('A user connected');
      
        socket.on('join', (data) => {
          console.log('Join event from:', data);
        });
      
        socket.on('message', (msg) => {
          console.log('Received:', msg);
          socket.broadcast.emit('message', msg);
        });
      
        socket.on('disconnect', () => {
          console.log('User disconnected');
        });
      });
}