import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from 'react'
import useAuth from "../hooks/auth";

const ChangePassword = () => {

  const navigate = useNavigate(); 
  const { isSignedIn } = useAuth()
  const navigateReturn = () => { navigate(-1) }
  const navigateSubmitChange = () => { navigate(-1) }

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/signin')
    }
  })

  const [input, setInput] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [error, setError] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
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
        case "currentPassword":
          if (!value) {
            stateObj[name] = "Current password is required.";
          }
          
          break;

        case "newPassword":
          if (!value) {
            stateObj[name] = "New password is required.";
          }  
          else if (input.currentPassword && value == input.currentPassword) {
            stateObj["currentPassword"] = "Password and Confirm Password are same.";
          }
            else if (input.confirmNewPassword && value !== input.confirmNewPassword) {
            stateObj["confirmNewPassword"] = "Password and Confirm Password does not match.";
          } else {
            stateObj["confirmNewPassword"] = input.confirmNewPassword ? "" : error.confirmNewPassword;
            stateObj["currentPassword"] = input.currentPassword ? "" : error.currentPassword;
          }
          break;

        case "confirmNewPassword":
          if (!value) {
            stateObj[name] = "Confirm new password is required.";
          } else if (input.newPassword && value !== input.newPassword) {
            stateObj[name] = "Password and Confirm Password does not match.";
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  }



  return (
    <div className="card-wrapper">
      <Card style={{ width: "25rem", padding: 20 }}>
        <h2 className="mb-4 center-text">Change Password</h2>
        <form action="">
          <div className="mb-3">
            <label htmlFor="currentPassword" className="form-label">
              Current Password*
            </label>
            <input id="currentPassword" name="currentPassword" type="text"  className="form-control" value={input.currentPassword} onChange={onInputChange} onBlur={validateInput}/>
            {error.currentPassword && <span className='err'>{error.currentPassword}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password*
            </label>
            <input id="newPassword" name="newPassword" type="password" className="form-control" value={input.newPassword} onChange={onInputChange} onBlur={validateInput}/>
            {error.newPassword && <span className='err'>{error.newPassword}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password*
            </label>
            <input id="confirmNewPassword" name="confirmNewPassword" type="password" className="form-control" value={input.confirmNewPassword} onChange={onInputChange} onBlur={validateInput}/>
            {error.confirmNewPassword && <span className='err'>{error.confirmNewPassword}</span>}
          </div>
          <div className="d-flex justify-content-evenly width:100% mb-4">
            <button type="button" className="btn btn-primary" onClick={navigateSubmitChange}>
              Change Password
            </button>
            <button type="button" className="btn btn-secondary" onClick={navigateReturn}>
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;