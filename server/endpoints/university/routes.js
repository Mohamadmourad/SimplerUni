const express = require('express');
const universityController = require('./businessLogic');

const router = express.Router();

router.post('/createUniversity', universityController.createUniversity);
router.post('/login', universityController.universityLogin);
router.post('/addStudentDomain',universityController.addStudentDomain);
router.post('/addIntructorDomain',universityController.addIntructorDomain);
router.post('/addCampus',universityController.addCampus);
router.post('/addMajor',universityController.addMajor);

router.get('/getUniversity', universityController.getUniversity);
router.get('/getAllCampsus',universityController.getAllCampsus);
router.get('/getAllMajors',universityController.getAllMajors);

router.delete("/removeCampus",universityController.deleteCampus);
router.delete("/removeMajor",universityController.deleteMajor);

module.exports = router;
