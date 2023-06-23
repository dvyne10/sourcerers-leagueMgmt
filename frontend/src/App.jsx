import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import NavigationComponent from "./components/NavigationComponent";
import FooterComponent from "./components/FooterComponent";
import AuthContext from "./context/authContext";

export default function App() {
  return (
    <>
      <AuthContext.Provider>
        <div className="App">
          <NavigationComponent />
          <RouterProvider router={routes} />
          <FooterComponent />
        </div>
      </AuthContext.Provider>
    </>
  );
}
