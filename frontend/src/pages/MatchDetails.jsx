import { useState, useEffect } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import soccerField from '/images/matchDetails/football_field.jpg';
import soccerBackground from '/images/matchDetails/football_background.jpg';
import basketballField from '/images/matchDetails/basketball_court.jpeg'; 
import basketballBackground from '/images/matchDetails/basketball_background.jpeg';
import messiImage from '/images/matchDetails/messi.jpeg'; 
import ronaldoImage from '/images/matchDetails/ronaldo.jpeg';
import vanDijkImage from '/images/matchDetails/vanDijk.jpeg'; 
import kevinImage from '/images/matchDetails/kevin.jpeg';
import ramosImage from '/images/matchDetails/ramos.jpeg'; 
import neymarImage from '/images/matchDetails/neymar.jpeg'; 
import Button from 'react-bootstrap/Button'; 
import { Image }  from 'react-bootstrap'; 
import { useParams, useNavigate } from 'react-router-dom';
import { BsGearFill } from "react-icons/bs";


const MatchDetails = () => {
  const [selectedPlayerLeft, setSelectedPlayerLeft] = useState(null);
  const [selectedPlayerRight, setSelectedPlayerRight] = useState(null);
  const [selectedPlayerData, setSelectedPlayerData] = useState(null);
  const [displayedTeam, setDisplayedTeam] = useState(1); // 1 for Team 1, 2 for Team 2

  const navigate = useNavigate(); 
  const navigateUpdateMatch = () => { navigate('/updatematch/648e9013466c1c995745907c') }   // temp id only
  let { sport } = useParams();
  sport = sport || '1'; 
  const teamLogo1 = sport === '1' ? '/images/matchDetails/madrid.png' : '/images/matchDetails/lakers.png';
  const teamLogo2 = sport === '1' ? '/images/matchDetails/barcelona.png' : '/images/matchDetails/golden.png';

  const playerListOne = [
    { name: 'Lionel Messi', position: 'MF', goals: 2, assists: 0, image: messiImage},
    { name: 'Cristiano Ronaldo', position: 'FW', goals: 0, assists: 2, image: ronaldoImage },
    { name: 'Virgil van Dijk', position: 'DF', goals: 0, assists: 0, image: vanDijkImage },
  ];
  const playerListTwo = [
    { name: 'Kevin De Bruyne', position: 'MF', goals: 10, assists: 7, image: kevinImage},
    { name: 'Sergio Ramos', position: 'DF', goals: 3, assists: 12, image: ramosImage},
    { name: 'Neymar Jr', position: 'FW', goals: 2, assists: 4, image: neymarImage},
  ];

  const handleClickPlayerLeft = (player) => {
    setSelectedPlayerData(player);
    setSelectedPlayerLeft(player.name);
  };

  const handleClickPlayerRight = (player) => {
    setSelectedPlayerData(player);
    setSelectedPlayerRight(player.name);
  };
  
  const handleClickTeam1 = () => {
    setDisplayedTeam(1);
  };

  const handleClickTeam2 = () => {
    setDisplayedTeam(2);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(`Window dimensions: ${window.innerWidth} * ${window.innerHeight}`);
    }, 5000);

    // This will clear the interval (stop the repeating function) when the component unmounts.
    return () => clearInterval(intervalId);
  }, []);


  return (
    <>
  <div style={{
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundImage: `url(${sport === '1' ? soccerBackground : basketballBackground})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    opacity: 0.6,  // adjust the opacity as needed
    zIndex: -1
  }}/>
 

 <div style={{marginLeft: '95%',  transform: 'translateY(15px)'}}><Button onClick={navigateUpdateMatch} variant='transparent' className="btn btn-outline-success"><BsGearFill className="m-auto" /></Button></div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        
        <div className="team-logo-container" onClick={() => navigate('/team/:teamid')}
             style={{
                    backgroundColor: '#D1E8E2',
                    width: '20%',
                    height: '15vh',
                    marginLeft: '10%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#D1E8E2 url(' + teamLogo1 + ') center center no-repeat',
                    backgroundSize: 'contain',
                    borderTopLeftRadius: '10px',
                    borderBottomLeftRadius: '10px',                    
                    }}>
        </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#D1E8E2', width: '60%', fontSize: '40px', flexDirection: 'column'}}>
            <div className="team-names" style={{paddingRight: '6%'}}>
              <span>Real Madrid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span style={{ color: '#3b3c4c' }}>2&nbsp;&nbsp;<span style={{ color: '#9faec1' }}>-</span>&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>Barcelona</span> <br/>
            </div>
  
            <div style={{fontSize: '15px', color: '#026670'}}>Toronto Stadium</div>
            <div style={{fontSize: '15px', color: '#026670'}}>22 July 2023, 09:00 PM</div>
          </div>

          <div className="team-logo-container" onClick={() => navigate('/team/:teamid')}
               style={{
                    backgroundColor: '#D1E8E2',
                    width: '20%',
                    height: '15vh',
                    marginRight: '10%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#D1E8E2 url(' + teamLogo2 + ') center center no-repeat',
                    backgroundSize: 'contain',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px',
                    }}>
            </div>
        </div>

        <div className="team-buttons">
          <Button variant="primary" onClick={handleClickTeam1} style={{ marginRight: '10px' }}>
            Team 1
          </Button>
          <Button variant="primary" onClick={handleClickTeam2}>
            Team 2
          </Button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2%' }}>
          <div style={{ backgroundColor: '#116466', width: '20%', height: '60vh', marginLeft: '10%', textAlign: 'center', color: 'white', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'}}>
            <div style={{ paddingTop: '5%', fontSize: '30px' }}>Player List</div>
            {playerListOne.map((player, index) => (
              <button
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: player.name === selectedPlayerLeft ? 'lightgray' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '10px 0',
                  marginBottom: '5px',
                }}
                onClick={() => handleClickPlayerLeft(player)}
              >
                <BsFillPersonFill style={{ marginLeft: '5%', marginRight: '5%' }} />
                {player.name} - {player.position}
              </button>
            ))}
          </div>
          <div style={{ backgroundColor: '#d5dcde', width: '60%', height: '60vh' }}>
            <div style={{ backgroundImage: `url(${sport === '1' ? soccerField : basketballField})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100%', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
          <div style={{ paddingTop: '15%'}}>
            {playerListOne.map((player, index) => (
              <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Image
                  src={
                    selectedPlayerData && selectedPlayerData.name === player.name
                      ? player.image
                      : player.image
                  }
                  onClick={() => handleClickPlayerLeft(player)}
                  className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' 
                  roundedCircle 
                  fluid 
                  style={{ width: "3em", height: "3em" }}
                />

                
                {selectedPlayerData && selectedPlayerData.name === player.name && (
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      padding: '1%',
                      borderRadius: '5px',
                      width: '100px',
                      textAlign: 'center',
                    }}
                  >
                    <p>Goals: {player.goals}</p>
                    <p>Assists: {player.assists}</p>
                  </div>
                )}
              </div>
            ))} 
          </div>
          <div style={{ paddingLeft: '20%', paddingTop: '15%'}}>
            {playerListTwo.map((player, index) => (
              <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Image
                  src={
                    selectedPlayerData && selectedPlayerData.name === player.name
                      ? player.image
                      : player.image
                  }
                  onClick={() => handleClickPlayerLeft(player)}
                  className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' 
                  roundedCircle 
                  fluid 
                  style={{ width: "3em", height: "3em" }}
                />
                
                {selectedPlayerData && selectedPlayerData.name === player.name && (
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      padding: '1%',
                      borderRadius: '5px',
                      width: '100px',
                      textAlign: 'center',
                    }}
                  >
                    <p>Goals: {player.goals}</p>
                    <p>Assists: {player.assists}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

            </div>
          </div>
          <div style={{ backgroundColor: '#116466', width: '20%', height: '60vh', marginRight: '10%', textAlign: 'center', color: 'white', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
            <div style={{ paddingTop: '5%', fontSize: '30px' }}>Player List</div>
            {playerListTwo.map((player, index) => (
              <button
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: player.name === selectedPlayerRight ? 'lightgray' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'white',
                  padding: '10px 0',
                }}
                onClick={() => handleClickPlayerRight(player)}
              >
                <BsFillPersonFill style={{ marginLeft: '5%', marginRight: '5%' }} />
                {player.name} - {player.position}
              </button>
            ))}
          </div>
        
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', height: '60vh', paddingTop: '1%', color: 'white' }}>
      <div style={{ backgroundColor: '#116466', width: '80%', height: '50%', borderRadius: '10px' }}>
        <h2 style={{ paddingTop: '1%' }}>Previous Matches</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '20%' }}>
           <a href="/team/:teamid"><Image src={teamLogo1}  className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' roundedCircle fluid style={{ width: "7em", height: "7em"}}/></a>
            <span style={{ fontSize: '40px', margin: '0 10px' }}>3 - 0</span>
            < a href="/team/:teamid"><Image src={teamLogo2}  className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' roundedCircle fluid style={{ width: "7em", height: "7em"}}/></a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
          <a href="/team/:teamid"><Image src={teamLogo1}  className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' roundedCircle fluid style={{ width: "7em", height: "7em"}}/></a>
            <span style={{ fontSize: '40px', margin: '0 10px' }}>1 - 2</span>
            <a href="/team/:teamid"><Image src={teamLogo2}  className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' roundedCircle fluid style={{ width: "7em", height: "7em"}}/></a>
          </div>
        </div>
        <div style={{ fontSize: '24px', marginTop: '1%' }}>
          <span>2022-02-15</span>
          <span style={{ marginLeft: '38%' }}>2022-05-14</span>
        </div>
  
      </div>
   
    </div>
 
      
    </>
  );
};

export default MatchDetails;

