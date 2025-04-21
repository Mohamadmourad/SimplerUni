const express = require('express');
const multer = require("multer");
const documentsController = require('./businessLogic');

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/uploadDocumentMobile", documentsController.uploadDocumentToS3);

router.post("/uploadDocument", upload.single("file"), documentsController.uploadDocument);
router.post("/uploadCampusesDocument", upload.single("file"), documentsController.uploadCampusesDocument);
router.post("/uploadMajorsDocument", upload.single("file"), documentsController.uploadMajorsDocument);

module.exports = router;