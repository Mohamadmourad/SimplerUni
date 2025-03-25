const {db} = require("../../db");
const { isAuthed } = require("../role/businessLogic");
const { checkAdminToken } = require("../role/helper");
const { getUniversityId } = require("../university/businessLogic");
const { verifyToken } = require("../university/helper");
const { hashText } = require("../user/helper");

module.exports.addAdmin = async (req, res) => {
    const { firstName, lastName, username, password, roleId } = req.body;
    const token = req.cookies.jwt;
  
    try {
      const {adminId, universityId} = verifyToken(token);
      if (!isAuthed("admindPage", adminId)) return res.status(401).json({ message: "Unauthorized" });
  
      const hashedPassword = await hashText(password);
  
      const result = await db.query(`
        INSERT INTO web_admins(firstname, lastname, username, password, roleid, universityid)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [firstName, lastName, username, hashedPassword, roleId, universityId]);
  
      return res.status(200).json({ message: "Admin added successfully", admin: result.rows[0] });
    } catch (e) {
      console.log("Error adding admin:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.updateAdmin = async (req, res) => {
    const { adminToUpdateId, firstName, lastName, roleId } = req.body;
    const token = req.cookies.jwt;
  
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
        SELECT a.adminid, a.firstname, a.lastname, a.username, r.name AS rolename
        FROM web_admins AS a
        JOIN roles AS r ON a.roleid = r.roleid
        WHERE a.universityid = $1
      `, [universityId]);
  
      return res.status(200).json({ admins: result.rows });
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
        `SELECT a.adminid, a.firstname, a.lastname, a.username, r.name AS rolename, 
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
      return res.status(200).json({ admin: result.rows[0] });
    } catch (e) {
      console.log("Error fetching admin:", e);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  
  