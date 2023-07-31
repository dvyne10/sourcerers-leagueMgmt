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
        isLoading
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
      setIsLoading(true)
      const data = await loginService.login(email, password);
      console.log(data);
      if (data.data) {
        setIsLoading(false)
        const { requestStatus } = data.data;

        if (requestStatus === "ACTC") {
          const { user } = data.data;
          setSignedIn(true);
          if (user.userType === "USER") {
            navigate("/myprofile");
            setAdmin(false);
            await localStorage.setItem("login", JSON.stringify(user));
          } else {
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
          setIsLoginError(true);
          const { message } = data.data;
          setLoginError(message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function registerUser(currentValues) {
    try {
      const data = await loginService.registerUser(currentValues);
      console.log(data);
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
