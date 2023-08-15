import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {getToken} from "../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const NotificationContext = createContext({});
const token = `Bearer ${getToken()}`

const NotificationContextProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetch(`${backend}/notifunreadcount`, {
      method: "POST",
      credentials: 'include',
      headers: {
          "Content-Type": "Application/JSON",
          "Authorization": token
      }
    })
    .then(response => response.json())
    .then(data => {
      setNotificationCount(data)
    })
  }, []);



  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

NotificationContext.ProviderWrapper = NotificationContextProvider;

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NotificationContext;
