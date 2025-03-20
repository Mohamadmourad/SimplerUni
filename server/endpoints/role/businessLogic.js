const {db} = require("../../db");

module.exports.addRole = async (roleName, universityId, permissions)=>{
  if(!roleName || !universityId || !permissions){
        return res.status(400).json({ error: "wrong parameters" });
  }
  try{
    const result = await db.query("INSERT INTO roles(name, universityid) VALUES ($1,$2) RETURNING *",[roleName, universityId]);
    const roleId = result.rows[0].roleid;
    const permissionQueries = permissions.map(permission =>
      db.query("INSERT INTO role_permissions(name, roleid) VALUES ($1, $2)", [permission, roleId])
    );
    await Promise.all(permissionQueries); 

    return roleId;
  }
  catch(e){
    console.log(e)
    res.status(500).json({message:"error happend while adding role"})
  }
}