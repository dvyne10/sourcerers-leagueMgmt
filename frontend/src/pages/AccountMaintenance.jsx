import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation } from 'react-router-dom';

const AccountMaintenance = () => {
  
    const [action, handleAction] = useState({type: "Register", title: "REGISTER"});
    const location = useLocation();
    useEffect(() => {
        const url = location.pathname.substring(1,4).toLowerCase()
        console.log(url)
        if (url === "reg") {
            handleAction({type: "Register", title: "REGISTER", button: "Create Account"})
        } else {
            handleAction({type: "Update", title: "UPDATE ACCOUNT", button: "Update Account", protect: "true"})
        }
    }, []);

    const navigate = useNavigate(); 
    const navigateCreateUpdate = () => { 
      if (action.type === "Register") {
        navigate('/inputotp', { state: {fromPage: 'Register'}}) 
      } else {
        navigate('/')  // TEMP ONLY. Change to user profile once available
      }
    }
    const navigateSignin = () => { navigate('/signin') }

  return (
    <div className="container mt-2" >
      <Card style={{ width: "60rem", padding: 20 }}>
        <h2 className="mb-4 center-text">{action.title}</h2>
        <form action="">
        <div className="row">
            <div className="col-9 mb-3">
          <div className="row ">
            <div className="col-5 mb-3">
                <label htmlFor="username" className="form-label">
                    Username*
                </label>
                <input id="username" type="text" className="form-control" />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="password" className="form-label">
                    Password*
                </label>
                <input id="password" type="password" className="form-control" />
            </div>
            
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="email" className="form-label">
                    Email*
                </label>
                <input id="email" type="email" className="form-control" disabled={action.protect} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="sports" className="form-label">
                    Sports of interest
                </label>
                <select id="sports" type="text" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="firstName" className="form-label">
                    First Name*
                </label>
                <input id="firstName" type="text" className="form-control" />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="lastName" className="form-label">
                    Last Name*
                </label>
                <input id="lastName" type="text" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="country" className="form-label">
                    Country*
                </label>
                <input id="country" type="text" className="form-control" />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="phone" className="form-label">
                    Phone Number
                </label>
                <input id="phone" type="number" className="form-control" />
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="city" className="form-label">
                    City*
                </label>
                <input id="city" type="text" className="form-control" />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="province" className="form-label">
                    Province*
                </label>
                <input id="province" type="text" className="form-control" />
            </div>
          </div>
          </div>
          <div className="col-3 mb-3 text-center">
                <label htmlFor="upload" className="form-label ">
                    Profile picture
                </label>
                <img className="img-thumbnail mb-3" src="https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" alt="Profile image" />  
                <button id="upload" type="button" className="btn btn-secondary" >
                    Select image
                </button>
          </div>
          </div>
          <div className="row justify-content-center">
            <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateCreateUpdate}>
              {action.button}
            </button>
            <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateSignin}>
              Login
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AccountMaintenance;
