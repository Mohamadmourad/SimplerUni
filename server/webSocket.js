const { db } = require("./db");
const { sendMessage } = require("./endpoints/chat/businessLogic");

module.exports.connectWebSocket = async (io)=>{
    io.on('connection', (socket) => {
        console.log('A user connected');
      
        socket.on('join', (data) => {
          console.log('Join event from:', data);
        });
      
        socket.on('message', async (msg) => {
          try{
            console.log('Received:', msg);
            await sendMessage(msg.chatroomId,msg.userId,msg.content,msg.type);
            const user = await db.query('SELECT * FROM users WHERE userid=$1',[msg.userId]);
            const fullMessage = {
              ...msg,
              ...user.rows[0]
            };
            socket.broadcast.emit('message', fullMessage);
            socket.emit('message', fullMessage);
          }
          catch(e){
            console.log("erro sending message", e);
          }
        });
      
        socket.on('disconnect', () => {
          console.log('User disconnected');
        });
      });
}