import { useContext } from "react";
import AuthContext from "../context/authContext";

const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};

export default useAuth;

export const checkIfSignedIn = async function(){
  let isAdmin = false
  let isSignedIn = false
  const user = await localStorage.getItem("login");
  const parsedUserData = JSON.parse(user);
  if (parsedUserData) {
    isAdmin = parsedUserData.admin ? true : false
    isSignedIn = true
  }
  return {isSignedIn, isAdmin}
}