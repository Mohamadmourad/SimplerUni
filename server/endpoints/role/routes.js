const express = require('express');
const rolesController = require('./businessLogic');

const router = express.Router();

router.post('/add', async (req, res) => {
    try {
      const { roleName, universityId, permissions } = req.body;
      const result = await rolesController.addRole(roleName, universityId, permissions);
      res.status(200).json({ message: "Role created successfully", roleId: result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

router.get("/checkPermission", rolesController.checkPermission);
router.get("/getRoles", rolesController.getRoles);

router.put("/updateRolePermissions", rolesController.updateRolePermissions);

router.delete("/deleteRole",rolesController.deleteRole);

module.exports = router;