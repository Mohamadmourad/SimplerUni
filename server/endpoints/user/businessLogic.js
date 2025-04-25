const {db} = require("../../db");
const {DateTime} = require("luxon");
const { hashText, createToken, handleErrors, compareHashedText, getUserIdFromToken, getEmailDomain, verifyToken } = require("./helper");
const { verifyToken: universityVerifyToken } = require("../university/helper")
const { sendEmail } = require("../helper");
const { otpVerificationEmail } = require("../emailTemplates");
const { addToChatroom } = require("../chat/businessLogic");

module.exports.signup_post = async (req, res) => {
    let { email, password, username } = req.body;
    
    password = await hashText(password);
    try{
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if(user.rows.length > 0 && user.rows[0].isBanned){
            return res.status(400).json({
                errors:{
                    email:"this account is banned"
                }
            })
        }

        if (user.rows.length > 0 && !user.rows[0].isemailverified) {
            const authToken = createToken(user.rows[0].userid, user.rows[0].universityid)
            return res.status(401).json({
                authToken,
                errors: {
                    email: 'This email is already registered but not verified. Please verify your email.',
                },
            });
        }
        const domain = getEmailDomain(email);
        const uniRequest = await db.query("SELECT * FROM universities WHERE studentdomain=$1 OR instructordomain=$1",[domain]);
        if(uniRequest.rowCount === 0) res.status(400).json("your university is not supported");
        const type = domain == uniRequest.rows[0].studentdomain;
        const result = await db.query('INSERT INTO users(username, email, password, isEmailVerified,isStudent,universityid,isBanned) VALUES ($1,$2,$3,false,$4,$5,$6) RETURNING *',[username,email,password,type,uniRequest.rows[0].universityid,false]);
        const authToken = createToken(result.rows[0].userid, result.rows[0].universityid)
        res.status(200).json({
            message: "user inserted successfully",
            authToken,
            userData: result.rows[0]
        });
    }
    catch(e){
        const errors = handleErrors(e);
        res.status(400).json(errors);
    }
};

module.exports.login_post = async (req, res) => {
    let { email, password } = req.body;
    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({
                errors: {
                    email: 'That email is not registered.',
                },
            });
        }
        if(user.rows.isBanned){
            return res.status(400).json({
                errors:{
                    email:"this account is banned"
                }
            })
        }
        const isPasswordValid = await compareHashedText(password, user.rows[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({
                errors: {
                    password: 'Incorrect password.',
                },
            });
        }
        const authToken = createToken(user.rows[0].userid, user.rows[0].universityid);
        if (!user.rows[0].isemailverified) {
            return res.status(401).json({
                authToken,
                errors: {
                    email: 'Please verify your email before logging in.',
                },
            });
        }
        if(!user.rows[0].majorid && !user.rows[0].campusid){
            
            return res.status(201).json(authToken);
        }
        res.status(200).json({
            message: 'Login successful',
            authToken,
            userData: user.rows[0]
        });

    } catch (e) {
        const errors = handleErrors(e);
        console.error(e);
        res.status(400).json( errors );
    }
};

module.exports.addAdditionalUserData = async (req, res)=>{
    const {majorId, campusId, optionalData} = req.body;
    console.log(optionalData);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Authorization header missing" });
    }
    try{
        const { userId, universityId } = verifyToken(token);
        await db.query(`UPDATE users SET majorid = $1, campusid = $2 WHERE userid = $3`, [majorId, campusId, userId]);
        const majorChatroom = await db.query(`SELECT chatroomid FROM majors WHERE majorid=$1`,[majorId]);
        const campusChatroom = await db.query(`SELECT chatroomid FROM campusus WHERE campusid=$1`,[campusId]);
        await db.query(`INSERT INTO chatroom_members(userid,chatroomid) VALUES($1,$2)`,[userId,majorChatroom.rows[0].chatroomid]);
        await db.query(`INSERT INTO chatroom_members(userid,chatroomid) VALUES($1,$2)`,[userId,campusChatroom.rows[0].chatroomid]);
        if(optionalData.bio){
            await db.query(`UPDATE users SET bio = $1 WHERE userid = $2`, [optionalData.bio, userId]); 
        }
        if(optionalData.profilePicture){
            await db.query(`UPDATE users SET profilePicture = $1 WHERE userid = $2`, [optionalData.profilePicture, userId]); 
        }
        return res.status(200).json("data added succesfully");
    }
    catch(e){
        console.log(`error while adding additional data` + e);
        return res.status(500).json("error while adding additional data");
    }
}

