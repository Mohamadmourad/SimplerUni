const {db} = require("../../db");
const generator = require('generate-password');
const { hashText } = require("../user/helper");
const { sendEmail } = require("../helper");
const { accountAcceptanceEmail, newUniversityRequestEmail } = require("../emailTemplates");
const { createToken, verifyToken } = require("./helper");
const { addRoleMethode, isAuthed } = require("../role/businessLogic");
const bcrypt = require('bcrypt');
const { createChatroom, deleteChatroom } = require("../chat/businessLogic");

module.exports.createUniversity = async (req, res)=>{
    let { universityName, universityEmail, username } = req.body;
    if(!universityName){
        return res.status(400).json({ error: "university name is required" });
    }
    const  Originalpassword = generator.generate({
        length: 15,
        numbers: true
    });
    const password = await hashText(Originalpassword);

    const result = await db.query('INSERT INTO universities(name) VALUES ($1) RETURNING *',[universityName]); 
    const  universityId = result.rows[0].universityid;
    const roleId = await addRoleMethode("generalAdmin",universityId,["universityDashboard"]);
    await db.query('INSERT INTO web_admins(username, password, universityid, roleid) VALUES ($1,$2,$3,$4)',[ username, password, universityId, roleId]);
    await createChatroom({name : `${universityName} global chat`, universityId});
    await createChatroom({name : `${universityName} Instructors`, universityId});
    const htmlContent = accountAcceptanceEmail(username, Originalpassword);

    await sendEmail(universityEmail, "simplerUni acceptance", htmlContent);
    console.log(Originalpassword)
    return res.status(200).json({
        message:"university created succesfully",
        universityId
    })
}

module.exports.universityLogin = async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query(`SELECT * FROM web_admins WHERE username=$1`, [username]);
  if (result.rowCount === 0) {
    return res.status(400).json({ error: "wrong credentials" });
  }
  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "wrong credentials" });
  }
  const adminId = user.adminid;
  const universityId = user.universityid;
  const maxAge = 3 * 24 * 60 * 60;
  const authToken = createToken(adminId, universityId, maxAge);
  res.cookie('jwt', authToken, { httpOnly: true, maxAge: maxAge * 1000 });
  return res.status(200).json({
    message: "login successful"
  });
};

