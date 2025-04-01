const express = require('express');
const chatController = require('./businessLogic');

const router = express.Router();

router.post("/createChatroom", chatController.createChatroom);

module.exports = router;