import { createContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {

  const [isSignedIn, setSignedIn] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  return (
    <AuthContext.Provider value={{signIn, signOut, isSignedIn, isAdmin}}>
          {children}
    </AuthContext.Provider>
  );

  async function signIn(userType) {
    setSignedIn(true)
    if (userType === "ADMIN") {
      setAdmin(true)
    } else {
      setAdmin(false)
    }
  }

  async function signOut(){
    setSignedIn(false)
    setAdmin(false)
  }

};

AuthContext.ProviderWrapper = AuthContextProvider;

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;