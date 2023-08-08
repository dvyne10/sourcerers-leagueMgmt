import { useState } from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="card-wrapper">
      <Card style={{ width: "25rem", padding: 20 }}>
        <h2 className="mb-4 center-text">Forgot Password</h2>
        <form action="">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email*
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-evenly width:100% mb-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                await forgotPassword(email, navigate);
              }}
            >
              Send me my validation code
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
