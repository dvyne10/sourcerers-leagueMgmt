import {useMemo} from 'react'; 
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import Slider from 'react-slick'; 
import FlippableCard from '../components/card/FlippableCard'; 
import { useState, useEffect} from 'react'; 
import { MaterialReactTable } from 'material-react-table'; 

import '../App.css'; 


const Home = () => {

  const data = [
    {
      title: 'Admin',
      desc: "We found unauthorized traffic users, and permeantly banned from the website",
    },
    {
      title: 'Our team',
      desc: 'Looking for a team'
    },
    {
      title: 'Our team',
      desc: 'Looking for a team'
    },
    {
      title: 'Our team',
      desc: 'Looking for a team'
    },
    {
      title: 'Our team',
      desc: 'Looking for a team'
    }
  ];

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title', //access nested data with dot notation
        header: 'Who',
        size: 300,
      },
      {
        accessorKey: 'desc',
        header: 'Message',
        size: 600,
      },
    
    ],
    [],
  );

  const [opacity, setOpacity] = useState(0); 

  useEffect(() => {
      setOpacity(1); 
  }, []);
  const settings = {
    dots: false, 
    infinite: true, 
    speed: 1000, 
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  }; 

  return (
    <>
    <div className="App" style={{textAlign: 'center'}}>

      <div style={{
        backgroundImage: "url('/images/mainPage/basketball_galaxy.png')",
        backgroundSize: 'cover',
        width: '100%',
        height: '1000px'
      }}>
     
          <h1 className="animated-text" style={{color: 'white', opacity: opacity, transition: 'opacity 5s', paddingLeft: '40%', paddingTop: '15%', fontSize: '60px'}}>Find your team <br/> open your dream</h1>
      </div>
 
 
      <div style={{
       
        width: '100%'
      }}>
      <h6 style={{paddingTop: '5%'}}>Top 10 ongoing</h6>
      <h1>LEAGUES 🔥</h1>
      
      <div style={{paddingLeft: '5%', paddingRight: '5%'}}>
        <Slider {...settings}>
          <div>
            <FlippableCard imageUrl="/images/mainPage/basketball_pic1.jpg" cardText="BasketBall Club"/>
          </div>
          <div>
            <FlippableCard imageUrl="/images/mainPage/basketball_pic2.jpg" cardText="Jordan Warriors"/>
          </div>
          <div>
          <FlippableCard imageUrl="/images/mainPage/soccer_pic1.jpg" cardText="Go Messi"/>
          </div>
          <div>
          <FlippableCard imageUrl="/images/mainPage/soccer_pic2.jpg" cardText="Play With Us!"/>
          </div>
          <div>
          <FlippableCard imageUrl="/images/mainPage/soccer_pic3.jpg" cardText="Moving on"/>
          </div>
          <div>
          <FlippableCard imageUrl="/images/mainPage/soccer_pic4.jpg" cardText="Shoot or not"/>
          </div>
          <div>
          <FlippableCard imageUrl="/images/mainPage/basketball_pic3.jpg" cardText="3 points seeker"/>
          </div>
          <div>
          <FlippableCard imageUrl="/images/mainPage/basketball_pic4.jpg" cardText="We love basketball"/>
          </div>
          <div>
          <FlippableCard imageUrl="/images/mainPage/basketball_pic5.jpg" cardText="Ball Ball"/>
          </div>
          <div>
          <FlippableCard imageUrl="/images/mainPage/basketball_pic6.jpg" cardText="Go Dunk"/>
          </div>
        </Slider>
      </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2%', paddingBottom: '2%'}}>
        <h1>ANNOUNCEMENTS</h1>
      
        <MaterialReactTable
  columns={columns}
  data={data}
  muiTableBodyProps={{
    sx: {
      // Highlight the first row
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
}

  
export default Home;