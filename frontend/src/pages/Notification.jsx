import '../App.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BiEnvelopeOpen, BiEnvelope, BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const Notification = () => {
  const [selectedStates, setSelectedStates] = useState(Array(20).fill(false));
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const notificationsPerPage = 5;

  const toggleSelectedState = (index) => {
    const updatedStates = [...selectedStates];
    updatedStates[index] = !updatedStates[index];
    setSelectedStates(updatedStates);
  };

  const toggleEnvelope = () => {
    setEnvelopeOpen(!envelopeOpen);
  };

  const notifications = Array.from({ length: 20 }, (_, index) => ({
    sender: `Sender ${index + 1}`,
    message: `Example message ${index + 1}`,
    read: index % 2 === 0,
  }));

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
                <Link
                  key={index}
                  to="/team/1"
                  className={`notification-list notification-list--unread ${
                    selectedStates[index] ? 'selected' : ''
                  }`}
                >
                  <div className="notification-list_content" onClick={(e) => e.stopPropagation()}>
                    <div className="notification-list_img">
                      <input
                        type="checkbox"
                        className="notification-checkbox"
                        onChange={() => toggleSelectedState(index)}
                      />
                    </div>
                    <div className="notification-list_detail">
                      <p className={`notification-sender ${notification.read ? '' : 'bold'}`}>
                        {notification.sender}
                      </p>
                    </div>
                    <div className="text-muted">
                      <p className={`notification-message ${notification.read ? '' : 'bold'}`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                  <div className="notifcation-list_feature-img">
                    <button className="approval-button">Approve</button>
                    <button className="decline-button">Reject</button>
                  </div>
                </Link>
              ))}
          </div>

          {/* Pagination */}
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
