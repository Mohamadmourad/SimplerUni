const express = require('express');
const clubController = require('./businessLogic');

const router = express.Router();

router.get("/underReviewClubs", clubController.getUnderReviewClubs);    
router.get("/acceptedClubs", clubController.getAcceptedClubs);          

router.get("/getClubsUserNotIn", clubController.getClubsUserNotIn);  
router.get("/getClubsUserIsIn", clubController.getClubsUserIsIn);        



router.post("/makeClubRequest", clubController.makeClubRequest);         
router.post("/acceptClubRequest", clubController.acceptClubRequest);  
   
router.post("/requestJoinClub", clubController.requestJoinClub);        
router.post("/acceptJoinRequest", clubController.acceptJoinRequest);  
router.post("/rejectJoinRequest", clubController.rejectJoinRequest);   

module.exports = router;
