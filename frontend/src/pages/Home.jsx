import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
import Slider from 'react-slick'; 
import FlippableCard from '../components/card/FlippableCard'; 
import {useState, useEffect} from 'react'; 
import '../App.css'; 

const Home = () => {
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
    pauseOnHover: false,
  }; 

  return (
    <>
    <div className="App" style={{textAlign: 'center'}}>

      <div style={{
        backgroundImage: "url('/basketball_galaxy.png')",
        backgroundSize: 'cover',
        width: '100%',
        height: '1000px'
      }}>
     
          <h1 className="animated-text" style={{color: 'white', opacity: opacity, transition: 'opacity 5s', paddingLeft: '40%', paddingTop: '15%', fontSize: '60px'}}>Find your team <br/> open your dream</h1>
   
      </div>
 
 
      <h6 style={{paddingTop: '5%'}}>Top 10 ongoing</h6>
      <h1>LEAGUES</h1>
    
    <div>
      <Slider {...settings}>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>
        <div>
        <FlippableCard/>
        </div>

      </Slider>
    </div>
       


 
      <br/><br/>
    
       
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1>ANNOUNCEMENTS</h1>
        <div style={{border: "1px solid black", borderRadius: '25px', width: "80%", height: "500px"}}></div>
    </div>


    </div>
    </>
  );
}

  
export default Home;