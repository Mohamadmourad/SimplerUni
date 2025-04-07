const express = require('express');
const userController = require('./businessLogic');

const router = express.Router();

router.post('/signup', userController.signup_post);
router.post('/addAdditionalUserData',userController.addAdditionalUserData);
router.post('/login', userController.login_post);
router.post('/sendOtp', userController.sendOtp);
router.post('/verifyOtp', userController.verifyOtp);

module.exports = router;
