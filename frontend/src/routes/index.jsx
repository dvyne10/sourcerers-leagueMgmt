import { createBrowserRouter } from "react-router-dom";
import { Blogs, Home, Layout, Leagues, NoPage, SignIn} from "../pages";
import About from "../pages/About";
import Contact from "../pages/Contact"; 
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms"; 
import CreateLeague from '../pages/CreateLeague';
import Notification from '../pages/Notification'; 
import Profile from '../pages/Profile'; 
import Search from '../pages/Search'; 
import Players from '../pages/Players'; 
import ForgotPassword from '../pages/ForgotPassword'; 
import InputOTP from '../pages/InputOTP'; 
import ResetPassword from '../pages/ResetPassword'; 
import AdminPage from '../pages/AdminPage'; 
import Registration from '../pages/Registration'; 
import LeagueDetails from '../pages/LeagueDetails'; 


const routes = createBrowserRouter([
  {
    path: "/",
    exact: true,
    element: <Home/>,
  },
  {
    path: "/layout",
    exact: true,
    element: <Layout/>,
  },
  {
    path: "/blogs",
    exact: true,
    element: <Blogs/>,
  },
  {
    path: "/leagues",
    exact: true,
    element: <Leagues/>,
  },
  {
    path: "/league",
    exact: true,
    element: <LeagueDetails />,
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
    element: <Registration/>,
  },
  {
    path: "/forgotPassword",
    exact: true,
    element: <ForgotPassword />,
  },
  {
    path: "/resetPassword",
    exact: true,
    element: <ResetPassword />,
  },
  {
    path: "/inputOTP",
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
    path: "/createLeague",
    exact: true, 
    element: <CreateLeague/>,
  },
  {
    path: "/notification",
    exact: true,
    element: <Notification/>,
  },
  {

    path: "/profile",
    exact: true, 
    element: <Profile/>,
  },
  {
    path: "/search",
    exact: true,
    element: <Search />,
  },
  {
    path: "/adminPage",
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
