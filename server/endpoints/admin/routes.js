const express = require('express');
const adminController = require('./businessLogic');

const router = express.Router();

router.post("/addAdmin", adminController.addAdmin);

router.put("/updateAdmin", adminController.updateAdmin);

router.delete("/deleteAdmin", adminController.deleteAdmin);

router.get("/getAllAdmins", adminController.getAllAdmins);
router.get("/getAdmin", adminController.getAdmin);


module.exports = router;