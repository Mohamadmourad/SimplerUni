const {db} = require("../../db");
const { uploadDocument } = require("../documents upload/businessLogic");
const { isAuthed } = require("../role/businessLogic");
const { verifyToken } = require("../university/helper");
const { verifyToken: verifyUserToken } = require("../user/helper");

module.exports.createNews = async (req, res) => {
    const { title ,content, imageBase64 } = req.body;
    const token = req.cookies.jwt;
    try {
      const { adminId, universityId } = verifyToken(token);
      if (!await isAuthed("newsPage", adminId)) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      imageUrl = await uploadDocument(imageBase64, adminId);
      const result = await db.query(
        "INSERT INTO news (title, content, imageUrl, universityid) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, content, imageUrl, universityId]
      );
      console.log(result.rows[0])
      return res.status(200).json(result.rows[0]);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error while creating news" });
    }
  };
  
  module.exports.deleteNews = async (req, res) => {
    const { newsId } = req.params;
    const token = req.cookies.jwt;
  
    if (!newsId) {
      return res.status(400).json({ message: "newsid is required" });
    }
    try {
      const { adminId } = verifyToken(token);
      if (!await isAuthed("newsPage", adminId)) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await db.query("DELETE FROM news WHERE newsid = $1 RETURNING *", [newsId]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "News not found" });
      }
      return res.status(200).json({ message: "News deleted successfully" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error while deleting news" });
    }
}

  module.exports.getAllNews = async (req, res) => {
    const token = req.cookies.jwt;
    try {
     const { adminId, universityId } = verifyToken(token);
     if (!await isAuthed("newsPage", adminId)) {
          return res.status(401).json({ message: "Unauthorized" });
      }  
      const result = await db.query("SELECT * FROM news WHERE universityid = $1",[universityId]);
      return res.status(200).json(result.rows);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error while retrieving news" });
    }
  };
  
module.exports.getNewsForMobile = async (req, res)=>{
  const token = req.headers.authorization;
  try {
    const { userId, universityId } = verifyUserToken(token);
     const result = await db.query("SELECT * FROM news WHERE universityid = $1",[universityId]);
     return res.status(200).json(result.rows);
   } catch (e) {
     console.log(e);
     return res.status(500).json({ message: "Error while retrieving news" });
   }
}
  
