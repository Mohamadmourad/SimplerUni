import axios from 'axios';


export const checkAuth = async (requiredPermission) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_END_POINT + '/role/checkPermission',
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
    return false;
  }
};
