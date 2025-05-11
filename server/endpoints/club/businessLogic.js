const {db} = require("../../db");
const { createChatroom } = require("../chat/businessLogic");
const { clubAcceptanceEmail, clubRejectionEmail } = require("../emailTemplates");
const { sendEmail } = require("../helper");
const { verifyToken } = require("../university/helper");
const { verifyToken: mobileTokenVerify } = require("../user/helper");

module.exports.acceptClubRequest = async (req, res) => {
    const token = req.cookies.jwt;
    const { clubId, name, description, room, adminId } = req.body;

    if (!clubId) {
        return res.status(400).json({ error: "Club ID is required" });
    }

    try {
        const { universityId } = verifyToken(token);
        const chatroomId = await createChatroom(name, universityId);
        await db.query(
            `UPDATE clubs SET name = $1, description = $2, room = $3, adminId = $4, chatroomId = $5, status = $6
             WHERE clubId = $7`,
            [name, description, room, adminId, chatroomId, "accepted", clubId]
        );
        await db.query(`INSERT INTO chatroom_members(userid,chatroomid) VALUES($1,$2)`,[adminId,chatroomId]);
        res.status(200).json({ message: "Club updated successfully" });
    } catch (e) {
        console.error(e);
        return res.status(500).json("Updating club failed");
    }
};

module.exports.rejectClubRequest = async (req, res) => {
    const { clubId } = req.body;

    if (!clubId) {
        return res.status(400).json({ error: "Club ID is required" });
    }

    try {
        await db.query(`DELETE FROM clubs WHERE clubId = $1`, [clubId]);
        res.status(200).json({ message: "Club request rejected and deleted successfully" });
    } catch (e) {
        console.error(e);
        return res.status(500).json("Deleting club request failed");
    }
};

module.exports.deleteClub = async (req, res) => {
    const { clubId } = req.params;

    if (!clubId) {
        return res.status(400).json({ error: "Club ID is required" });
    }

    try {
        await db.query(`DELETE FROM chatroom_members WHERE chatroomid = (SELECT chatroomId FROM clubs WHERE clubId = $1)`, [clubId]);
        await db.query(`DELETE FROM chatrooms WHERE chatroomId = (SELECT chatroomId FROM clubs WHERE clubId = $1)`, [clubId]);
        await db.query(`DELETE FROM clubs WHERE clubId = $1`, [clubId]);

        res.status(200).json({ message: "Club deleted successfully" });
    } catch (e) {
        console.error(e);
        return res.status(500).json("Deleting club failed");
    }
};



module.exports.makeClubRequest = async (req, res)=>{ 
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const {name, description} = req.body;
     try {
       const { universityId } = mobileTokenVerify(token);
       await db.query(`INSERT INTO clubs (name, description,status,universityId) VALUES($1,$2,$3,$4)`,[name, description, "underReview", universityId]);
       return res.status(200).json("creating added succefully");
     }
     catch(e){
       console.log(e);
       return res.status(500).json("creating club failed");
     }
}

