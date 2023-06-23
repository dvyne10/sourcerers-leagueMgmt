import { createBrowserRouter } from "react-router-dom";
import { Home, Leagues, NoPage, SignIn} from "../pages";
import About from "../pages/About";
import Contact from "../pages/Contact"; 
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms"; 
import LeagueMaintenance from '../pages/LeagueMaintenance';
import Notification from '../pages/Notification'; 
import Search from '../pages/Search'; 
import Players from '../pages/Players'; 
import ForgotPassword from '../pages/ForgotPassword'; 
import InputOTP from '../pages/InputOTP'; 
import ResetPassword from '../pages/ResetPassword'; 
import AdminPage from '../pages/AdminPage'; 
import AccountMaintenance from '../pages/AccountMaintenance'; 
import LeagueDetails from '../pages/LeagueDetails'; 

const routes = createBrowserRouter([
  {
    path: "/",
    exact: true,
    element: <Home/>,
  },
  {
    path: "/leagues",
    exact: true,
    element: <Leagues/>,
  },
  {
    path: "/league/:leagueid",
    exact: true,
    element: <LeagueDetails/>,
  },
  {
    path: "/players",
    exact: true,
    element: <Players/>,
  },
  {
    path: "/signin",
    exact: true,
    element: <SignIn/>,
  },
  {
    path: "/register",
    exact: true,
    element: <AccountMaintenance/>,
  },
  {
    path: "/updateaccount/:userid",
    exact: true,
    element: <AccountMaintenance/>,
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
    element: <About/>,
  },
  {
    path: "/contact",
    exact: true, 
    element: <Contact/>,
  },
  {
    path: "/privacy",
    exact: true,
    element: <Privacy/>,
  },
  {
    path: "/terms",
    exact: true,
    element: <Terms/>,
  },
  {
    path: "/createleague",
    exact: true, 
    element: <LeagueMaintenance/>,
  },
  {
    path: "/updateleague/:leagueid",
    exact: true, 
    element: <LeagueMaintenance/>,
  },
  {
    path: "/notifications",
    exact: true,
    element: <Notification/>,
  },
  {
    path: "/search",
    exact: true,
    element: <Search />,
  },
  {
    path: "/adminpage",
    exact: true,
    element: <AdminPage />,
  },
  {
    path: "*",
    exact: true,
    element: <NoPage/>,
  },
]);

export default routes;