module.exports.universityLogout = async (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true });
    return res.status(200).json({ message: "Logout successful" });
  } catch (e) {
    console.error("Error during logout:", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports.checkLogin = async (req,res)=>{
  const token = req.cookies.jwt;
 const {adminId} = verifyToken(token);
 if(adminId) return res.status(200).json("success");
 return res.status(500).json("unautherized");
}

module.exports.addStudentDomain = async (req, res)=>{
   const { studentDomain } = req.body;
   const token = req.cookies.jwt;
   try{
    const {adminId, universityId} = verifyToken(token);
    await db.query("UPDATE universities SET studentDomain=$1 WHERE universityid=$2",[studentDomain, universityId]);
    return res.status(200).json({message: "domains added succesfully"})
   }
   catch(e){
    console.log("error while adding the domains: ",e);
   }
}

module.exports.addIntructorDomain = async (req, res)=>{
  const { instructorDomain } = req.body;
  const token = req.cookies.jwt;
  try{
    const {adminId, universityId} = verifyToken(token);
   await db.query("UPDATE universities SET instructorDomain=$1 WHERE universityid=$2",[ instructorDomain, universityId]);
   return res.status(200).json({message: "domains added succesfully"})
  }
  catch(e){
   console.log("error while adding the domains: ",e);
  }
}

module.exports.addCampus = async (req, res)=>{
  const { campus, campususGroup } = req.body;
  const token = req.cookies.jwt;
  if(!campus && !campususGroup) return res.status(400).json({message:"campus or campsus are required"});
  try{
    const {adminId, universityId} = verifyToken(token);
    if(campus){
      const chatroomId = await createChatroom(campus, universityId);
      const result = await db.query('INSERT INTO campusus(name, universityid,chatroomid) VALUES ($1,$2,$3) RETURNING *',[campus,universityId,chatroomId]);
      return res.status(200).json({
        message: "campus added succesfully",
        campusId : result.rows[0].campusid
      });
    }
    else{
      for(let campus of campususGroup){
        const chatroomId = await createChatroom(campus, universityId);
        const result = await db.query('INSERT INTO campusus(name, universityid,chatroomid) VALUES ($1,$2,$3) RETURNING *',[campus,universityId,chatroomId]);
      }
      return res.status(200).json("campus added succesfully");
    }
   }
   catch(e){
    console.log("error while adding the campusus: ",e);
   }
}

module.exports.addMajor = async (req, res)=>{
  const { major, majors } = req.body;
  const token = req.cookies.jwt;
  if(!major && !majors) return res.status(400).json({message:"major or majors are required"});
  try{
    const {adminId, universityId} = verifyToken(token);
    if(major){
      const chatroomId = await createChatroom(major, universityId);
      console.log("second: ", chatroomId)
      const result = await db.query('INSERT INTO majors(name, universityid, chatroomid) VALUES ($1,$2,$3) RETURNING *',[major, universityId, chatroomId]);
      return res.status(200).json({
        message: "major added succesfully",
        major : result.rows[0].majorid
      });
    }
    else{
      for(let major of majors){
        const chatroomId = await createChatroom(major, universityId);
        const result = await db.query('INSERT INTO majors(name, universityid, chatroomid) VALUES ($1,$2,$3) RETURNING *',[major, universityId, chatroomId]);
      }
      return res.status(200).json({message: "majors added succesfully"});
    }
   }
   catch(e){
    console.log("error while adding the major: ",e);
   }
}

module.exports.getAllCampsus = async (req, res)=>{
  try{
    const token = req.cookies.jwt;
    if(!token)token = req.headers.authorization;
    const {adminId, universityId} = verifyToken(token);

    const result = await db.query("SELECT campusid,name FROM campusus WHERE universityid=$1",[universityId]);
    return res.status(200).json({
      message:"data retreive succsefull",
      data: result.rows
    });
  }
  catch(e){
    console.log("getting campsus error: ",e)
  }
}

module.exports.getAllMajors = async (req, res)=>{
  try{
    const token = req.cookies.jwt;
    if(!token)token = req.headers.authorization;
    const {adminId, universityId} = verifyToken(token);
    console.log("university id: ", universityId);
    const result = await db.query("SELECT majorid,name FROM majors WHERE universityid=$1",[universityId]);
    return res.status(200).json({
      message:"data retreive succsefull",
      data: result.rows
    });
  }
  catch(e){
    console.log("getting major error: ",e)
  }
}

module.exports.deleteCampus = async (req, res) => {
  const { campusId } = req.body;
  const token = req.cookies.jwt;
  if (!campusId) return res.status(400).json({ message: "campusId is required" });
  try {
    const {adminId, universityId} = verifyToken(token);
    const result = await db.query(
      'DELETE FROM campusus WHERE campusid=$1 AND universityid=$2 RETURNING *',
      [campusId, universityId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Campus not found or not authorized" });
    }
    const chatroomId = result.rows[0].chatroomid;
    await deleteChatroom(chatroomId);
    return res.status(200).json({ message: "campus deleted successfully" });
  } catch (e) {
    console.log("error while deleting the campus: ", e);
  }
};

module.exports.deleteMajor = async (req, res) => {
  const { majorId } = req.body;
  const token = req.cookies.jwt;
  if (!majorId) return res.status(400).json({ message: "majorId is required" });
  try {
    const {adminId, universityId} = verifyToken(token);
    const result = await db.query(
      'DELETE FROM university_majors WHERE majorid=$1 AND universityid=$2 RETURNING *',
      [majorId, universityId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Major not found or not authorized" });
    }
    const chatroomId = result.rows[0].chatroomid;
    await deleteChatroom(chatroomId);
    return res.status(200).json({ message: "major deleted successfully" });
  } catch (e) {
    console.log("error while deleting the major: ", e);
  }
};

module.exports.getUniversity = async (req,res)=>{
  const token = req.cookies.jwt;
  try {
    const {adminId, universityId} = verifyToken(token);
    const result = await db.query(
      'SELECT * FROM universities WHERE universityid=$1',
      [universityId]
    );
    return res.status(200).json( result.rows[0] );
  } catch (e) {
    console.log("error while getting university: ", e);
  }
}

module.exports.universityRequest = async(req,res)=>{
  const {name, email, phoneNumber, additionalInfo} = req.body;
  console.log(process.env.SUPER_ADMIN_EMAIL)
  await db.query(`INSERT INTO university_requests (name, email, phoneNumber, additional_information,status) VALUES ($1, $2, $3, $4,$5)`,[name, email, phoneNumber, additionalInfo,"pending"]);
  const htmlContent = newUniversityRequestEmail(name, email, phoneNumber, additionalInfo);
  await sendEmail(process.env.SUPER_ADMIN_EMAIL, "request", htmlContent);

  return res.status(200).json({message: "request sent successfully"});
}

module.exports.getPendingUniversityAcessList = async(req,res)=>{
  const token = req.cookies.jwt;
  try {
    const {adminId} = verifyToken(token);
    if(!await isAuthed("superAdmin", adminId)) return res.status(401).json({message: "Unauthorized"});
    const result = await db.query(
      `SELECT * FROM university_requests WHERE status=$1`,["pending"]);
    return res.status(200).json(result.rows);
  } catch (e) {
    console.log("error while getting university: ", e);
  }
}

module.exports.getAcceptedUniversityAcessList = async(req,res)=>{
  const token = req.cookies.jwt;
  try {
    const {adminId} = verifyToken(token);
    if(!await isAuthed("superAdmin", adminId)) return res.status(401).json({message: "Unauthorized"});
    const result = await db.query(
      `SELECT * FROM university_requests WHERE status=$1`,["approved"]);
    return res.status(200).json(result.rows);
  } catch (e) {
    console.log("error while getting university: ", e);
  }
}

module.exports.universityRequestAccept = async(req,res)=>{
  const token = req.cookies.jwt;
  const { requestId } = req.body;
  try {
    const { adminId } = verifyToken(token);
    if (!await isAuthed("superAdmin", adminId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await db.query(
      `UPDATE university_requests SET status=$1 WHERE requestid=$2 RETURNING *`,
      ["approved", requestId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "University request not found" });
    }
    return res.status(200).json({ message: "University request approved successfully", university: result.rows[0] });
  } catch (e) {
    console.error("Error while approving university request: ", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports.universityRequestReject = async(req,res)=>{
  const token = req.cookies.jwt;
  const { requestId } = req.body;
  console.log(requestId);
  try {
    const { adminId } = verifyToken(token);
    if (!await isAuthed("superAdmin", adminId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await db.query(
      `UPDATE university_requests SET status=$1 WHERE requestid=$2 RETURNING *`,
      ["rejected", requestId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "University request not found" });
    }
    return res.status(200).json({ message: "University request approved successfully", university: result.rows[0] });
  } catch (e) {
    console.error("Error while approving university request: ", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}