import '../App.css'; 
import {Link, useNavigate} from 'react-router-dom'; 
import useAuth, {checkIfSignedIn} from "../hooks/auth";
import {useEffect} from 'react'

const Notification = () => {

  const { isSignedIn } = useAuth()
  const navigate = useNavigate(); 

  const checkIfUserIsSignedIn = () => {
    checkIfSignedIn()
    .then((user) => {
      if (!user.isSignedIn) {
        navigate("/signin");
      }
    })
  }

  return (
    <>
  { !isSignedIn && (
        <div>
          {checkIfUserIsSignedIn()}
        </div>
      )}
  <section className="section-50">
      <div className="container">
        <h1 className="m-b-50 heading-line">Notifications </h1>

        <div className="notification-ui_dd-content">
          <Link to="/team/1" className="notification-list notification-list--unread">
            <div className="notification-list_content">
              <div className="notification-list_img">
                <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
              </div>
              <div className="notification-list_detail">
                <p><b>John Doe</b> sent a team invitation</p>
                <p className="text-muted">We want to invite you to our team, please join us</p>
                <p className="text-muted"><small>10 mins ago</small></p>
              </div>
            </div>
            <div className="notifcation-list_feature-img">
                <button className="approval-button">Approve</button>
                <button className="decline-button">Decline</button>
            </div>
          </Link>

          <Link to="/team/1" className="notification-list notification-list--unread">
            <div className="notification-list_content">
              <div className="notification-list_img">
                <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
              </div>
              <div className="notification-list_detail">
                <p><b>John Doe</b> reacted to your post</p>
                <p className="text-muted">abcd</p>
                <p className="text-muted"><small>10 mins ago</small></p>
              </div>
            </div>
            <div className="notifcation-list_feature-img">
                <button className="approval-button">Approve</button>
                <button className="decline-button">Decline</button>
            </div>
          </Link>


          <Link to="/team/1" className="notification-list notification-list--unread">
            <div className="notification-list_content">
              <div className="notification-list_img">
                <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
              </div>
              <div className="notification-list_detail">
                <p><b>John Doe</b> reacted to your post</p>
                <p className="text-muted">abcd</p>
                <p className="text-muted"><small>10 mins ago</small></p>
              </div>
            </div>
            <div className="notifcation-list_feature-img">
                <button className="approval-button">Approve</button>
                <button className="decline-button">Decline</button>
            </div>
          </Link>


          <Link to="/team/1" className="notification-list notification-list--unread">
            <div className="notification-list_content">
              <div className="notification-list_img">
                <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
              </div>
              <div className="notification-list_detail">
                <p><b>John Doe</b> reacted to your post</p>
                <p className="text-muted">abcd</p>
                <p className="text-muted"><small>10 mins ago</small></p>
              </div>
            </div>
            <div className="notifcation-list_feature-img">
                <button className="approval-button">Approve</button>
                <button className="decline-button">Decline</button>
            </div>
          </Link>

          {/* Add other notifications using the Link component */}

        </div>
      </div>
    </section>
  
    </>
  );
};

export default Notification;
