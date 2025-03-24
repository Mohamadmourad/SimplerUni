const {db} = require("../../db");
const generator = require('generate-password');
const { hashText } = require("../user/helper");
const { sendEmail } = require("../helper");
const { accountAcceptanceEmail } = require("../emailTemplates");
const { createToken } = require("./helper");
const { addRole } = require("../role/businessLogic");
const bcrypt = require('bcrypt');

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
    const roleId = await addRole("general admin",universityId,["universityDashboard"]);
    await db.query('INSERT INTO web_admins(username, password, universityid, roleid) VALUES ($1,$2,$3,$4)',[ username, password, universityId, roleId]);

    const htmlContent = accountAcceptanceEmail(username, Originalpassword);

    await sendEmail(universityEmail, "simplerUni acceptance", htmlContent);

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
  const universityId = user.adminid;
  const maxAge = 3 * 24 * 60 * 60;
  const authToken = createToken(universityId, maxAge);
  res.cookie('jwt', authToken, { httpOnly: true, maxAge: maxAge * 1000 });
  return res.status(200).json({
    message: "login successful"
  });
};

const checkUniversityAuth = async (token)=>{
    const result = verifyToken(token);

    if (result.id) {
       return result.id;
    } else {
      throw 'Invalid token or expired token';
    }
}

const getUniversityId = async (adminId)=>{
  const result = await db.query("SELECT * FROM web_admins WHERE adminin=$1",[adminId]);
  return result.rows[0].universityid;
}

module.exports.addDomains = async (req, res)=>{
   const { studentDomain, instructorDomain } = req.body;
   const token = req.cookies.jwt;
   try{
    const adminId = checkUniversityAuth(token);
    const universityId = getUniversityId(adminId);
    await db.query("UPDATE universities SET studentDomain=$1, instructorDomain=$2 WHERE universityid=$3",[studentDomain, instructorDomain, universityId]);
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
    const adminId = checkUniversityAuth(token);
    const universityId = getUniversityId(adminId);
    if(campus){
      const result = await db.query('INSERT INTO campusus(name, universityid) VALUES ($1,$2) RETURNING *',[campus,universityId]);
      return res.status(200).json({
        message: "campus added succesfully",
        campusId : result.rows[0].campusid
      });
    }
    else{
      for(let campus of campususGroup){
        await db.query('INSERT INTO campusus(name, universityid) VALUES ($1,$2) RETURNING *',[campus,universityId]);
      }
      return res.status(200).json({message: "campus added succesfully"});
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
    const adminId = checkUniversityAuth(token);
    const universityId = getUniversityId(adminId);
    if(major){
      const result = await db.query('INSERT INTO university_majors(name, universityid) VALUES ($1,$2) RETURNING *',[major,universityId]);
      return res.status(200).json({
        message: "major added succesfully",
        major : result.rows[0].majorid
      });
    }
    else{
      for(let major of majors){
        await db.query('INSERT INTO university_majors(name, universityid) VALUES ($1,$2) RETURNING *',[major,universityId]);
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
    const adminId = checkUniversityAuth(token);
    const universityId = getUniversityId(adminId);

    const result = await db.query("SELECT campusid,name FROM campusus WHERE universityid=$1",[universityId]);
    return res.status(200).json({
      message:"data retreive succsefull",
      data: result.rows[0]
    });
  }
  catch(e){
    console.log("getting campsus error: ",e)
  }
}

module.exports.getAllMajors = async (req, res)=>{
  try{
    const token = req.cookies.jwt;
    const adminId = checkUniversityAuth(token);
    const universityId = getUniversityId(adminId);

    const result = await db.query("SELECT majorid,name FROM majors WHERE universityid=$1",[universityId]);
    return res.status(200).json({
      message:"data retreive succsefull",
      data: result.rows[0]
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
    const adminId = checkUniversityAuth(token);
    const universityId = getUniversityId(adminId);
    const result = await db.query(
      'DELETE FROM campusus WHERE campusid=$1 AND universityid=$2 RETURNING *',
      [campusId, universityId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Campus not found or not authorized" });
    }
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
    const adminId = checkUniversityAuth(token);
    const universityId = getUniversityId(adminId);
    const result = await db.query(
      'DELETE FROM university_majors WHERE majorid=$1 AND universityid=$2 RETURNING *',
      [majorId, universityId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Major not found or not authorized" });
    }
    return res.status(200).json({ message: "major deleted successfully" });
  } catch (e) {
    console.log("error while deleting the major: ", e);
  }
};


module.exports.getUniversity = async (req,res)=>{
  
}