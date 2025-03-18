const {db} = require("../../db");
const generator = require('generate-password');
const { hashText } = require("../user/helper");
const { sendEmail } = require("../helper");
const { accountAcceptanceEmail } = require("../emailTemplates");
const { createToken } = require("./helper");

module.exports.createUniversity = async (req, res)=>{
    let { universityName, universityEmail } = req.body;
    if(!universityName){
        return res.status(400).json({ error: "university name is required" });
    }
    let serialNumber = "";
    for(let i = 0;i<4;i++){
      const random = generator.generate({ length: 7, numbers: true });
      serialNumber += random;
      i !== 3 ? serialNumber += '-' : null;
    }
    const  Originalpassword = generator.generate({
        length: 15,
        numbers: true
    });
    const password = await hashText(Originalpassword);

    const result = await db.query('INSERT INTO universities(name, serialNumber, password) VALUES ($1,$2,$3) RETURNING *',[universityName,serialNumber,password]);

    const  universityId = result.rows[0].universityid;
    const htmlContent = accountAcceptanceEmail(serialNumber, password);

    await sendEmail(universityEmail, "simplerUni acceptance", htmlContent);

    return res.status(200).json({
        message:"university created succesfully",
        universityId
    })
}

module.exports.universityLogin = async (req, res)=>{
  const { serialNumber, password } = req.body;

  const result = await db.query(`SELECT * FROM universities WHERE serialNumber=$1 AND password=$2`,([serialNumber, password]));

  if(result.rowCount === 0){
    return res.status(400).json({ error: "wrong credentials" });
  }

  const universityId = result.rows[0].universityid;

  const authToken = createToken(universityId);
  res.cookie('jwt', authToken, { httpOnly: true, maxAge: maxAge * 1000 });

  return res.status(200).json({
    message: "login succesful"
  })
}

const checkUniversityAuth = async (token)=>{
    const result = verifyToken(token);

    if (result.id) {
       return result.id;
    } else {
      throw 'Invalid token or expired token';
    }
}

module.exports.addDomains = async (req, res)=>{
   const { studentDomain, instructorDomain } = req.body;
   const token = req.cookies.jwt;
   try{
    const universityId = checkUniversityAuth(token);
    await db.query("UPDATE universities SET studentDomain=$1, instructorDomain=$2 WHERE universityid=$3",([studentDomain, instructorDomain, universityId]));
    return res.status(200).json({message: "domains added succesfully"})
   }
   catch(e){
    console.log("error while adding the domains: ",e);
   }
}