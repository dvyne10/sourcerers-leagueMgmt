import axios from "axios";

//const BASE_URL = 'https://panicky-robe-mite.cyclic.app/'
const BASE_URL = "http://localhost:8000/api/users";

async function loginService(email, password) {
  try {
    const data = axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}

export default {
  loginService,
};
