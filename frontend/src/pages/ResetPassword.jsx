import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/auth'

const ResetPassword = () => {
  const {resetPassword} = useAuth()
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  // useEffect(() => {
  //   console.log(error);
  // }, [error]);

  const navigate = useNavigate();
  const navigateSignin = () => {
    if (error.length > 0) {
      return;
    }
    if (newPassword === confirmNewPassword) {
      resetPassword(newPassword, confirmNewPassword, navigate);
    } else {
      setError("password does not match");
    }
  };

  return (
    <div className="card-wrapper">
      <Card style={{ width: "25rem", padding: 20 }}>
        {error.length > 0 && (
          <div className="alert alert-danger mb-3 p-1">
            <p className="mb-0">{error}</p>
          </div>
        )}
        <h2 className="mb-4 center-text">Reset Password</h2>
        <form action="">
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password*
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="text"
              className="form-control"
              onChange={(e) => {
                if (e.target.value < 8) {
                  setError("minimum of eight characters");
                } else {
                  setError("");
                }
                setNewPassword(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password*
            </label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="text"
              className="form-control"
              onChange={(e) => {
                if (e.target.value < 8) {
                  setError("minimum of eight characters");
                } else {
                  setError("");
                }
                setConfirmNewPassword(e.target.value);
              }}
            />
          </div>
          <div className="d-flex justify-content-evenly width:100% mb-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={navigateSignin}
            >
              Reset Password
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
