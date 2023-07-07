import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [isSignedIn, setSignedIn] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  // this useeffect runs each time the value of isSignedIn changes
  useEffect(() => {
    getUserFromLocalStorage();
  }, [isSignedIn]);

  return (
    <AuthContext.Provider value={{ signIn, signOut, isSignedIn, isAdmin }}>
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
    await localStorage.clear()
  }
};

AuthContext.ProviderWrapper = AuthContextProvider;

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
