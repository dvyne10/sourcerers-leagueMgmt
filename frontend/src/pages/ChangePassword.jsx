import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {

  const navigate = useNavigate(); 
  const navigateReturn = () => { navigate(-1) }
  const navigateSubmitChange = () => { navigate(-1) }

  return (
    <div className="card-wrapper">
      <Card style={{ width: "25rem", padding: 20 }}>
        <h2 className="mb-4 center-text">Change Password</h2>
        <form action="">
          <div className="mb-3">
            <label htmlFor="currentPassword" className="form-label">
              Current Password*
            </label>
            <input id="currentPassword" type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password*
            </label>
            <input id="newPassword" type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password*
            </label>
            <input id="confirmNewPassword" type="text" className="form-control" />
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
