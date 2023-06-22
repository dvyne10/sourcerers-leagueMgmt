import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  
    const navigate = useNavigate(); 
    const navigateInputOTP = () => { navigate('/inputotp', { state: {fromPage: 'Register'}}) }
    const navigateSignin = () => { navigate('/signin') }

  return (
    <div className="card" >
      <Card style={{ width: "90rem", padding: 20 }}>
        <h2 className="mb-4 center-text">Register</h2>
        <form action="">
        <div className="row">
            <div className="col-8 mb-3">
          <div className="row ">
            <div className="col-4 mb-3">
                <label htmlFor="username" className="form-label">
                    Username*
                </label>
                <input id="username" type="text" className="form-control" />
            </div>
            <div className="col-4 mb-3">
                <label htmlFor="password" className="form-label">
                    Password*
                </label>
                <input id="password" type="password" className="form-control" />
            </div>
            
          </div>
          <div className="row">
            <div className="col-4 mb-3">
                <label htmlFor="email" className="form-label">
                    Email*
                </label>
                <input id="email" type="email" className="form-control" />
            </div>
            <div className="col-4 mb-3">
                <label htmlFor="sports" className="form-label">
                    Sports of interest
                </label>
                <select id="sports" type="text" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-4 mb-3">
                <label htmlFor="firstName" className="form-label">
                    First Name*
                </label>
                <input id="firstName" type="text" className="form-control" />
            </div>
            <div className="col-4 mb-3">
                <label htmlFor="lastName" className="form-label">
                    Last Name*
                </label>
                <input id="lastName" type="text" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-4 mb-3">
                <label htmlFor="country" className="form-label">
                    Country*
                </label>
                <input id="country" type="text" className="form-control" />
            </div>
            <div className="col-4 mb-3">
                <label htmlFor="phone" className="form-label">
                    Phone Number
                </label>
                <input id="phone" type="number" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-4 mb-3">
                <label htmlFor="city" className="form-label">
                    City*
                </label>
                <input id="city" type="text" className="form-control" />
            </div>
            <div className="col-4 mb-3">
                <label htmlFor="province" className="form-label">
                    Province*
                </label>
                <input id="province" type="text" className="form-control" />
            </div>
          </div>
          </div>
          <div className="col-3 mb-3">
                <label htmlFor="upload" className="form-label ">
                    Profile picture
                </label>
                <img className="img-thumbnail mb-3" src="https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" alt="Profile image" />  
                <button id="upload" type="button" className="btn btn-secondary" >
                    Select image
                </button>
          </div>
          </div>
          <div className="d-flex justify-content-evenly width:10% mb-4">
            <button className="btn btn-dark" type="button" onClick={navigateInputOTP}>
              Create Account
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={navigateSignin}>
              Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Registration;
