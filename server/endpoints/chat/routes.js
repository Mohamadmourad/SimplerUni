const express = require('express');
const chatController = require('./businessLogic');

const router = express.Router();

router.get("/getUserChatrooms", chatController.getUserChatrooms);

router.post("/sendMessage", chatController.sendMessage);
router.post("/getMessages", chatController.getMessages);

module.exports = router;