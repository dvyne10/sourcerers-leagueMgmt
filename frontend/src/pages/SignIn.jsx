import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

const SignIn = () => {
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
            <label htmlFor="name" className="form-label">
              Password
            </label>
            <input id="name" type="text" className="form-control" />
          </div>
          <Form.Check
            type={"checkbox"}
            id={`default-checkbox`}
            label={`remember me`}
            className="mb-4 "
          />
          <div className="d-flex justify-content-evenly width:100% mb-4">
            <button className="btn btn-primary sign-in-btn" type="button">
              Sign In
            </button>
            <button type="button" className="btn btn-light">
              forgot password?
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-link">
              Not registered? register
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignIn;
