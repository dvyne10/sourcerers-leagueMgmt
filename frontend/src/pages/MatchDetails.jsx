import { useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import soccerField from '/football_field.jpg';
import soccerBackground from '/football_background.jpg';
import teamLogo1 from '/logo_1.jpeg'; 
import teamLogo2 from '/logo_2.png';
import { Button }  from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';

const MatchDetailsSoccer = () => {
  const [selectedPlayerLeft, setSelectedPlayerLeft] = useState(null);
  const [selectedPlayerRight, setSelectedPlayerRight] = useState(null);
  const [selectedPlayerData, setSelectedPlayerData] = useState(null);
  const navigate = useNavigate(); 
  const navigateUpdateMatch = () => { navigate('/updatematch/648e9013466c1c995745907c') }   // temp id only
  const playerListOne = [
    { name: 'Lionel Messi', position: 'MF', goals: 2, assists: 0 },
    { name: 'Cristiano Ronaldo', position: 'FW', goals: 0, assists: 2 },
    { name: 'Virgil van Dijk', position: 'DF', goals: 0, assists: 0 },
  ];
  const playerListTwo = [
    { name: 'Kevin De Bruyne', position: 'MF', goals: 10, assists: 7 },
    { name: 'Sergio Ramos', position: 'DF', goals: 3, assists: 12 },
    { name: 'Neymar Jr', position: 'FW', goals: 2, assists: 4 },
  ];

  const handleClickPlayerLeft = (player) => {
    setSelectedPlayerData(player);
    setSelectedPlayerLeft(player.name);
  };

  const handleClickPlayerRight = (player) => {
    setSelectedPlayerData(player);
    setSelectedPlayerRight(player.name);
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${soccerBackground})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
          <div style={{ textAlign: 'center', paddingTop: '2%' }}>
      <Button onClick={navigateUpdateMatch} variant="primary" >
        Update Match
      </Button>
    </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2%' }}>
        
        <div style={{
                    backgroundColor: '#fffff7',
                    width: '20%',
                    height: '15vh',
                    marginLeft: '10%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#fffff7 url(' + teamLogo1 + ') center center no-repeat',
                    backgroundSize: 'contain',
                    }}>
        </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#d5dcde', width: '60%', fontSize: '40px' }}>
            <span>Real Madrid &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span style={{ color: '#3b3c4c' }}>2&nbsp;&nbsp;<span style={{ color: '#9faec1' }}>-</span>&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span>Barcelona</span>
          </div>
          <div style={{
                    backgroundColor: '#fffff7',
                    width: '20%',
                    height: '15vh',
                    marginRight: '10%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#fffff7 url(' + teamLogo2 + ') center center no-repeat',
                    backgroundSize: 'contain',
                    }}>
            </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2%' }}>
          <div style={{ backgroundColor: '#2d3d60', width: '20%', height: '60vh', marginLeft: '10%', textAlign: 'center', color: 'white' }}>
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
            <div style={{ backgroundImage: `url(${soccerField})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100%', height: '100%' }}>
              <div style={{ paddingLeft: '20%', paddingTop: '26%' }}>
                {playerListOne.map((player, index) => (
                  <div key={index}>
                    <BsFillPersonFill
                      size={70}
                      color={selectedPlayerData && selectedPlayerData.name === player.name ? 'green' : 'white'}
                      onClick={() => handleClickPlayerLeft(player)}
                    />
                    
                    {selectedPlayerData && selectedPlayerData.name === player.name && (
                      <div
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          padding: '1%',
                          borderRadius: '5px',
                          width: '15%',
                    
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
          <div style={{ backgroundColor: '#2d3d60', width: '20%', height: '60vh', marginRight: '10%', textAlign: 'center', color: 'white' }}>
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
        <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', height: '50vh', paddingTop: '1%', color: 'white' }}>
      <div style={{ backgroundColor: '#2d3d60', width: '80%', height: '50%' }}>
        <h2 style={{ paddingTop: '1%' }}>Previous Matches</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '20%' }}>
            <img src={teamLogo1} alt="Team 1 Logo" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            <span style={{ fontSize: '40px', margin: '0 10px' }}>3 - 0</span>
            <img src={teamLogo2} alt="Team 2 Logo" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
            <img src={teamLogo1} alt="Team 1 Logo" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            <span style={{ fontSize: '40px', margin: '0 10px' }}>1 - 2</span>
            <img src={teamLogo2} alt="Team 2 Logo" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          </div>
        </div>
        <div style={{ fontSize: '24px', marginTop: '1%' }}>
          <span>2022-02-15</span>
          <span style={{ marginLeft: '33%' }}>2022-05-14</span>
        </div>
      </div>
    </div>
      </div>
    </>
  );
};

export default MatchDetailsSoccer;

