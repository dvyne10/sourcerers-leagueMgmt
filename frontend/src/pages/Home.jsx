import  { useEffect, useMemo, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import FlippableCard from '../components/card/FlippableCard';
import { MaterialReactTable } from 'material-react-table';
import '../App.css';

const Home = () => {
  const data = [
    // Your data array here...
  ];

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Who',
        size: 300,
      },
      {
        accessorKey: 'desc',
        header: 'Message',
        size: 600,
      },
    ],
    []
  );

  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

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
            <div>
              <FlippableCard imageUrl="/images/mainPage/basketball_pic1.jpg" cardText="BasketBall Club" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/basketball_pic2.jpg" cardText="Jordan Warriors" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/soccer_pic1.jpg" cardText="Go Messi" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/soccer_pic2.jpg" cardText="Play With Us!" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/soccer_pic3.jpg" cardText="Moving on" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/soccer_pic4.jpg" cardText="Shoot or not" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/basketball_pic3.jpg" cardText="3 points seeker" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/basketball_pic4.jpg" cardText="We love basketball" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/basketball_pic5.jpg" cardText="Ball Ball" />
            </div>
            <div>
              <FlippableCard imageUrl="/images/mainPage/basketball_pic6.jpg" cardText="Go Dunk" />
            </div>
          </Slider>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2%', paddingBottom: '2%' }}>
        <h1>ANNOUNCEMENTS</h1>

        <MaterialReactTable
          columns={columns}
          data={data}
          muiTableBodyProps={{
            sx: {
              '& tr:nth-of-type(1)': {
                backgroundColor: '#F5F5F5',
              },
            },
          }}
        />
      </div>
    </div>
  </>
);
};

export default Home;