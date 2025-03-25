const express = require('express');
const cors = require('cors'); 
const {db, createTables} = require('./db');
const setupSwagger = require('./swaggerConfig');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const userRoutes = require("./endpoints/user/routes");
const universityRoutes = require("./endpoints/university/routes");
const roleRoutes = require("./endpoints/role/routes");
const adminRoutes = require("./endpoints/admin/routes");

const PORT = process.env.PORT;
const app = express();

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
    await db.connect() ? console.log("database connected") : console.log("failed to connect to db")
    await createTables();

    app.listen(PORT, () => {
        console.log(`Server is running on Port: ${PORT}`);
    });
})();

app.use("/auth",userRoutes);
app.use("/university",universityRoutes);
app.use("/role",roleRoutes);
app.use("/admin",adminRoutes);