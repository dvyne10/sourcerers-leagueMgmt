import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {

  const navigate = useNavigate(); 
  const navigateSignin = () => { navigate('/signin') }

  return (
    <div className="card-wrapper">
      <Card style={{ width: "25rem", padding: 20 }}>
        <h2 className="mb-4 center-text">Reset Password</h2>
        <form action="">
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
            <button type="button" className="btn btn-primary" onClick={navigateSignin}>
              Reset Password
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
