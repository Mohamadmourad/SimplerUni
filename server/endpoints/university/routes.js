const express = require('express');
const universityController = require('./businessLogic');

const router = express.Router();

router.post('/createUniversity', universityController.createUniversity);
router.post('/login', universityController.universityLogin);
router.post('/addDomains',universityController.addDomains)


module.exports = router;
