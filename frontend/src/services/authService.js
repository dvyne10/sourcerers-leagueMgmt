import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000/api/users" : "https://panicky-robe-mite.cyclic.app/api/users";

async function login(email, password) {
  try {
    console.log(BASE_URL)
    const response = await axios.post(
        `${BASE_URL}/login`,
        {
          email,
          password,
        }, 
        { withCredentials: true, credentials: 'include' }
      )

    return response;
  } catch (error) {
    console.log(error);
  }
}

async function registerUser(data) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, data, {
      withCredentials: true, credentials: 'include'
    });

    return response;
  } catch (error) {
    return error;
  }
}

async function verifyOTP(data) {
  try {
    const response = await axios.post(`${BASE_URL}/verifyotp`, data, {
      withCredentials: true, credentials: 'include'
    });

    return response;
  } catch (error) {
    return error;
  }
}

async function logout() {
  try {
    const response = await axios.post(`${BASE_URL}/logout`, {
      withCredentials: true, credentials: 'include'
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export default {
  login,
  registerUser,
  verifyOTP,
  logout,
};
