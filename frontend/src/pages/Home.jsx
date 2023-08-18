import { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import FlippableCard from '../components/card/FlippableCard';
import { Link } from 'react-router-dom';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import '../App.css';

const backend = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://panicky-robe-mite.cyclic.app';

const Home = () => {
  const [topLeagues, setTopLeagues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [opacity, setOpacity] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingLeagues, setIsLoadingLeagues] = useState(true);

  const announcementsPerPage = 5;

  useEffect(() => {
    setOpacity(1);
    fetchTopLeagues();
  }, []);

  const fetchTopLeagues = async () => {
  try {
    setIsLoadingLeagues(true);
    const response = await fetch(`${backend}`);
    const data = await response.json();
    const allAnnouncements = [...data.details.adminAnnouncements, ...data.details.announcements];

    setTopLeagues(data.details.topLeagues);
    setAnnouncements(allAnnouncements);
  } catch (error) {
    console.error('Error fetching top leagues data:', error);
  } finally {
    setIsLoadingLeagues(false);
  }
};


  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: topLeagues.length,
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
      if (topLeagues.length > 3) {
        setSliderSettingsToUse(sliderSettingsFourCards);
      } else {
        setSliderSettingsToUse(sliderSettings);
      }
    } else if (window.innerWidth >= 837) {
      if (topLeagues.length > 2) {
        setSliderSettingsToUse(sliderSettingsThreeCards);
      } else {
        setSliderSettingsToUse(sliderSettings);
      }
    } else if (window.innerWidth >= 560) {
      if (topLeagues.length > 1) {
        setSliderSettingsToUse(sliderSettingsTwoCards);
      } else {
        setSliderSettingsToUse(sliderSettings);
      }
    } else {
      setSliderSettingsToUse(sliderSettingsOneCard);
    }
  };

  const doesImageExist = (url) => {
    const img = new Image();
    img.src = url;
    return img.complete || (img.width + img.height) > 0;
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

  const adminAnnouncements = currentAnnouncements.filter((announcement) => typeof announcement === 'string');
  const regularAnnouncements = currentAnnouncements.filter((announcement) => typeof announcement !== 'string');

  return (
    <>
      {isLoadingLeagues ? (
        <div className="loading-overlay">
        <div>Loading top leagues...</div>
        <div className="loading-spinner"></div>
      </div>
      ) : (
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

          <div className="slider-wrapper" style={{  paddingLeft: '13%', paddingRight: '5%' }}>
            <Slider key={sliderSettingsToUse.slidesToShow} {...sliderSettingsToUse}>
              {topLeagues.map((league, index) => (
                <div key={index}>
                  <FlippableCard
                    imageUrl={
                      doesImageExist(`${backend}/leaguelogos/${league.leagueId}.jpeg`)
                        ? `${backend}/leaguelogos/${league.leagueId}.jpeg`
                        : `${backend}/leaguelogos/default-image-for-league.jpeg`
                    }
                    cardText={league.leagueName}
                    teams={league.teams}
                    leagueId={league.leagueId}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      <section className="section-50">
        <div className="container">
          <h1 className="m-b-50 heading-line">
            Announcements
          </h1>

          <div className="notification-ui_dd-content">
            {adminAnnouncements.map((announcement, index) => (
              <div key={index} className="notification-list notification-list--unread" style={{ backgroundColor: '#ffffe0' }}>
                <div className="notification-list_content">
                  <div className="notification-list_img">
                    <img src="https://i.imgur.com/zYxDCQT.jpg" alt="user" />
                  </div>
                  <div className="notification-list_detail">
                    <p>
                      <b>Admin Announcement</b>
                    </p>
                  </div>
                  <p className="text-muted">{announcement}</p>
                </div>
              </div>
            ))}

            {regularAnnouncements.map((announcement, index) => (
              <div key={index}>
                {announcement.leagueName && (
                  <Link to={`/league/${announcement.leagueId}`} className="notification-list notification-list--unread">
                    <div className="notification-list_content">
                      <div className="notification-list_img">
                      {doesImageExist(`${backend}/leaguelogos/${announcement.leagueId}.jpeg`) ? (
                        <img src={`${backend}/leaguelogos/${announcement.leagueId}.jpeg`} alt="user" />
                      ) : (
                        <img src={`${backend}/leaguelogos/default-image.jpeg`} alt="user" />
                      )}
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
                      {doesImageExist(`${backend}/teamlogos/${announcement.teamId}.jpeg`) ? (
                        <img src={`${backend}/teamlogos/${announcement.teamId}.jpeg`} alt="user" />
                      ) : (
                        <img src={`${backend}/teamlogos/default-image.jpeg`} alt="user" />
                      )}
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
          )}
          </>
  );
};

export default Home;
