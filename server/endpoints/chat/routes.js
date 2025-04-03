const express = require('express');
const chatController = require('./businessLogic');

const router = express.Router();

router.post("/createChatroom", chatController.createChatroom);

router.get("/getUserChatrooms", chatController.getUserChatrooms);

module.exports = router;