import Card from "react-bootstrap/Card";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const InputOTP = () => {

  const location = useLocation();
  const fromPage = location.state.fromPage;
  const navigate = useNavigate(); 
  const navigateResetPassword = () => {
    if (fromPage === 'Register') {
      navigate('/')
    } else {
      navigate('/resetpassword') 
    }
  }

  return (
    <div className="card-wrapper">
      <Card style={{ width: "25rem", padding: 20 }}>
        <h2 className="mb-4 center-text">Enter Verification Code</h2>
        <form action="">
          <div className="mb-3">
            <input id="otp" name="otp" type="number" min="0" className="form-control" />
          </div>
          <div className="d-flex justify-content-evenly width:100% mb-4">
            <button type="button" className="btn btn-primary" onClick={navigateResetPassword}>
              Verify Code
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default InputOTP;
