import { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FlippableCard from '../components/card/FlippableCard';
import { Link, useParams } from 'react-router-dom';
import '../App.css';

//const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app/";
const backend = "https://panicky-robe-mite.cyclic.app/";

const Home = () => {
  const [topLeagues, setTopLeagues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [teams, setTeams] = useState([]); // Add state for teams
  const [opacity, setOpacity] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 5;
  const routeParams = useParams();

  useEffect(() => {
    setOpacity(1);
    fetchTopLeagues();
  }, []);

  const fetchTopLeagues = async () => {
    try {
      const response = await fetch(`${backend}`);
      const data = await response.json();

      setTopLeagues(data.details.topLeagues);
      setAnnouncements(data.details.announcements);
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

  const sliderSettingsFourCards = {
    ...sliderSettings,
    slidesToShow: 4,
  };

  const sliderSettingsThreeCards = {
    ...sliderSettings,
    slidesToShow: 3,
  };

  const sliderSettingsTwoCards = {
    ...sliderSettings,
    slidesToShow: 2,
  };

  const sliderSettingsOneCard = {
    ...sliderSettings,
    slidesToShow: 1,
  };

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

  const renderPagination = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => setCurrentPage(i)}
          style={{ margin: '0 10px' }}
        >
          {i}
        </span>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        {pageNumbers}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="App" style={{ textAlign: 'center' }}>
        <div
          style={{
            backgroundImage: "url('/images/mainPage/basketball_galaxy.png')",
            backgroundSize: 'cover',
            width: '100%',
            height: '1000px',
          }}
        >
          <h1
            className="animated-text"
            style={{
              color: 'white',
              opacity: opacity,
              transition: 'opacity 5s',
              paddingLeft: '40%',
              paddingTop: '15%',
              fontSize: '5vw',
            }}
          >
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
          <h1 className="m-b-50 heading-line">Announcements <i className="fa fa-bell text-muted"></i></h1>

          <div className="notification-ui_dd-content">
            {currentAnnouncements.map((announcement, index) => (
              <div key={index}>
                {announcement.leagueName && (
                  <Link to={`/league/${announcement.leagueId}`} className="notification-list notification-list--unread">
                    <div className="notification-list_content">
                      <div className="notification-list_img">
                        <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
                      </div>
                      <div className="notification-list_detail">
                        <p><b>{announcement.leagueName}</b></p>
                        <p className="text-muted">{announcement.leagueMsg}</p>
                      </div>
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
                        <p><b>{announcement.teamName}</b></p>
                        <p className="text-muted">{announcement.teamMsg}</p>
                        <p className="text-muted">
                          <small>{new Date(announcement.indicatorChgTmst).toLocaleDateString('en-US')}</small>
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center'}}>
          {renderPagination()}
        </div>
      </section>
    </>
  );
};

export default Home;