module.exports.getUnderReviewClubs = async (req, res) => {
    let token = req.cookies.jwt;
    if(!token)
        token = req.headers.authorization;
    try {
        const { universityId } = verifyToken(token);
        const { rows } = await db.query(
            `SELECT * FROM clubs WHERE status = $1 AND universityId = $2`,
            ["underReview", universityId]
        );

        res.status(200).json(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to fetch under review clubs");
    }
};

module.exports.getAcceptedClubs = async (req, res) => {
    const token = req.cookies.jwt;

    try {
        const { universityId } = verifyToken(token);
        const { rows } = await db.query(
            `SELECT * FROM clubs WHERE status = $1 AND universityId = $2`,
            ["accepted", universityId]
        );

        res.status(200).json(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to fetch accepted clubs");
    }
};

module.exports.requestJoinClub = async (req, res)=>{
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const { clubId } = req.body;
     try {
       const { userId, universityId } = mobileTokenVerify(token);
       const available = await db.query(`SELECT * FROM club_members WHERE userId=$1 AND clubId=$2`,[userId, clubId]);
       if(available.rowCount === 0){
         await db.query(`INSERT INTO club_members (userId, clubId,status) VALUES($1,$2,$3)`,[userId, clubId, "underReview"]);
       }
       return res.status(200).json("request sended succefully");
     }
     catch(e){
       console.log(e);
       return res.status(500).json("creating club failed");
     }
}

module.exports.removeJoinClubRequest = async (req, res)=>{
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    const { clubId } = req.params;
     try {
       const { userId, universityId } = mobileTokenVerify(token);
       await db.query(`DELETE FROM club_members WHERE userId=$1 AND clubId=$2`, [userId, clubId]);

       return res.status(200).json("request removed succefully");
     }
     catch(e){
       console.log(e);
       return res.status(500).json("creating club failed");
     }
}

module.exports.acceptJoinRequest = async (req, res) => {
    const { userId, clubId } = req.body;

    if (!userId || !clubId) {
        return res.status(400).json({ error: "Missing userId or clubId" });
    }
    try {
        const user = await db.query(`SELECT * FROM users WHERE userId=$1`,[userId]);
        if(user.rowCount ===0){
            return res.status(400).json({message:"user not found"});
        }
        const club = await db.query(`SELECT * FROM clubs WHERE clubId=$1`,[clubId]);
        if(club.rowCount ===0){
            return res.status(400).json({message:"user not found"});
        }
        await db.query(
            `UPDATE club_members SET status = $1 WHERE userId = $2 AND clubId = $3`,
            ["accepted", userId, clubId]
        );
        await db.query(`INSERT INTO chatroom_members(userid,chatroomid) VALUES($1,$2)`,[userId,club.rows[0].chatroomid]);
        const emailContent = clubAcceptanceEmail(user.rows[0].username,club.rows[0].name);
        await sendEmail(user.rows[0].email,"club acceptence",emailContent);
        return res.status(200).json("Join request accepted successfully");
    } catch (e) {
        console.error(e);
        return res.status(500).json("Accepting join request failed");
    }
};

module.exports.rejectJoinRequest = async (req, res) => {
    const { userId, clubId } = req.body;

    if (!userId || !clubId) {
        return res.status(400).json({ error: "Missing userId or clubId" });
    }
    try {
        const club = await db.query(`SELECT * FROM clubs WHERE clubId=$1`,[clubId]);
        if(club.rowCount ===0){
            return res.status(400).json({message:"user not found"});
        }
        await db.query(
           `DELETE FROM club_members WHERE userId=$1 AND clubId=$2`, [userId, clubId]
        );
        const emailContent = clubRejectionEmail(user.rows[0].username,"club rejection",club.rows[0].name);
        await sendEmail(user.rows[0].email,"club acceptence",emailContent);

        return res.status(200).json("Join request rejected successfully");
    } catch (e) {
        console.error(e);
        return res.status(500).json("Rejecting join request failed");
    }
};

module.exports.getClubsUserNotIn = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }

    try {
        const { userId, universityId } = mobileTokenVerify(token);

        const { rows } = await db.query(
            `
            SELECT 
                c.*, 
                CASE 
                    WHEN cm.status = 'underReview' THEN true 
                    ELSE false 
                END AS hasUserMadeRequest
            FROM clubs c
            LEFT JOIN club_members cm 
                ON cm.clubId = c.clubId AND cm.userId = $2
            WHERE c.universityId = $1 
            AND c.clubId NOT IN (
                SELECT c.clubId
                FROM club_members cm
                JOIN clubs c ON cm.clubId = c.clubId
                WHERE cm.userId = $2 AND cm.status = 'accepted'
            )
            AND c.status = 'accepted'
            `,
            [universityId, userId]
        );
console.log(rows);
        return res.status(200).json(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to fetch clubs user is not in");
    }
};




module.exports.getClubsUserIsIn = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    try {
        const { userId, universityId } = mobileTokenVerify(token);

        const { rows } = await db.query(
            `
            SELECT c.*
            FROM club_members cm
            JOIN clubs c ON cm.clubId = c.clubId
            WHERE cm.userId = $1 AND c.universityId = $2 AND cm.status = 'accepted'
            `,
            [userId, universityId]
        );
        return res.status(200).json(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to fetch clubs user is in");
    }
};

module.exports.getAdminClubList = async (req, res) => {
    const token = req.headers.authorization;

    try {
        const { userId, universityId } = mobileTokenVerify(token);
        const { rows } = await db.query(
            `SELECT * FROM clubs WHERE universityId = $1 AND adminId=$2`,
            [universityId, userId]
        );

        res.status(200).json(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to fetch admin clubs");
    }
};

module.exports.getClubInfo = async (req, res) => {
    const token = req.headers.authorization;
    const {clubId} = req.params;
    try {
        const { userId, universityId } = mobileTokenVerify(token);
        const members = await db.query(
            `SELECT u.* FROM users as u JOIN club_members as cm ON u.userId = cm.userId WHERE cm.clubId = $1 AND cm.status = $2`,
            [clubId, "accepted"]
            
        );
        const clubData = await db.query(
            `SELECT * FROM clubs WHERE clubId = $1`,
            [clubId]
        );
        const result = {
            clubMembers: members.rows,
            ...clubData.rows[0]
        }

        res.status(200).json(result);
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to get club members");
    }
};

module.exports.removerStudentFromClub = async (req, res) => {
    const token = req.headers.authorization;
    const {userId, clubId} = req.params;
    try {
        await db.query(
            `DELETE FROM club_members WHERE userId=$1 AND clubId=$2`,
            [userId, clubId]
        );
        const {rows}= await db.query(`SELECT chatroomId FROM clubs WHERE clubId=$1`, [clubId]);
        await db.query(
            `DELETE FROM chatroom_members WHERE userId=$1 AND chatroomId=$2`,
            [userId, rows[0].chatroomid]
        );

        res.status(200).json("deleted succesfully");
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to get remove student");
    }
};

module.exports.changeClubAdmin = async (req, res) => {
    const token = req.cookies.jwt;
    const {newAdminId, clubId} = req.body;
    try {
        const { adminId, universityId } = verifyToken(token);
        const club = await db.query(`SELECT * FROM clubs WHERE clubid=$1`,[clubId]);
        const oldAdminId = club.rows[0].adminid;
        await db.query(`DELETE FROM club_members WHERE clubid=$1 AND userid=$2`,[clubId,oldAdminId]);
        await db.query(`UPDATE clubs SET adminId=$1 WHERE clubId=$2`,[newAdminId, clubId]);
        await db.query(`INSERT INTO club_members (userId, clubId,status) VALUES($1,$2,$3)`,[newAdminId, clubId, "accepted"]);
        res.status(200).json("admin changed succesfully");
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to change");
    }
};

module.exports.getClubJoinRequests = async (req, res) => {
    const token = req.headers.authorization;
    const {clubId} = req.params;
    console.log("ss: " + clubId);
    try {
        const {rows} = await db.query(`SELECT u.* FROM club_members as cm JOIN users as u ON cm.userId = u.userId WHERE clubId=$1 AND status=$2`,[clubId,"underReview"]);

        res.status(200).json(rows);
    } catch (e) {
        console.error(e);
        return res.status(500).json("Failed to get club join request student");
    }
};