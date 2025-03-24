const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
});

module.exports.uploadDocument = async (document, type) => {
  const key = `${type}-${Date.now()}`;
  await s3
    .putObject({
      Body: document,
      Bucket: "simpleruni", 
      Key: key,
    })
    .promise();

  const cloudfrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;

  return {
    message: "File uploaded successfully",
    cloudfrontUrl,
  };
};

// module.exports.getDocument = async (key) => {
//   try {
//     const result = await s3
//       .getObject({
//         Bucket: "simpleruni",
//         Key: key,
//       })
//       .promise();

//     return result.Body.toString("utf-8");
//   } catch (error) {
//     console.error("S3 Get Error:", error);
//     throw error;
//   }
// };

module.exports.getDocumentUrl = (key) => {
  return `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;
};
