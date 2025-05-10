const {db} = require("../../db");
const { isAuthed } = require("../role/businessLogic");
const { checkAdminToken } = require("../role/helper");
const { getUniversityId } = require("../university/businessLogic");
const { verifyToken } = require("../university/helper");
const { hashText } = require("../user/helper");
const bcrypt = require('bcrypt');

module.exports.addAdmin = async (req, res) => {
    const { firstName, lastName, username, password, roleId } = req.body;
    const token = req.cookies.jwt;
  
    try {
      const {adminId, universityId} = verifyToken(token);
      if (!isAuthed("admindPage", adminId)) return res.status(401).json({ message: "Unauthorized" });
  
      const hashedPassword = await hashText(password);

      const doAdminExist = await db.query(`SELECT * FROM web_admins WHERE username=$1`,[username]);
      if(doAdminExist.rowCount > 0){
        return res.status(401).json({ message: "username already exits" });
      }
  
      const result = await db.query(`
        INSERT INTO web_admins(firstname, lastname, username, password, roleid, universityid, isPasswordChanged)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [firstName, lastName, username, hashedPassword, roleId, universityId,false]);
  
      return res.status(200).json({ message: "Admin added successfully", admin: result.rows[0] });
    } catch (e) {
      console.log("Error adding admin:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateAdmin = async (req, res) => {
    const { adminToUpdateId, firstName, lastName, roleId } = req.body;
    const token = req.cookies.jwt;
    console.log("updateAdmin: ", req.body);
    try {
      const {adminId, universityId} = verifyToken(token);
      if (!isAuthed("admindPage", adminId)) return res.status(401).json({ message: "Unauthorized" });
  
      const result = await db.query(`
        UPDATE web_admins
        SET firstname = $1, lastname = $2, roleid = $3
        WHERE adminid = $4
        RETURNING *
      `, [firstName, lastName, roleId, adminToUpdateId]);
  
      if (result.rowCount === 0) return res.status(404).json({ message: "Admin not found" });
  
      return res.status(200).json({ message: "Admin updated successfully", admin: result.rows[0] });
    } catch (e) {
      console.log("Error updating admin:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports.deleteAdmin = async (req, res) => {
  const { adminToDeleteId } = req.body;
  const token = req.cookies.jwt;

  try {
    const {adminId, universityId} = verifyToken(token);
    if (!isAuthed("admindPage", adminId)) return res.status(401).json({ message: "Unauthorized" });

    const result = await db.query(`
      DELETE FROM web_admins WHERE adminid = $1 RETURNING *
    `, [adminToDeleteId]);

    if (result.rowCount === 0) return res.status(404).json({ message: "Admin not found" });

    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (e) {
    console.log("Error deleting admin:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deleteAdmin = async (req, res) => {
    const { adminToDeleteId } = req.body;
    const token = req.cookies.jwt;
  
    try {
      const {adminId, universityId} = verifyToken(token);
      if (!isAuthed("admindPage", adminId)) return res.status(401).json({ message: "Unauthorized" });
  
      const result = await db.query(`
        DELETE FROM web_admins WHERE adminid = $1 RETURNING *
      `, [adminToDeleteId]);
  
      if (result.rowCount === 0) return res.status(404).json({ message: "Admin not found" });
  
      return res.status(200).json({ message: "Admin deleted successfully" });
    } catch (e) {
      console.log("Error deleting admin:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.getAllAdmins = async (req, res) => {
    const token = req.cookies.jwt;
    try {
      const {adminId, universityId} = verifyToken(token);
      if (!isAuthed("admindPage", adminId)) return res.status(401).json({ message: "Unauthorized" });
  
      const result = await db.query(`
        SELECT a.adminid, a.firstname, a.lastname, a.username, r.name AS rolename, r.roleid AS roleid
        FROM web_admins AS a
        JOIN roles AS r ON a.roleid = r.roleid
        WHERE a.universityid = $1
      `, [universityId]);
  
      return res.status(200).json(result.rows);
    } catch (e) {
      console.log("Error fetching admins:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports.getAdmin = async (req, res) => {
    const token = req.cookies.jwt;
    try {
      const {adminId, universityId} = verifyToken(token);
      if (!isAuthed("adminPage", adminId)) return res.status(401).json({ message: "Unauthorized" });
      const result = await db.query(
        `SELECT a.adminid, a.firstname, a.lastname, a.username, a.ispasswordchanged, r.name AS rolename, 
         ARRAY_AGG(p.name) AS permissions
         FROM web_admins AS a
         JOIN roles AS r ON a.roleid = r.roleid
         LEFT JOIN role_permissions AS p ON r.roleid = p.roleid
         WHERE a.adminid = $1
         GROUP BY a.adminid, a.firstname, a.lastname, a.username, r.name`,
        [adminId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }
      return res.status(200).json(result.rows[0]);
    } catch (e) {
      console.log("Error fetching admin:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports.addSuperAdmin = async () => {
    try {
      var result = await db.query("SELECT * FROM web_admins");
      if(result.rowCount > 0){
        console.log("super admin already exist");
        return;
      }
      const username = process.env.SUPER_ADMIN_USERNAME;
      const password = process.env.SUPER_ADMIN_PASSWORD;
      const hashedPassword = await hashText(password);
      result = await db.query("INSERT INTO roles(name) VALUES ($1) RETURNING *",["superAdmin"]);
      const roleId = result.rows[0].roleid;
      await db.query("INSERT INTO role_permissions(name, roleid) VALUES ($1, $2)", ["superAdmin", roleId])
  
       result = await db.query(`
        INSERT INTO web_admins(username, password, roleid, isPasswordChanged)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [username, hashedPassword, roleId, true]);
      console.log("superAdmin created succesfully");
      return result.rows[0];
    } catch (e) {
      console.log("Error adding super admin:", e);
    }
};
  
module.exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.cookies.jwt;

  try {
    const { adminId } = verifyToken(token);

    const result = await db.query(`SELECT password FROM web_admins WHERE adminId = $1`, [adminId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const storedPasswordHash = result.rows[0].password;

    const isPasswordValid = await bcrypt.compare(currentPassword, storedPasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    const hashedNewPassword = await hashText(newPassword, 10);

    await db.query(`UPDATE web_admins SET password = $1, isPasswordChanged = $2 WHERE adminId = $3`, [hashedNewPassword, true, adminId]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (e) {
    console.error("Error changing password:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
  