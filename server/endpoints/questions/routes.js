const express = require('express');
const questionsController = require('./businessLogic');

const router = express.Router();

router.get("/getQuestions/:type", questionsController.getQuestions);
router.get("/getAnswers/:questionId", questionsController.getAnswersForQuestion);

router.post("/upvoteQuestion", questionsController.upvoteQuestion);
router.post("/addQuestion", questionsController.addQuestion);
router.post("/answerQuestion", questionsController.answerQuestion);

router.delete("/removeUpvoteFromQuestion/:questionId", questionsController.removeUpvoteFromQuestion);
router.delete("/deleteQuestion/:questionId", questionsController.deleteQuestion);

module.exports = router;
