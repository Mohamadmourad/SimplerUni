const { verifyToken } = require("../university/helper");

module.exports.checkAdminToken =(token)=>{
    const result = verifyToken(token);

  if (result.id) {
     return result.id;
  } else {
    throw 'Invalid token or expired token';
  }
}