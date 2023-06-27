import { createContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext({});

const AuthContextProvider = ({ children }) => {
  const [value, setvalue] = useState(0);
  return (
    <AuthContext.Provider
      value={{
        changeValue,
        value,
      }}
    >
      {children}
    </AuthContext.Provider>
  );

  //this is an example function for using context in the whole app
  async function changeValue() {
    setvalue(value + 1);
  }
};

AuthContext.ProviderWrapper = AuthContextProvider;

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
