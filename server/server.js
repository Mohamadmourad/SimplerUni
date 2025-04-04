const express = require('express');
const cors = require('cors'); 
const {db, createTables} = require('./db');
const setupSwagger = require('./swaggerConfig');
const cookieParser = require('cookie-parser');
const http = require('http');        
const { Server } = require("socket.io");
require('dotenv').config();

const userRoutes = require("./endpoints/user/routes");
const universityRoutes = require("./endpoints/university/routes");
const roleRoutes = require("./endpoints/role/routes");
const adminRoutes = require("./endpoints/admin/routes");
const newsRoutes = require("./endpoints/news/routes");
const documentsRoutes = require("./endpoints/documents upload/routes");

const { addSuperAdmin } = require('./endpoints/admin/businessLogic');
const { connectWebSocket } = require('./webSocket');

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",  
      methods: ["GET", "POST"]
  }
}); 

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

setupSwagger(app);

(async () => {
    await db.connect() ? console.log("database connected") : console.log("failed to connect to db");
    await connectWebSocket(io);
    await createTables();
    await addSuperAdmin();
    server.listen(PORT, () => {
        console.log(`Server is running on Port: ${PORT}`);
    });
})();

app.use("/user",userRoutes);
app.use("/university",universityRoutes);
app.use("/role",roleRoutes);
app.use("/admin",adminRoutes);
app.use("/news",newsRoutes);
app.use("/document",documentsRoutes);