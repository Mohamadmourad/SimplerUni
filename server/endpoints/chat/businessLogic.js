const {db} = require("../../db");
const { verifyToken } = require("../user/helper");

module.exports.createChatroom = async (name, universityId)=>{
    try{
        const result = await db.query("INSERT INTO chatrooms(name, universityid) VALUES ($1,$2) RETURNING *",[name, universityId]);
        const chatroomId = result.rows[0].chatroomid;
       return chatroomId;
    }
    catch(e){
        console.log("error while creating chatroom" + e);
    }
}

module.exports.deleteChatroom = async (chatroomId) => {
    try {
        const result = await db.query(
            "DELETE FROM chatrooms WHERE chatroomid = $1 RETURNING *",
            [chatroomId]
        );

    } catch (e) {
        console.log("Error while deleting chatroom: " + e);
    }
};

module.exports.getUserChatrooms = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: "Authorization header missing" });
        }
        const { userId, universityId } = verifyToken(token);
        if (!userId) {
            return res.status(403).json({ error: "Invalid token" });
        }
        const result = await db.query(
            "SELECT * FROM chatrooms AS c JOIN chatroom_members AS cm ON c.chatroomid = cm.chatroomid WHERE cm.userid = $1",
            [userId]
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

// module.exports.sendMessage = async (type, content, chatroomId, token)=>{
//     try{
//        const { userId, universityId } = verifyToken(token);
//        const { rows } = await db.query(
//         `SELECT created_at FROM messages WHERE userId = $1 ORDER BY created_at DESC LIMIT 1`, [userId]
//     );

//     if (rows.length > 0) {
//         const lastMessageTime = new Date(rows[0].created_at);
//         const now = new Date();
//         const diffMs = now - lastMessageTime;

//         if (diffMs < 5 * 60 * 1000) {
//             const remaining = 5 * 60 * 1000 - diffMs;
//             const minutesLeft = Math.floor(remaining / 60000);
//             const secondsLeft = Math.floor((remaining % 60000) / 1000);

//             console.log(`You can’t send a message yet. Time left: ${minutesLeft}m ${secondsLeft}s`);
//         }
//     }
//        await db.query("INSERT INTO messages(type,content,chatroomId, userId) VALUES ($1,$2,$3,$4)",[type, content, chatroomId, userId]);
//        console.log("message insertion complete")
//     }
//     catch(e){
//         console.log("error while sending message " + e);
//     }
// }

module.exports.getMessages = async (req, res)=>{
  const { chatroomId, before, limit } = req.body;

  try{
    const messages = await db.query(
        `
        SELECT * FROM messages as m JOIN chatrooms as c
        ON m.chatroomid = c.chatroomid 
        JOIN users as u
        ON u.userid = m.userid
        WHERE c.chatroomid = $1
        AND m.created_at < $2
        ORDER BY m.created_at DESC
        LIMIT $3
        `,
        [chatroomId, before || new Date(), limit || 20]
    );
    return res.status(200).json(messages.rows);
  }
  catch(e){
    console.log("error while getting messages", e);
    return res.status(500).json("failed");
  }
}

module.exports.sendMessage = async (req, res) => {
    const { chatroomId, userId, content } = req.body;
  
    if (!chatroomId || !userId || !content) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    try {
      const result = await db.query(
        `
        INSERT INTO messages (chatroomid, userid, content)
        VALUES ($1, $2, $3)
        RETURNING *;
        `,
        [chatroomId, userId, content]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error while sending message:', err);
      return res.status(500).json({ error: 'Failed to send message.' });
    }
  };
  
