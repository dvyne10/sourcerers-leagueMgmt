import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useNavigate } from 'react-router-dom';
import { useState }  from 'react';
import useAuth from "../hooks/auth";

const SignIn = () => {
  
  const navigate = useNavigate(); 
  const {signIn, isSignedIn} = useAuth()

  const [formValues, setFormValues] = useState({ username: "", password: "" })

  const handleFormChange = (e) => {
    const field = e.target.name
    setFormValues({ ...formValues, [field] : e.target.value })
  }

  const navigateForgotPassword = () => { navigate('/forgotpassword') }
  const navigateProfile = () => {
    if (formValues.username.toLowerCase() === "admin") {    // TEMP ONLY
      signIn("ADMIN")
      navigate('/adminusers') 
    } else {
      signIn()
      navigate('/myprofile') 
    }
  }
  const navigateRegister = () => { navigate('/register') }

  return (
    <div className="card-wrapper">
      <Card style={{ width: "25rem", padding: 20 }}>
        <h2 className="mb-4 center-text">Sign In</h2>
        <form action="">
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username/Email
            </label>
            <input id="username" name="username" type="text" className="form-control" onChange={handleFormChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input id="password" name="password" type="password" className="form-control" />
          </div>
          <Form.Check
            type={"checkbox"}
            id={`default-checkbox`}
            label={`Remember me`}
            className="mb-4 "
          />
          <div className="d-flex justify-content-evenly width:100% mb-4">
            <button className="btn btn-primary sign-in-btn" type="button" onClick={navigateProfile}>
              Sign In
            </button>
            <button type="button" className="btn btn-light" onClick={navigateForgotPassword}>
              Forgot password?
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-link" onClick={navigateRegister}>
              Not registered? Register here
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
