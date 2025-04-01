const express = require('express');
const multer = require("multer");
const documentsController = require('./businessLogic');

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.post("/uploadDocument", upload.single("file"),documentsController.uploadDocument);

module.exports = router;