import { useState, useEffect } from 'react';
import { BiEnvelopeOpen, BiEnvelope, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import useAuth, {checkIfSignedIn, getToken} from "../hooks/auth";
import { useNavigate } from 'react-router-dom';
import '../App.css'

const backend = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://panicky-robe-mite.cyclic.app';

const Notification = () => {
  const navigate = useNavigate(); 
  const {isSignedIn} = useAuth();
  const token = `Bearer ${getToken()}`;
  const checkIfUserIsSignedIn = () => {
    let user = checkIfSignedIn()
    if (!user.isSignedIn) {
      navigate("/signin");
    }
  }

  const [selectedStates, setSelectedStates] = useState(Array(20).fill(false));
  const [envelopeOpen, setEnvelopeOpen] = useState(Array(20).fill(false));
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${backend}/notifications`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "Application/JSON",
          "Authorization": token
        },
        
      });

      const data = await response.json();
      console.log(data.details);
      if (data.requestStatus === 'ACTC') {
        setNotifications(data.details);
        setEnvelopeOpen(data.details.map((notification) => !notification.readStatus));
      } else {
        console.log('notification does not exist');
      }
    } catch (error) {
      console.error('Error fetching top leagues data:', error);
    } finally {
      setIsLoading(false); 
    }
  };


  useEffect(() => {
    fetchNotifications();
  }, []);

  const notificationsPerPage = 5;

  const toggleEnvelope = async (index) => {
    const updatedEnvelopeStates = [...envelopeOpen];
    updatedEnvelopeStates[index] = !updatedEnvelopeStates[index];
    setEnvelopeOpen(updatedEnvelopeStates);

    const updatedSelectedStates = [...selectedStates];
    updatedSelectedStates[index] = updatedEnvelopeStates[index];
    setSelectedStates(updatedSelectedStates);

    if (envelopeOpen[index]) {
      const updatedNotifications = notifications.map((notification, i) => ({
        ...notification,
        read: updatedSelectedStates[i] || notification.read,
      }));
      setNotifications(updatedNotifications);
      try {
        const response = await fetch(`${backend}/notificationsread/${notifications[index].notifId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
       
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    } else {
      try {
        const response = await fetch(`${backend}/notificationsread/${notifications[index].notifId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  const handleApproveClick = async (notification) => {
    const confirmed = window.confirm('Are you sure to approve?');
    if (confirmed) {
      try {
        const response = await fetch(`${backend}/approverequest/${notification.notifId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.requestStatus === 'ACTC') {
          // re-render the page, or update the button 
          // if it was succesful, I disable both buttons 
        } else {
          // display error message on the client-side 
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }

    }
  };

  const handleRejectClick = async (notification) => {

    const confirmed = window.confirm('Are you sure to reject?');
    if (confirmed) {
      try {
        console.log(notification.notifId);
        const response = await fetch(`${backend}/rejectrequest/${notification.notifId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.requestStatus === 'ACTC') {
          // re-render the page, or update the button 
          // if it was succesful, I disable both buttons 
        } else {
          // 
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  return (
    <>
       { !isSignedIn && (
            <div>
                {checkIfUserIsSignedIn()}
            </div>
        )}
      {isLoading ? (
        <div className="loading-overlay">
          <div >Loading...</div>
        <div className="loading-spinner"></div>
        </div>
      ): (
      <section className="section-50">
        <div className="container">
          <h1 className="m-b-50 heading-line">Notifications</h1>

          <hr />
          
          <div className="notification-ui_dd-content">
            {notifications
              .slice((currentPage - 1) * notificationsPerPage, currentPage * notificationsPerPage)
              .map((notification, index) => (
                <div
                  key={index}
                  className={`notification-list notification-list--unread ${
                    selectedStates[index] ? 'selected' : ''
                  }`}
                >
                  <div className="notification-list_content">
                    <div className="notification-list_img">
                      <button className="icon-button" onClick={() => toggleEnvelope(index)}>
                        {envelopeOpen[index] ? <BiEnvelope size={25} /> : <BiEnvelopeOpen size={25} />}
                      </button>
                    </div>
                    <div className="notification-list_detail">
                      <p className={`notification-sender ${notification.read || envelopeOpen[index] ? '' : 'bold'}`}>
                        {notification.read || envelopeOpen[index] ? notification.sender : <b>{notification.sender}</b>}
                      </p>
                    </div>
                    <div className="text-muted">
                      <p className={`notification-message ${notification.read || envelopeOpen[index] ? '' : 'bold'}`}>
                        {notification.read || envelopeOpen[index] ? notification.message : <b>{notification.message}</b>}
                      </p>
                    </div>
                  </div>
                  <div className="notifcation-list_feature-img">
                    {notification.enableApproveButton ? (
                      <button
                      className="approval-button"
                      onClick={() => handleApproveClick(notification)}
                      >
                        Approve
                      </button>
                    ) : notification.displayApproveButton ? (
                      <button
                        className="approval-button disabled"
                      >
                        Approve
                      </button>
                    ) : null}

                    {notification.enableRejectButton ? (
                      <button
                        className="decline-button"
                        onClick={() => handleRejectClick(notification)}
                      >
                        Reject
                      </button>
                    ) : notification.displayRejectButton ? (
                      <button
                        className={`decline-button disabled`}
                      >
                        Reject
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <BiChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`pagination-button ${i + 1 === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <BiChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>
      )}
    </>
  );
};

export default Notification;
