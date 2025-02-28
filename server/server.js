const express = require('express');
const cors = require('cors'); 
const {db, createTables} = require('./db');
const setupSwagger = require('./swaggerConfig');
require('dotenv').config();

const userRoutes = require("./user/routes");

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

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


