import { Col, Container, Row } from "react-bootstrap";
import '../App.css'; 


const Notification = () => {

  return (
    <>
  
        <section className="section-50">
          <div className="container">
            <h3 className="m-b-50 heading-line">Notifications <i className="fa fa-bell text-muted"></i></h3> 

            <div className="notification-ui_dd-content">
              <div className="notification-list notification-list--unread">
                <div className="notification-list_content">
                  <div className="notification-list_img">
                    <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user"/>
                  </div>
                  <div className="notification-list_detail">
                    <p><b>John Doe</b> sent a team invitation</p>
                    <p className="text-muted">We want to invite you in our team, please join us</p>
                    <p className="text-muted"><small>10 mins ago</small></p>
                  </div>
                </div>
                <div className="notifcation-list_feature-img"> 
                  <img src="https://i.imgur.com/AbZqFnR.jpg" alt="Feature image"/> 
                </div>
              </div>
              <div className="notification-list notification-list--unread">
                <div className="notification-list_content">
                  <div className="notification-list_img">
                    <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user"/>
                  </div>
                  <div className="notification-list_detail">
                    <p><b>John Doe</b> reacted to your post</p>
                    <p className="text-muted">abcd</p>
                    <p className="text-muted"><small>10 mins ago</small></p>
                  </div>
                </div>
                <div className="notifcation-list_feature-img"> 
                  <img src="https://i.imgur.com/AbZqFnR.jpg" alt="Feature image"/> 
                </div>
              </div>
            </div>
          </div>
        </section>
  
    </>
  );
};

export default Notification;
