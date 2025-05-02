const express = require('express');
const userController = require('./businessLogic');

const router = express.Router();

router.get('/getUser', userController.getUser);
router.get('/getAllUniversityUsers', userController.getAllUniversityUsers);
router.get('/getUserAccountInfo/:profileUserId', userController.getUserAccountInfo);
router.get('/getAllInstructors', userController.getAllInstructors);

router.post('/signup', userController.signup_post);
router.post('/addAdditionalUserData',userController.addAdditionalUserData);
router.post('/login', userController.login_post);
router.post('/sendOtp', userController.sendOtp);
router.post('/verifyOtp', userController.verifyOtp);

router.put("/banUser",userController.banUser);
router.put("/unbanUser",userController.unbanUser);

router.delete("/deleteUser/:userId",userController.deleteUser);

module.exports = router;
