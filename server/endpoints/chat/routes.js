const express = require('express');
const chatController = require('./businessLogic');

const router = express.Router();

router.get("/getUserChatrooms", chatController.getUserChatrooms);
router.get("/sendMessage", chatController.sendMessage);

module.exports = router;