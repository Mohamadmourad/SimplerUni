const express = require('express');
const clubController = require('./businessLogic');

const router = express.Router();

router.get("/underReviewClubs", clubController.getUnderReviewClubs);    
router.get("/acceptedClubs", clubController.getAcceptedClubs);          

router.get("/getClubsUserNotIn", clubController.getClubsUserNotIn);  
router.get("/getClubsUserIsIn", clubController.getClubsUserIsIn);        
router.get("/getAdminClubList", clubController.getAdminClubList);
router.get("/getClubMembers", clubController.getClubMembers);

router.post("/makeClubRequest", clubController.makeClubRequest);         
router.post("/acceptClubRequest", clubController.acceptClubRequest);  
   
router.post("/requestJoinClub", clubController.requestJoinClub);        
router.post("/acceptJoinRequest", clubController.acceptJoinRequest);  
router.post("/rejectJoinRequest", clubController.rejectJoinRequest);   

router.put("/changeClubAdmin", clubController.changeClubAdmin);

router.delete("/removerStudentFromClub", clubController.removerStudentFromClub);

module.exports = router;
