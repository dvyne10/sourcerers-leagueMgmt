import  { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import FlippableCard from '../components/card/FlippableCard';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  const [topLeagues, setTopLeagues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
    fetchTopLeagues();
  }, []);

  const fetchTopLeagues = async () => {
    try {
      const response = await fetch('http://localhost:8000/');
      const data = await response.json();
      console.log(data); // Log the data received from the backend
      setTopLeagues(data.details.topLeagues);
      setAnnouncements(data.details.announcements);
    } catch (error) {
      console.error('Error fetching top leagues data:', error);
    }
  };

// Settings for different screen sizes
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 5, // For large screens (desktop)
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
};

const sliderSettingsFourCards = {
  ...sliderSettings,
  slidesToShow: 4, // For medium-sized screens
};

const sliderSettingsThreeCards = {
  ...sliderSettings,
  slidesToShow: 3, // For small screens (mobile)
};

const sliderSettingsTwoCards = {
  ...sliderSettings,
  slidesToShow: 2, 
}

const sliderSettingsOneCard = {
  ...sliderSettings,
  slidesToShow: 1, 
}
// Add a state to track the screen size and set the appropriate slider settings
const [sliderSettingsToUse, setSliderSettingsToUse] = useState(sliderSettings);

// Function to update slider settings based on screen size
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
  // Update slider settings on mount and whenever the window size changes
  updateSliderSettings();
  window.addEventListener('resize', updateSliderSettings);

  // Clean up the event listener on unmount
  return () => {
    window.removeEventListener('resize', updateSliderSettings);
  };
}, []);

// Your existing code ...

return (
  <>
    <div className="App" style={{ textAlign: 'center' }}>
      {/* Your existing code ... */}
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
              fontSize: '5vw', // Adjust the font size using vw (viewport width) units
            }}
          >
            Find your team <br /> open your dream
          </h1>
      </div>

      <div style={{ width: '100%' }}>
        <h6 style={{ paddingTop: '5%' }}>Top 10 ongoing</h6>
        <h1>LEAGUES 🔥</h1>

        {/* Render the Slider with the appropriate settings and a unique key */}
        <div className="slider-wrapper" style={{ paddingLeft: '5%', paddingRight: '5%' }}>
          <Slider key={sliderSettingsToUse.slidesToShow} {...sliderSettingsToUse}>
            {topLeagues.map((league, index) => (
              <div key={index}>
                <FlippableCard imageUrl={league.imageUrl} cardText={league.leagueName} />
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
          {announcements.map((announcement, index) => (
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
                        <small>{new Date(announcement.indicatorChgTmst).toLocaleString()}</small>
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  </>
);
};

export default Home;