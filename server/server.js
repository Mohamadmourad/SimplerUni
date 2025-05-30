const express = require('express');
const cors = require('cors');
const { db, createTables } = require('./db');
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
const chatRoutes = require("./endpoints/chat/routes");
const questionRoutes = require("./endpoints/questions/routes");
const clubRoutes = require("./endpoints/club/routes");

const { addSuperAdmin } = require('./endpoints/admin/businessLogic');
const { connectWebSocket } = require('./webSocket');
const { checkUserAccount } = require('./endpoints/user/businessLogic');

const PORT = process.env.PORT;
const allowedOrigins = [
  'http://simpleruni.com',
  'https://simpleruni.com',
  'https://simpleruni.netlify.app',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://127.0.0.1:5000',
  'http://10.0.2.2:5000',
  'http://127.0.0.1:5500',
  'http://localhost:62691'
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.json({ limit: '100mb' }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(cookieParser());

app.use(async(req, res, next) => {
  console.log(req.path, req.method);
  let check = true;
  if(req.headers.authorization){
    check = await checkUserAccount(req.headers.authorization);
    if(!check) return res.status(403).json("account not found or banned");
  }
  if(check)
    next();
});

setupSwagger(app);

(async () => {
  await db.connect();
  await connectWebSocket(io);
  await createTables();
  await addSuperAdmin();
  server.listen(PORT, '0.0.0.0',() => {
    console.log(`Server is running on Port: ${PORT}`);
  });
})();

app.use("/user", userRoutes);
app.use("/university", universityRoutes);
app.use("/role", roleRoutes);
app.use("/admin", adminRoutes);
app.use("/news", newsRoutes);
app.use("/document", documentsRoutes);
app.use("/chat", chatRoutes);
app.use("/questions",questionRoutes);
app.use("/clubs",clubRoutes);