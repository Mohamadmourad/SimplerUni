const express = require('express');
const cors = require('cors'); 
const {db, createTables} = require('./db');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

(async () => {
    db.connect() ? console.log("database connected") : console.log("failed to connect to db")
    await createTables();

    app.listen(PORT, () => {
        console.log(`Server is running on Port: ${PORT}`);
    });
})();




