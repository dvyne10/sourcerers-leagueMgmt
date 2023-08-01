import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import loginService from "../services/authService";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [isSignedIn, setSignedIn] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoginError, setIsLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [otpError, setOTPError] = useState(false);
  const [otpErrorMessage, setOTPErrorMessage] = useState("");

  // this useeffect runs each time the value of isSignedIn changes
  useEffect(() => {
    getUserFromLocalStorage();
  }, [isSignedIn]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isSignedIn,
        isAdmin,
        login,
        registerUser,
        loginError,
        isLoginError,
        isLoading,
        verifyOTP,
        otpError,
        setOTPError,
        otpErrorMessage,
        registrationError,
        setOTPErrorMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  async function signIn(userType) {
    setSignedIn(true);
    if (userType === "ADMIN") {
      setAdmin(true);
      const adminObject = {
        name: "ADMIN",
        admin: true,
      };
      await localStorage.setItem("login", JSON.stringify(adminObject)); // temporarily persisting the user when loged in
    } else {
      setAdmin(false);
      await localStorage.setItem("login", JSON.stringify("user"));
    }
  }

  async function login(input, navigate) {
    const { username: email, password } = input;
    try {
      setIsLoading(true);
      const resp = await loginService.login(email, password);
      if (resp.data) {
        setIsLoading(false);
        const { requestStatus } = resp.data;
        if (requestStatus === "ACTC") {
          const { user } = resp.data;
          setSignedIn(true);
          if (user.userType === "USER") {
            navigate("/myprofile");
            setAdmin(false);
            await localStorage.setItem("login", JSON.stringify(user));
          } else if (user.userType === "ADMIN") {
            setAdmin(true);

            //temporal one
            const adminObject = {
              name: "ADMIN",
              admin: true,
            };
            await localStorage.setItem("login", JSON.stringify(adminObject));
            navigate("/adminusers");
          }
        } else if (requestStatus === "RJCT") {
          setSignedIn(false);
          setAdmin(false);
          setIsLoginError(true);
          const { message } = resp.data;
          setLoginError(message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function registerUser(currentValues, navigate) {
    try {
      const response = await loginService.registerUser(currentValues);
      console.log(response);
      if (response) {
        const { requestStatus } = response.data;
        if (requestStatus === "RJCT") {
          setRegistrationError(response.data.errMsg);
        } else {
          await localStorage.setItem(
            "login",
            JSON.stringify(response.data.user)
          );
          navigate("/inputotp", { state: { fromPage: "Register" } });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function verifyOTP(otp, navigate) {
    try {
      let user = await JSON.parse(localStorage.getItem("login"));
      const email = user.email;
      const data = { email, otp };
      const response = await loginService.verifyOTP(data);
      if (response) {
        const { requestStatus } = response.data;
        if (requestStatus === "RJCT") {
          setOTPError(true);
          setOTPErrorMessage(response.data.message);
          return;
        }
        setSignedIn(true);

        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // retrieving the data from the local storage
  async function getUserFromLocalStorage() {
    const user = await localStorage.getItem("login");
    const parsedUserData = JSON.parse(user);
    if (parsedUserData) {
      setAdmin(parsedUserData.admin);
      setSignedIn(true);
    }
  }

  async function signOut() {
    setSignedIn(false);
    setAdmin(false);
    await localStorage.clear();
  }
};

AuthContext.ProviderWrapper = AuthContextProvider;

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
