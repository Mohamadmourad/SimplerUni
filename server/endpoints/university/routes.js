const express = require('express');
const universityController = require('./businessLogic');

const router = express.Router();

router.post('/createUniversity', universityController.createUniversity);
router.post('/login', universityController.universityLogin);
router.post('/logout', universityController.universityLogout);
router.post('/addStudentDomain',universityController.addStudentDomain);
router.post('/addIntructorDomain',universityController.addIntructorDomain);
router.post('/addCampus',universityController.addCampus);
router.post('/addMajor',universityController.addMajor);
router.post('/universityRequest',universityController.universityRequest);
router.post('/universityRequestAccept',universityController.universityRequestAccept);
router.post('/universityRequestReject',universityController.universityRequestReject);

router.get('/getUniversity', universityController.getUniversity);
router.get('/getAllCampsus',universityController.getAllCampsus);
router.get('/getAllMajors',universityController.getAllMajors);
router.get('/getPendingUniversityAcessList',universityController.getPendingUniversityAcessList);
router.get('/getAcceptedUniversityAcessList',universityController.getAcceptedUniversityAcessList);
router.get('/checkLogin', universityController.checkLogin);
router.get('/universityStatistics', universityController.universityStatistics);
router.get('/superAdminStatistics', universityController.superAdminStatistics);

router.delete("/removeCampus",universityController.deleteCampus);
router.delete("/removeMajor",universityController.deleteMajor);

module.exports = router;
