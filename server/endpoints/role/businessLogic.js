const {db} = require("../../db");
const { verifyToken } = require("../university/helper");
const { checkAdminToken } = require("./helper");

module.exports.addRole = async (req, res)=>{
  const { roleName, permissions } = req.body;
  if(!roleName || !permissions){
    return res.status(400).json({ error: "wrong parameters" });
  }
  const token = req.cookies.jwt;
  const {universityId} = verifyToken(token);
  try{
    const result = await db.query("INSERT INTO roles(name, universityid) VALUES ($1,$2) RETURNING *",[roleName, universityId]);
    const roleId = result.rows[0].roleid;
    const permissionQueries = permissions.map(permission =>
      db.query("INSERT INTO role_permissions(name, roleid) VALUES ($1, $2)", [permission, roleId])
    );
    await Promise.all(permissionQueries); 

    res.status(200).json({roleId})
  }
  catch(e){
    console.log(e)
    res.status(500).json({message:"error happend while adding role"})
  }
}

module.exports.checkPermission = async (req, res)=>{
  const {permission} = req.body;
  const token = req.cookies.jwt;
  try {
    const {adminId, universityId} = verifyToken(token);
    const permissionsRequest = await db.query(`
      SELECT p.name FROM web_admins AS a JOIN roles AS r ON a.roleid = r.roleid JOIN role_permissions AS p ON r.roleid = p.roleid WHERE a.adminid = $1`, [adminId]);
    const permissions = permissionsRequest.rows;
    const isAllowed = permissions.some(p => p.name === permission);
    if(isAllowed)
      return res.status(200).json({message: "Authorized"});
    return res.status(401).json({message: "Unauthorized"});
  }
  catch(e){
    console.log("Unauthorized action");
    return res.status(401).json({message: "Unauthorized"});
  }
}

module.exports.getRoles = async (req, res)=>{
  const token = req.cookies.jwt;
  try{
    const {adminId, universityId} = verifyToken(token);
    if(!await this.isAuthed("rolesPage", adminId)) return res.status(401).json({message: "Unauthorized"});

    const result = await db.query(`SELECT r.name AS roleName, r.roleid AS roleId, ARRAY_AGG(p.name) AS permissions FROM roles AS r JOIN role_permissions AS p ON r.roleid = p.roleid WHERE r.universityid = $1 GROUP BY r.name, r.roleid`, [universityId]);
    const roles = result.rows;
    return res.status(200).json(roles);
  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"error while getting roles"});
  }
}

module.exports.deleteRole = async (req, res) => {
  const { roleId } = req.params;
  const token = req.cookies.jwt;

  if (!roleId) {
    return res.status(400).json({ message: "roleId is required" });
  }
  try {
    const {adminId} = verifyToken(token);
    if (!await this.isAuthed("rolesRoles", adminId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await db.query("DELETE FROM roles WHERE roleid = $1 RETURNING *", [roleId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Role not found" });
    }
    return res.status(200).json({ message: "Role deleted successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Error while deleting role" });
  }
};

module.exports.updateRolePermissions = async (req, res) => {
  const { roleId, permissions } = req.body;
  const token = req.cookies.jwt;

  if (!roleId || !permissions || !Array.isArray(permissions)) {
    return res.status(400).json({ message: "roleId and permissions array are required" });
  }
  try {
    const {adminId} = verifyToken(token);
    if (!await this.isAuthed("rolesRoles", adminId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await db.query("DELETE FROM role_permissions WHERE roleid = $1", [roleId]);
    const insertQueries = permissions.map(permission =>
      db.query("INSERT INTO role_permissions(name, roleid) VALUES ($1, $2)", [permission, roleId])
    );
    await Promise.all(insertQueries);
    return res.status(200).json({ message: "Role permissions updated successfully" });
  } catch (e) {
    console.log("Error updating role permissions:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.isAuthed = async (permission, adminId)=>{
  try {
    const permissionsRequest = await db.query(`
      SELECT p.name FROM web_admins AS a JOIN roles AS r ON a.roleid = r.roleid JOIN role_permissions AS p ON r.roleid = p.roleid WHERE a.adminid = $1`, [adminId]);
    const permissions = permissionsRequest.rows;
    const isAllowed = permissions.some(p => p.name === permission || p.name === "universityDashboard")
    if(isAllowed)
      return true
    return false
  }
  catch(e){
    console.log("Unauthorized action");
    return false
  }
}

module.exports.addRoleMethode = async (roleName, universityId, permissions)=>{
  try{
    const result = await db.query("INSERT INTO roles(name, universityid) VALUES ($1,$2) RETURNING *",[roleName, universityId]);
    const roleId = result.rows[0].roleid;
    const permissionQueries = permissions.map(permission =>
      db.query("INSERT INTO role_permissions(name, roleid) VALUES ($1, $2)", [permission, roleId])
    );
    await Promise.all(permissionQueries); 
    return roleId;
  }
  catch(e){
    console.log(e)
    res.status(500).json({message:"error happend while adding role"})
  }
}