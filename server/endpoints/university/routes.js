const express = require('express');
const universityController = require('./businessLogic');

const router = express.Router();

router.post('/createUniversity', universityController.createUniversity);
router.post('/login', universityController.universityLogin);
router.post('/addDomains',universityController.addDomains);
router.post('/addCampus',universityController.addDomains);
router.post('/addMajor',universityController.addMajor);
router.get('/getUniversity/:universityId', universityController.getUniversity);
router.get('/getAllCampsus',universityController.getAllCampsus);
router.get('/getAllMajors',universityController.getAllMajors);

module.exports = router;
