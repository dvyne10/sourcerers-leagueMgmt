import "./App.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import NavigationComponent from "./components/NavigationComponent";
import FooterComponent from './components/FooterComponent';


export default function App() {
  
  return (
    
    <>
      <div className="App">
        <NavigationComponent />
        <RouterProvider router={routes} />
        <FooterComponent />        
      </div>
    </>
  );
}
