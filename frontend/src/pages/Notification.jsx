import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BiEnvelopeOpen, BiEnvelope, BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const backend = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://panicky-robe-mite.cyclic.app/';

const Notification = () => {
  const [selectedStates, setSelectedStates] = useState(Array(20).fill(false));
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]); 

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${backend}/notifications`);
      const data = await response.json();

      if (data && data.length > 0) {
        setNotifications(data); 
      } else {
        console.log('No notifications found.');
      }
    } catch (error) {
      console.error('Error fetching top leagues data:', error);
    }
  };
  
  useEffect(() => {
    fetchNotifications(); 
  }, []);

  const notificationsPerPage = 5;

  const toggleSelectedState = (index) => {
    const updatedStates = [...selectedStates];
    updatedStates[index] = !updatedStates[index];
    setSelectedStates(updatedStates);
  };

  const toggleEnvelope = () => {
    if (envelopeOpen) {
      const updatedNotifications = notifications.map((notification, index) => ({
        ...notification,
        read: selectedStates[index] || notification.read,
      }));
      setNotifications(updatedNotifications);
    }
    setEnvelopeOpen(!envelopeOpen);
  };

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  return (
    <>
      <section className="section-50">
        <div className="container">
          <h1 className="m-b-50 heading-line">Notifications </h1>

          <button className="icon-button" onClick={toggleEnvelope}>
            {envelopeOpen ? <BiEnvelopeOpen size={25} /> : <BiEnvelope size={25} />}
          </button>
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
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        checked={selectedStates[index]}
                        onChange={() => toggleSelectedState(index)}
                      />
                    </div>
                    <div className="notification-list_detail">
                      <p className={`notification-sender ${notification.read || envelopeOpen ? '' : 'bold'}`}>
                        {notification.read || envelopeOpen ? notification.sender : <b>{notification.sender}</b>}
                      </p>
                    </div>
                    <div className="text-muted">
                      <p className={`notification-message ${notification.read || envelopeOpen ? '' : 'bold'}`}>
                        {notification.read || envelopeOpen ? notification.message : <b>{notification.message}</b>}
                      </p>
                    </div>
                  </div>
                  <div className="notifcation-list_feature-img">
                    <button className="approval-button">Approve</button>
                    <button className="decline-button">Reject</button>
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
    </>
  );
};

export default Notification;
