const AWS = require("aws-sdk");

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
