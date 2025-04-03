const {db} = require("../../db");
const { verifyToken } = require("../university/helper");

module.exports.createChatroom = async (req, res)=>{
    const {name, universityId} = req.body || req
    try{
        const result = await db.query("INSERT INTO chatrooms(name, universityid) VALUES ($1,$2) RETURNING *",[name, universityId]);
        const chatroomId = result.rows[0].chatroomid;
       req.body ? res.status(200).json(chatroomId) : chatroomId;
    }
    catch(e){
        console.log("error while creating chatroom" + e);
        res.status(500).json("failed");
    }
}

module.exports.getUserChatrooms = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }
        const token = authHeader.split(" ")[1]; 
        const { adminId, universityId } = verifyToken(token);
        if (!adminId) {
            return res.status(403).json({ error: "Invalid token" });
        }
        const result = await db.query(
            "SELECT * FROM chatrooms AS c JOIN chatroom_members AS cm ON c.chatroomid = cm.chatroomid WHERE cm.userid = $1",
            [adminId]
        );
        res.status(200).json(result.rows);
    } catch (e) {
        console.error("Error while getting chatrooms:", e);
        res.status(500).json({ error: "Failed to fetch chatrooms" });
    }
};

module.exports.addToChatroom = async (req, res)=>{
    const { chatroomId, userId } = req.body || req
    try{
        await db.query("INSERT INTO chatroom_members(userid, chatroomid) VALUES ($1,$2)",[userId, chatroomId]);
        req.body ? res.status(200).json("sucess") : null;
    }
    catch(e){
        console.log("error while adding chatroom" + e);
        res.status(500).json("failed");
    }
}
