import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const NotificationContext = createContext({});

const notificationsArray = [
  {
    read: true,
    title: "notification",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", // Curabitur justo orci, tempus ut eros in, fermentum maximus turpis. Nullam sit amet mattis libero. Maecenas ut mi vel quam finibus imperdiet. Phasellus eu justo non elit ornare sollicitudin in sit amet ante. Morbi facilisis auctor diam id imperdiet. Praesent et eleifend ante, sed sagittis nisl. In nec dui vitae dolor elementum tristique. Nunc in neque nec risus accumsan lobortis sit amet vel leo. In blandit tempus elementum. Vivamus et odio consequat tortor malesuada blandit. Donec sed ligula leo. Pellentesque vel magna vel leo iaculis lobortis.",
  },
  {
    read: false,
    title: "notification",
    content: "this is is a new notification",
  },
  {
    read: true,
    title: "notification",
    content: "this is is a new notification",
  },
  {
    read: false,
    title: "notification",
    content: "this is is a new notification",
  },
  {
    read: false,
    title: "notification",
    content: "this is is a new notification",
  },
];

const NotificationContextProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState(notificationsArray);

  useEffect(() => {
    const count = notifications.map((e) => e.read === true);
    setNotificationCount(count.length-count.filter(Boolean).length);
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        notifications,
        setNotifications,
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
