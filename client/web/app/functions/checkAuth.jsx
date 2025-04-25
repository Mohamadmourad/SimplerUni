import axios from 'axios';


export const checkAuth = async (requiredPermission) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/role/checkPermission',
      { permission: requiredPermission },
      {
        withCredentials: true,
      }
    );
    if(response.data == true){
      return true;
    }
    else{
      return false;
    }
  } catch (error) {
    console.log("test")
    return false;
  }
};
