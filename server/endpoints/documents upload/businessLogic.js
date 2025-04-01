const AWS = require("aws-sdk");
const Papa = require("papaparse");
const XLSX = require("xlsx");
const fs = require("fs");

module.exports.uploadDocument = async (fileData, userId) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
    signatureVersion: "v4",
  });
  const regex = /^data:(image\/[a-zA-Z]*);base64,(.*)$/;
  const match = fileData.match(regex);
  if (!match) {
    throw new Error('Invalid file format.');
  }
  const base64Clean = match[2];
  const fileBuffer = Buffer.from(base64Clean, "base64");
  if (fileBuffer.length > 25 * 1024 * 1024) {
    throw new Error("File size exceeds 25 MB limit.");
  }
  const extension = match[1].split("/")[1];
  const key = `${userId}-${Date.now()}.${extension}`;
  await s3
    .putObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: match[1],
    })
    .promise();
  const cloudfrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;
  return cloudfrontUrl;
};

module.exports.uploadCampusesDocument = async(req,res)=>{
  const filePath = req.file.path;
  const fileExt = req.file.originalname.split(".").pop();

  try {
    let data;
    
    if (fileExt === "csv") {
      const fileContent = fs.readFileSync(filePath, "utf8");
      data = Papa.parse(fileContent, { header: true }).data;
    } else if (fileExt === "xlsx") {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }
    fs.unlinkSync(filePath);
    const result = {
      campuses: data.map(item => item.campuses).filter(campus => campus !== undefined),
    };
    if(result.campuses.length === 0)res.status(400).json("wrong format or empty file");
    res.status(200).json(result.campuses);
  } catch (error) {
    res.status(500).json({ error: "Error processing file" });
  }
}

module.exports.uploadMajorsDocument = async(req,res)=>{
  const filePath = req.file.path;
  const fileExt = req.file.originalname.split(".").pop();

  try {
    let data;
    
    if (fileExt === "csv") {
      const fileContent = fs.readFileSync(filePath, "utf8");
      data = Papa.parse(fileContent, { header: true }).data;
    } else if (fileExt === "xlsx") {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }
    fs.unlinkSync(filePath);
    const result = {
      majors: data.map(item => item.majors).filter(major => major !== undefined)
    };
    if(result.majors.length === 0)res.status(400).json("wrong format or empty file");
    res.status(200).json(result.majors);
  } catch (error) {
    res.status(500).json({ error: "Error processing file" });
  }
}

