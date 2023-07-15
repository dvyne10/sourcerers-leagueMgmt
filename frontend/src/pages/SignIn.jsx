import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useNavigate } from 'react-router-dom';
import { useState }  from 'react';
import useAuth from "../hooks/auth";

const SignIn = () => {
  
  const navigate = useNavigate(); 
  const {signIn, isSignedIn} = useAuth()

  const [formValues, setFormValues] = useState({ username: "", password: "" })

  const [input, setInput] = useState({
    username: '',
    password: ''
   
  });

  const [error, setError] = useState({
    username: '',
    password: ''
  })

  const onInputChange = e => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  }


  
  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };
      switch (name) {
        case "username":
          if (!value) {
            stateObj[name] = "Username/Email is required.";
          }          
          break;
        case "password":
          if (!value) {
            stateObj[name] = "Password is required.";
          }  
          break;
        default:
          break;
      }
      return stateObj;
    });
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
            <input id="username" name="username" type="text" className="form-control" value={input.username} onChange={onInputChange} onBlur={validateInput}/>
            {error.username && <span className='err'>{error.username}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input id="password" name="password" type="password" className="form-control" value={input.password} onChange={onInputChange} onBlur={validateInput}/>
            {error.password && <span className='err'>{error.password}</span>}
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
