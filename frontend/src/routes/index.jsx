import { createBrowserRouter } from "react-router-dom";
import { Home, Leagues, NoPage, SignIn } from "../pages";
import About from "../pages/About";
import Contact from "../pages/Contact"; 
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import TeamMaintenance from "../pages/TeamMaintenance";
import LeagueMaintenance from "../pages/LeagueMaintenance";
import Teams from "../pages/Teams";
import Notification from "../pages/Notification";
import MyProfile from "../pages/MyProfile";
import Search from "../pages/Search";
import Players from "../pages/Players";
import Player from "../pages/Player";
import ChangePassword from "../pages/ChangePassword";
import ForgotPassword from "../pages/ForgotPassword";
import InputOTP from "../pages/InputOtp";
import ResetPassword from "../pages/ResetPassword";
import AdminPage from "../pages/AdminPages/AdminMain";
import AdminUserMnt from "../pages/AdminPages/AdminUserMnt";
import AdminTeamMnt from "../pages/AdminPages/AdminTeamMnt";
import AdminLeagueMnt from "../pages/AdminPages/AdminLeagueMnt";
import AdminRequestMnt from "../pages/AdminPages/AdminRequestMnt";
import AdminNotifMnt from "../pages/AdminPages/AdminNotifMnt";
import AdminMatchMnt from "../pages/AdminPages/AdminMatchMnt";
import AdminParmMnt from "../pages/AdminPages/AdminParmMnt";
import AccountMaintenance from "../pages/AccountMaintenance";
import LeagueDetails from "../pages/LeagueDetails";
import TeamDetails from "../pages/TeamDetails";
import MatchUpdate from "../pages/MatchUpdate";
import MatchDetailsSoccer from "../pages/MatchDetailsSoccer";
const routes = createBrowserRouter([
  {
    path: "/",
    exact: true,
    element: <Home />,
  },
  {
    path: "/leagues",
    exact: true,
    element: <Leagues />,
  },
  {
    path: "/league/:leagueid",
    exact: true,
    element: <LeagueDetails />,
  },
  {
    path: "/teams",
    exact: true,
    element: <Teams />,
  },
  {
    path: "/team/:teamid",
    exact: true,
    element: <TeamDetails />,
  },
  {
    path: "/players",
    exact: true,
    element: <Players />,
  },
  {
    path: "/player/:id",
    exact: true,
    element: <Player />,
  },
  {
    path: "/signin",
    exact: true,
    element: <SignIn />,
  },
  {
    path: "/register",
    exact: true,
    element: <AccountMaintenance />,
  },
  {
    path: "/updateaccount",
    exact: true,
    element: <AccountMaintenance />,
  },
  {
    path: "/changepassword",
    exact: true,
    element: <ChangePassword />,
  },
  {
    path: "/forgotpassword",
    exact: true,
    element: <ForgotPassword />,
  },
  {
    path: "/resetpassword",
    exact: true,
    element: <ResetPassword />,
  },
  {
    path: "/inputotp",
    exact: true,
    element: <InputOTP />,
  },
  {
    path: "/about",
    exact: true,
    element: <About />,
  },

  {
    path: "/privacy",
    exact: true,
    element: <Privacy />,
  },
  {
    path: "/terms",
    exact: true,
    element: <Terms />,
  },
  {
    path: "/createteam",
    exact: true,
    element: <TeamMaintenance />,
  },
  {
    path: "/updateteam/:teamid",
    exact: true,
    element: <TeamMaintenance />,
  },
  {
    path: "/createleague",
    exact: true,
    element: <LeagueMaintenance />,
  },
  {
    path: "/updateleague/:leagueid",
    exact: true,
    element: <LeagueMaintenance />,
  },
  {
    path: "/updatematch/:matchid",
    exact: true,
    element: <MatchUpdate />,
  },
  {
    path: "/matchdetails/:matchid",
    exact: true,
    element: <MatchDetailsSoccer />,
  },
  {
    path: "/notifications",
    exact: true,
    element: <Notification />,
  },
  {
    path: "/myprofile",
    exact: true,
    element: <MyProfile />,
  },
  {
    path: "/search",
    exact: true,
    element: <Search />,
  },
  {
    path: "/adminusers",
    exact: true,
    element: <AdminPage />,
  },
  {
    path: "/adminusercreation",
    exact: true,
    element: <AdminUserMnt />,
  },
  {
    path: "/adminuserupdate/:userid",
    exact: true,
    element: <AdminUserMnt />,
  },
  {
    path: "/adminteams",
    exact: true,
    element: <AdminPage />,
  },
  {
    path: "/adminteamcreation",
    exact: true,
    element: <AdminTeamMnt />,
  },
  {
    path: "/adminteamupdate/:teamid",
    exact: true,
    element: <AdminTeamMnt />,
  },
  {
    path: "/adminleagues",
    exact: true,
    element: <AdminPage />,
  },
  {
    path: "/adminleaguecreation",
    exact: true,
    element: <AdminLeagueMnt />,
  },
  {
    path: "/adminleagueupdate/:leagueid",
    exact: true,
    element: <AdminLeagueMnt />,
  },
  {
    path: "/adminmatches",
    exact: true,
    element: <AdminPage />,
  },
  {
    path: "/adminmatchupdate/:matchid",
    exact: true,
    element: <AdminMatchMnt />,
  },
  {
    path: "/adminrequests",
    exact: true,
    element: <AdminPage />,
  },
  {
    path: "/adminrequestcreation",
    exact: true,
    element: <AdminRequestMnt />,
  },
  {
    path: "/adminrequestupdate/:requestid",
    exact: true,
    element: <AdminRequestMnt />,
  },
  {
    path: "/adminnotifications",
    exact: true,
    element: <AdminPage />,
  },
  {
    path: "/adminnotifcreation",
    exact: true,
    element: <AdminNotifMnt />,
  },
  {
    path: "/adminnotifupdate/:notifid",
    exact: true,
    element: <AdminNotifMnt />,
  },
  {
    path: "/adminsystemparameters",
    exact: true,
    element: <AdminPage />,
  },
  {
    path: "/adminparmcreation",
    exact: true,
    element: <AdminParmMnt />,
  },
  {
    path: "/adminparmupdate/:parmid",
    exact: true,
    element: <AdminParmMnt />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "*",
    exact: true,
    element: <NoPage />,
  },
]);

export default routes;
