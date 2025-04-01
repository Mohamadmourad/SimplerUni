const {db} = require("../../db");

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