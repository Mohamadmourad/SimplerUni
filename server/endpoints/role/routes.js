const express = require('express');
const rolesController = require('./businessLogic');

const router = express.Router();

router.post("/addRole", rolesController.addRole);

router.get("/checkPermission", rolesController.checkPermission);
router.get("/getRoles", rolesController.getRoles);

router.put("/updateRolePermissions", rolesController.updateRolePermissions);

router.delete("/deleteRole/:roleId",rolesController.deleteRole);

module.exports = router;