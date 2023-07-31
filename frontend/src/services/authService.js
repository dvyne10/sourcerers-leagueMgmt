import axios from "axios";

// const BASE_URL = "https://panicky-robe-mite.cyclic.app/api/users";
const BASE_URL = "http://localhost:8000/api/users";

// const headers = {
//   "Access-Control-Allow-Origin": "http://localhost:8000",
//   "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
//   "Access-Control-Allow-Headers":
//     "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
// };

async function login(email, password) {
  try {
    const response = await axios.post(
      `${BASE_URL}/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    

    return response;
  } catch (error) {
    console.log(error);
  }
}

async function registerUser(data) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, data, {
      withCredentials: true,
    });

    return response;
  } catch (error) {
    return error;
  }
}

export default {
  login,
  registerUser,
};
