const express = require('express');
const newsController = require('./businessLogic');

const router = express.Router();

router.post("/createNews", newsController.createNews);

router.get("/getAllNews", newsController.getAllNews);
router.get("/getNewsForMobile", newsController.getNewsForMobile);

router.delete("/deleteNews/:newsId", newsController.deleteNews);

module.exports = router;