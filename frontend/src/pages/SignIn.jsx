import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  
  const navigate = useNavigate(); 
  const navigateForgotPassword = () => { navigate('/forgotpassword') }
  const navigateProfile = () => {
    // if (userName === "admin") {
      navigate('/adminpage') 
    // } else {
    //   navigate('/adminpage') 
    // }
  }
  const navigateRegister = () => { navigate('/register') }

  return (
    <div className="card-wrapper">
      <Card style={{ width: "25rem", padding: 20 }}>
        <h2 className="mb-4 center-text">Sign In</h2>
        <form action="">
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Username/email
            </label>
            <input id="name" type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input id="password" type="password" className="form-control" />
          </div>
          <Form.Check
            type={"checkbox"}
            id={`default-checkbox`}
            label={`remember me`}
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
              Not registered? Register
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
