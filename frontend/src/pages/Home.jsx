import { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import FlippableCard from '../components/card/FlippableCard';
import { Link, useParams } from 'react-router-dom';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import '../App.css';

const backend = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://panicky-robe-mite.cyclic.app/';

const Home = () => {
  const [topLeagues, setTopLeagues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [opacity, setOpacity] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 5;

  useEffect(() => {
    setOpacity(1);
    fetchTopLeagues();
  }, []);

  const fetchTopLeagues = async () => {
    try {
      const response = await fetch(`${backend}`);
      const data = await response.json();
      const allAnnouncements = [...data.details.announcements];
      
      // Check if admin announcement is not already added
      const adminAnnouncementIndex = allAnnouncements.findIndex((announcement) => typeof announcement === 'string');
      if (adminAnnouncementIndex !== -1) {
        allAnnouncements.splice(adminAnnouncementIndex, 1);
      }
  
      // Add admin announcement to the beginning of the array
      if (data.details.adminAnnouncements.length > 0) {
        allAnnouncements.unshift(data.details.adminAnnouncements[0]);
      }
  
      setTopLeagues(data.details.topLeagues);
      setAnnouncements(allAnnouncements);
      console.log(allAnnouncements);
    } catch (error) {
      console.error('Error fetching top leagues data:', error);
    }
  };
  

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  const sliderSettingsFourCards = { ...sliderSettings, slidesToShow: 4 };
  const sliderSettingsThreeCards = { ...sliderSettings, slidesToShow: 3 };
  const sliderSettingsTwoCards = { ...sliderSettings, slidesToShow: 2 };
  const sliderSettingsOneCard = { ...sliderSettings, slidesToShow: 1 };

  const [sliderSettingsToUse, setSliderSettingsToUse] = useState(sliderSettings);

  const updateSliderSettings = () => {
    if (window.innerWidth >= 1398) {
      setSliderSettingsToUse(sliderSettings);
    } else if (window.innerWidth >= 1126) {
      setSliderSettingsToUse(sliderSettingsFourCards);
    } else if (window.innerWidth >= 837) {
      setSliderSettingsToUse(sliderSettingsThreeCards);
    } else if (window.innerWidth >= 560) {
      setSliderSettingsToUse(sliderSettingsTwoCards);
    } else {
      setSliderSettingsToUse(sliderSettingsOneCard);
    }
  };

  useEffect(() => {
    updateSliderSettings();
    window.addEventListener('resize', updateSliderSettings);

    return () => {
      window.removeEventListener('resize', updateSliderSettings);
    };
  }, []);

  const totalPages = Math.ceil(announcements.length / announcementsPerPage);
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);

  const adminAnnouncement = currentAnnouncements.find((announcement) => typeof announcement === 'string');

  return (
    <>
      <div className="App" style={{ textAlign: 'center' }}>
        <div style={{ backgroundImage: "url('/images/mainPage/basketball_galaxy.png')", backgroundSize: 'cover', width: '100%', height: '1000px' }}>
          <h1 className="animated-text" style={{ color: 'white', opacity: opacity, transition: 'opacity 5s', paddingLeft: '40%', paddingTop: '15%', fontSize: '5vw' }}>
            Find your team <br /> open your dream
          </h1>
        </div>

        <div style={{ width: '100%' }}>
          <h6 style={{ paddingTop: '5%' }}>Top 10 ongoing</h6>
          <h1>LEAGUES 🔥</h1>

          <div className="slider-wrapper" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
            <Slider key={sliderSettingsToUse.slidesToShow} {...sliderSettingsToUse}>
              {topLeagues.map((league, index) => (
                <div key={index}>
                  <FlippableCard imageUrl={`${backend}/leaguelogos/${league.leagueId}.jpeg`} cardText={league.leagueName} teams={league.teams} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      <section className="section-50">
        <div className="container">
          <h1 className="m-b-50 heading-line">
            Announcements <i className="fa fa-bell text-muted"></i>
          </h1>

          <div className="notification-ui_dd-content">
            {adminAnnouncement && (
              <div className="notification-list notification-list--unread" style={{ backgroundColor: '#ffffe0' }}>
                <div className="notification-list_content">
                  <div className="notification-list_img">
                    <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
                  </div>
                  <div className="notification-list_detail">
                    <p>
                      <b>Admin Announcement</b>
                    </p>
                  </div>
                  <p className="text-muted">{adminAnnouncement}</p>
                </div>
              </div>
            )}

            {currentAnnouncements.map((announcement, index) => (
              <div key={index}>
                {announcement.leagueName && (
                  <Link to={`/league/${announcement.leagueId}`} className="notification-list notification-list--unread">
                    <div className="notification-list_content">
                      <div className="notification-list_img">
                        <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
                      </div>
                      <div className="notification-list_detail">
                        <p>
                          <b>{announcement.leagueName}</b>
                        </p>

                      </div>
                      <p className="text-muted">{announcement.leagueMsg}</p>
                    </div>
                  </Link>
                )}

                {announcement.teamId && (
                  <Link to={`/team/${announcement.teamId}`} className="notification-list notification-list--unread">
                    <div className="notification-list_content">
                      <div className="notification-list_img">
                        <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
                      </div>
                      <div className="notification-list_detail">
                        <p>
                          <b>{announcement.teamName}</b>
                        </p>

                      </div>
                      <p className="text-muted">{announcement.teamMsg}</p>
                        <p className="text-muted notification-date">
                          <small>
                            {new Date(announcement.indicatorChgTmst).toLocaleDateString('en-US')}
                          </small>
                        </p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="pagination">
            <button className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              <BiChevronLeft size={20} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`pagination-button ${i + 1 === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`} disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
              <BiChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
