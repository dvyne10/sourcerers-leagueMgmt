import { useState, useEffect } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import soccerField from '/images/matchDetails/football_field.jpg';
import soccerBackground from '/images/matchDetails/football_background.jpg';
import basketballField from '/images/matchDetails/basketball_court.jpeg'; 
import basketballBackground from '/images/matchDetails/basketball_background.jpeg';
import Button from 'react-bootstrap/Button'; 
import { Image }  from 'react-bootstrap'; 
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { BsGearFill } from "react-icons/bs";
import useAuth from "../hooks/auth";
import {getToken} from "../hooks/auth"; 

const backend = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://panicky-robe-mite.cyclic.app';

const MatchDetails = () => {
  
  const [selectedPlayerLeft, setSelectedPlayerLeft] = useState(null);
  const [selectedPlayerRight, setSelectedPlayerRight] = useState(null);
  const [selectedPlayerData, setSelectedPlayerData] = useState(null);
  const [matchDetails, setMatchDetails] = useState(null);
  const [displayedTeam, setDisplayedTeam] = useState(1); 
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate(); 
  const routeParams = useParams();
  const { isSignedIn } = useAuth()
  const navigateUpdateMatch = () => { navigate(`/updatematch/${routeParams.matchid}`) }   
  const token = `Bearer ${getToken()}`; 

  const handleClickPlayerLeft = (player) => {
    setSelectedPlayerData(player);
    setSelectedPlayerLeft(player.playerName);
    setSelectedPlayerRight(null);
  };

  const handleClickPlayerRight = (player) => {
    setSelectedPlayerData(player);
    setSelectedPlayerRight(player.playerName);
    setSelectedPlayerLeft(null); 
  };
  
  const handleClickTeam1 = () => {
    setDisplayedTeam(1);
  };

  const handleClickTeam2 = () => {
    setDisplayedTeam(2);
  };
  
  const fetchMatchDetails = async () => {
    setIsLoading(false); 
    try {
      const response = await fetch(`${backend}/match/${routeParams.matchid}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      });

      const data = await response.json(); 
      if (data.requestStatus === "ACTC") {
        setMatchDetails(data.details); 
        setIsLoading(false); 
      } else {
        navigate("/")
      }
    } catch (error) {
      console.error(`Error fetching match details: ` + error); 
      navigate("/")
    }
  }

  useEffect(() => {
    fetchMatchDetails();    
  }, []);


  return (
    <>
    {isLoading && (
        <div className="loading-overlay">
          <div >Loading...</div>
        <div className="loading-spinner"></div>
        </div>
    )}
    {matchDetails && (
      <>

    <div style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundImage: `url(${matchDetails.sportsName === 'Soccer' ? soccerBackground : basketballBackground})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      opacity: 0.6,  
      zIndex: -1
    }}/>
  
  
  <div style={{marginLeft: '95%',  transform: 'translateY(15px)'}}>
  {isSignedIn && matchDetails && matchDetails.enableUpdateButton && (
    <Button onClick={navigateUpdateMatch} variant='transparent' className="btn btn-outline-success">
      <BsGearFill className="m-auto" />
    </Button>
  )}
  {isSignedIn && matchDetails && matchDetails.displayUpdateButton &&  (
    <Button onClick={navigateUpdateMatch} variant='transparent' className="btn btn-outline-success disabled">
      <BsGearFill className="m-auto" />
    </Button>
  )}

    </div>
  
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2%' }}>
          
          <div className="team-logo-container" onClick={() => navigate('/team/:teamid')}
              style={{
                      backgroundColor: '#D1E8E2',
                      width: '20%',
                      height: '15vh',
                      marginLeft: '10%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: `#D1E8E2 url(${backend}/teamlogos/${matchDetails.team1.teamId}.jpeg) center center no-repeat`,
                      backgroundSize: 'contain',
                      borderTopLeftRadius: '10px',
                      borderBottomLeftRadius: '10px',                    
                      }}>
          </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#D1E8E2', width: '60%', fontSize: '40px', flexDirection: 'column'}}>
              <div className="team-names" >
                <span>{matchDetails.team1.teamName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span style={{ color: '#3b3c4c' }}>{matchDetails.team1.finalScore}&nbsp;&nbsp;<span style={{ color: '#9faec1' }}>-</span>&nbsp;&nbsp;{matchDetails.team2.finalScore}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span>{matchDetails.team2.teamName}</span> <br/>
              </div>
    
              <div style={{fontSize: '15px', color: '#026670'}}>{matchDetails.locationOfMatch}</div>
              <div style={{fontSize: '15px', color: '#026670'}}>
                {format(new Date(matchDetails.dateOfMatch), 'yyyy-MM-dd')}
              </div>
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
                      background: `#D1E8E2 url(${backend}/teamlogos/${matchDetails.team2.teamId}.jpeg) center center no-repeat`,
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
            <div style={{ backgroundColor: '#116466', width: '20%', height: '60vh', overflowY: 'scroll', marginLeft: '10%', textAlign: 'center', color: 'white', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'}}>
              <div style={{ paddingTop: '5%', fontSize: '30px' }}>Player List</div>
              {matchDetails.team1.players.map((player, index) => (
                <button
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: player.playerName === selectedPlayerLeft ? 'lightgray' : 'transparent',
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
                  {player.playerName} - {player.positionId}
                </button>
              ))}
            </div>
            
            <div style={{ backgroundColor: '#d5dcde', width: '60%', height: '60vh' }}>
              <div style={{ backgroundImage: `url(${matchDetails.sportsName === 'Soccer' ? soccerField : basketballField})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', width: '100%', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'center'}}>
            <div style={{ paddingTop: '5%', paddingRight: '30%'}}>
            {matchDetails.team1.players.map((player, index) => (
            <div
              key={index}
              style={{
                display: selectedPlayerData && selectedPlayerData.playerName === player.playerName ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Image
                src={`${backend}/profilepictures/${player.playerId}.jpeg`}
                onClick={() => handleClickPlayerLeft(player)}
                className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' 
                roundedCircle 
                fluid 
                style={{ width: "5em", height: "5em" }}
              />
              {selectedPlayerData && selectedPlayerData.playerName === player.playerName && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '1%',
                    borderRadius: '5px',
                    width: '100px', 
                    textAlign: 'center',
                  }}
                >
                          {player.statistics.map((stat, index) => (
                            <p key={index}>
                              {stat.statShortDesc}: {stat.value}
                            </p>
                          ))}
                </div>
              )}
            </div>
          ))}

            </div>
            <div style={{ paddingLeft: '5%', paddingTop: '5%'}}>
            {matchDetails.team2.players.map((player, index) => (
            <div
              key={index}
              style={{
                display: selectedPlayerData && selectedPlayerData.playerName === player.playerName ? 'flex' : 'none',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Image
                src={`${backend}/profilepictures/${player.playerId}.jpeg`}
                onClick={() => handleClickPlayerLeft(player)}
                className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' 
                roundedCircle 
                fluid 
                style={{ width: "5em", height: "5em" }}
              />
              {selectedPlayerData && selectedPlayerData.playerName === player.playerName && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '1%',
                    borderRadius: '5px',
                    width: '100px',
                    textAlign: 'center',
                  }}
                >
                          {player.statistics.map((stat, index) => (
                            <p key={index}>
                              {stat.statShortDesc}: {stat.value}
                            </p>
                          ))}
                </div>
              )}
            </div>
          ))}

            </div>
          </div>

              </div>
            </div>
            <div style={{ backgroundColor: '#116466', width: '20%', height: '60vh', overflowY: 'scroll', marginRight: '10%', textAlign: 'center', color: 'white', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
              <div style={{ paddingTop: '5%', fontSize: '30px' }}>Player List</div>
              {matchDetails.team2.players.map((player, index) => (
                <button
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    backgroundColor: player.playerName === selectedPlayerRight ? 'lightgray' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'white',
                    padding: '10px 0',
                  }}
                  onClick={() => handleClickPlayerRight(player)}
                >
                  <BsFillPersonFill style={{ marginLeft: '5%', marginRight: '5%' }} />
                  {player.playerName} - {player.positionId}
                </button>
              ))}
            </div>
          
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', height: '80vh', paddingTop: '1%', color: 'white' }}>
            <div style={{ backgroundColor: '#116466', width: '80%', height: '50%', borderRadius: '10px' }}>
              <h2 style={{ paddingTop: '1%' }}>Previous Matches</h2>
              {matchDetails.pastMatches.map((match, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginRight: '20%' }}>
                    <a href={`/team/${match.team1.teamId}`}>
                      <Image src={`${backend}/teamlogos/${match.team1.teamId}.jpeg`} className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' roundedCircle fluid style={{ width: "7em", height: "7em"}}/>
                    </a>
                    <span style={{ fontSize: '40px', margin: '0 10px' }}>{match.team1.finalScore} - {match.team2.finalScore}</span>
                    <a href={`/team/${match.team2.teamId}`}>
                      <Image src={`${backend}/teamlogos/${match.team2.teamId}.jpeg`} className='border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style' roundedCircle fluid style={{ width: "7em", height: "7em"}}/>
                    </a>
                  </div>
                  <div style={{ fontSize: '24px', marginTop: '1%' }}>
                    <span>{format(new Date(match.dateOfMatch), 'yyyy-MM-dd')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

      </>
      )}
      
    </>
  );
};

export default MatchDetails;

