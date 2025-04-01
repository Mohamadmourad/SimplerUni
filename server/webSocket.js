module.exports.connectWebSocket = async (io)=>{
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        // socket.on('chat message', (msg) => {
        //     console.log('Message received:', msg);
        //     io.emit('chat message', msg);  
        // });
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });
}