module.exports.sendOtp = async (req, res) => {
    try {
        const { emailReceiver } = req.body;
        const token = req.headers.authorization;
        const { userId, universityId } = verifyToken(token);
        const result = await db.query(`SELECT emailOtpExpire FROM users WHERE userId = $1`, [userId]);
        if (result.rowCount === 0) {
            return res.status(400).json({ message: "userNotFound" });
        }
        const emailOtpExpire = result.rows[0].emailotpexpire;
        const now = DateTime.utc();

        if (emailOtpExpire) {
            const expireTime = DateTime.fromISO(emailOtpExpire, { zone: 'utc' });
            if (expireTime > now) {
                const minutesLeft = Math.ceil(expireTime.diff(now, 'minutes').minutes);
                return res.status(400).json({ 
                    message: "otpAlreadySent", 
                    minutesLeft 
                });
            }
        }
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        console.log("OTP: " + otp);
        const subject = "Email Verification";
        const expireAt = now.plus({ minutes: 3 }).toISO();
        const htmlContent = otpVerificationEmail(otp);
        await sendEmail(emailReceiver, subject, htmlContent);
        await db.query(`UPDATE users SET emailOtp = $1, emailOtpExpire = $2 WHERE userId = $3`, [otp, expireAt, userId]);
        res.status(200).json({ message: "otpSent" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "internalServerError" });
    }
};


module.exports.verifyOtp = async (req, res) => {
    try {
        const { enteredOtp } = req.body;
        const token = req.headers.authorization;
        const { userId, universityId } = verifyToken(token);

        const result = await db.query(`SELECT emailOtp, emailOtpExpire FROM users WHERE userId = $1`, [userId]);
        if (result.rowCount === 0) {
            return res.status(400).json({ message: "userNotFound" });
        }

        const { emailotp, emailotpexpire } = result.rows[0];
        const now = DateTime.utc();

        if (!emailotp || !emailotpexpire) {
            return res.status(400).json({ message: "otpNotGenerated" });
        }

        const expireTime = DateTime.fromISO(emailotpexpire, { zone: 'utc' });
        if (now > expireTime) {
            return res.status(400).json({ message: "otpExpired" });
        }
        if (emailotp !== parseInt(enteredOtp, 10)) {
            return res.status(400).json({ message: "invalidOtp" });
        }

        await db.query(`UPDATE users SET emailOtp = NULL, emailOtpExpire = NULL, isEmailVerified = true WHERE userId = $1`, [userId]);

        res.status(200).json({ message: "otpVerified" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "internalServerError" });
    }
};

module.exports.getUser = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const { userId, universityId } = verifyToken(token);

        const result = await db.query(`SELECT * FROM users WHERE userId = $1`, [userId]);
        if (result.rowCount === 0) {
            return res.status(400).json({ message: "userNotFound" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "internalServerError" });
    }
};

module.exports.getAllUniversityUsers = async (req,res)=>{
    const token = req.cookies.jwt;
      try {
        const {adminId, universityId} = universityVerifyToken(token);
        const request = await db.query(`SELECT * FROM users WHERE universityid=$1 ORDER BY created_at DESC`,[universityId]);
        return res.status(200).json(request.rows);
      }
      catch(e){
        console.log(e);
        return res.status(500).json("Internal server error");
      }
}

module.exports.banUser = async (req, res) => {
    const token = req.cookies.jwt;
    const { userid } = req.body;
  
    if (!userid) return res.status(400).json("Missing userid");
  
    try {
      await db.query(
        `UPDATE users SET isbanned = true WHERE userid = $1`,
        [userid]
      );
  
      return res.status(200).json("User has been banned successfully");
    } catch (e) {
      console.error(e);
      return res.status(500).json("Internal server error");
    }
  };

  
  module.exports.unbanUser = async (req, res) => {
    const token = req.cookies.jwt;
    const { userid } = req.body;
  
    if (!userid) return res.status(400).json("Missing userid");
  
    try {
      await db.query(
        `UPDATE users SET isbanned = false WHERE userid = $1`,
        [userid]
      );
  
      return res.status(200).json("User has been unbanned successfully");
    } catch (e) {
      console.error(e);
      return res.status(500).json("Internal server error");
    }
  };
  

  module.exports.deleteUser = async (req, res) => {
    const token = req.cookies.jwt;
    const { userId } = req.params;
    if (!userId) return res.status(400).json("Missing userid");
  
    try {
      const { adminId, universityId } = universityVerifyToken(token);
      await db.query(`DELETE FROM users WHERE userid = $1`, [userId]);
  
      return res.status(200).json("User has been deleted successfully");
    } catch (e) {
      console.error(e);
      return res.status(500).json("Internal server error");
    }
  };
  

module.exports.getUserAccountInfo = async (req, res)=>{
    try {
        const { profileUserId } = req.params;

        const result = await db.query(`
            SELECT
             u.userId,
             u.username,
             u.email,
             u.isStudent,
             u.bio,
             u.profilePicture,
             u.created_at,
             c.name as campusName,
             m.name as majorName,
             un.name as universityName 
             FROM users as u JOIN campusus as c ON u.campusId = c.campusId JOIN majors as m ON u.majorId = m.majorId JOIN universities as un ON u.universityId = un.universityId WHERE u.userId=$1`
             ,[profileUserId]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error getting profile info :", error);
        res.status(500).json({ message: "internalServerError" });
    }
}