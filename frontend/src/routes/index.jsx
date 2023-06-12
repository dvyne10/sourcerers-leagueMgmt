import { createBrowserRouter } from "react-router-dom";
import { Blogs, Home, Layout, Leagues, NoPage, SignIn } from "../pages";

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
    path: "/signin",
    exact: true,
    element: <SignIn/>,
  },
  {
    path: "*",
    exact: true,
    element: <NoPage/>,
  },
]);

export default routes;
