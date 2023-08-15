import { Container, Row, Col, Card, Button, Stack } from "react-bootstrap";
import FlippableCard from '../components/card/FlippableCard'; 
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import useAuth, {checkIfSignedIn, getToken} from "../hooks/auth";


const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";



const Player = () => {

    
    
    const routeParams = useParams();
    const token = `Bearer ${getToken()}`
    const {isSignedIn} = useAuth();
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    const handleClose = () => setShowInvite(false);
    const handleShow = () => setShowInvite(true);
    const [invite, setInvite] = useState(false);
    const [errorMessage, setErrorMessage] = useState([]);
    const [playerInfo, setPlayerInfo] = useState({fullName:"", email:"", phone:"", userName:"", location:"", sports:[{}], statusDesc:"", activeTeams:[{}],activeLeagues:[{}],teamsCreated:[{}],leaguesCreated:[{}], pastLeagues:[{}], 
    matches:[{}], totalGamesPlayed:"", wins:"", statistics:[{}], championships:"", displayInviteToTeamButton:null, displayUninviteToTeamButton:null, })
    const [inviteButton, setInviteButton] = useState({title:"displayInviteToTeamButton", status:"false"})
    const [action, handleAction] = useState({type: "usprofile", title: "Profile"});
    const navigate = useNavigate();

    function changeInviteShow(){
    
      setInvite(!invite);
      setShowInvite(false);
  }

  useEffect(() => {
    const url = window.location.pathname.substring(1,10).toLowerCase()
    if (url === "myprofile") {
        handleAction({type: "myprofile", title: "My Profile"})
        
        fetch(`${backend}/myprofile`, {
          method: "PUT",
          credentials: 'include',
          headers: {
              "Content-Type": "Application/JSON",
              "Authorization": token
          }
      })
      .then(response => response.json())
      .then(data=>{
          if (data.requestStatus === 'RJCT') {
              setErrorMessage([data.errMsg])
              if (data.errField !== "") {
                  document.getElementById(data.errField).focus()
              }
          } else {
                  setPlayerInfo(
                    {fullName: data.details.fullName, email: data.details.email, phone:data.details.phone, userName: data.details.userName, location: data.details.location, sports:data.details.sports,
                      statusDesc:data.details.statusDesc, activeTeams:data.activeTeams,activeLeagues:data.activeLeagues,teamsCreated:data.teamsCreated,leaguesCreated:data.teamsCreated, pastLeagues:data.pastLeagues, 
                      matches:data.matches, statistics:data.statistics, totalGamesPlayed:data.totalGamesPlayed, wins:data.wins, championships:data.championships, displayInviteToTeamButton:data.buttons.displayInviteToTeamButton, displayUninviteToTeamButton:data.displayUninviteToTeamButton
                    
                    }
                    
                    
                  )
                  setLoading(false)
      }
  })
  .catch((error) => {
      console.log(error)
  })
        
    }
    else{
      
      handleAction({type: "usprofile", title: "User Profile", protectSport: false, protectRounds: false})
    }
      fetch(`${backend}/player/${routeParams.id}`, {
          method: "POST",
          credentials: 'include',
          headers: {
              "Content-Type": "Application/JSON",
              "Authorization": token
          }
      })
      .then(response => response.json())
      .then(data=>{
          if (data.requestStatus === 'RJCT') {
              setErrorMessage([data.errMsg])
              if (data.errField !== "") {
                  document.getElementById(data.errField).focus()
              }
          } else {
                  setPlayerInfo(
                    {fullName: data.details.fullName, email: data.details.email, phone:data.details.phone, userName: data.details.userName, location: data.details.location, sports:data.details.sports,
                      statusDesc:data.details.statusDesc, activeTeams:data.activeTeams,activeLeagues:data.activeLeagues,teamsCreated:data.teamsCreated,leaguesCreated:data.teamsCreated, pastLeagues:data.pastLeagues, 
                      matches:data.matches, statistics:data.statistics, totalGamesPlayed:data.totalGamesPlayed, wins:data.wins, championships:data.championships, displayInviteToTeamButton:data.buttons.displayInviteToTeamButton, displayUninviteToTeamButton:data.displayUninviteToTeamButton
                    
                    })
                    if(data.buttons.displayInviteToTeamButton){
                      setInviteButton({title:"displayInviteToTeamButton"})
                    }
                    else if(data.buttons.displayUninviteToTeamButton){
                      setInviteButton();
                    }
                    else{
                      setInviteButton({title:null, status:null})
                    }
                    
                  
                  setLoading(false)
      }
  })
  .catch((error) => {
      console.log(error)
  })
    
},[]);
            



    return (
        <>

        
          
        { !isSignedIn && action.type==="myprofile" ? (
            <div>
                {navigate('/signin')}
            </div>
        ) : ( 
        <Container className="mt-5" >
          {loading ? (
            errorMessage.length===0 ? ( <div>
              
              <div className="center-wave">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div></div>
            
              ) : (<h1>{errorMessage[0]}No user found</h1>)
           ) 
            : (
      <Row className="gutters-sm">
        <Col md={4} className="mb-3">
          <Card>
            <Card.Body>
              <div className="d-flex flex-column align-items-center text-center">
                <img
                  src="https://images.lifestyleasia.com/wp-content/uploads/sites/3/2022/12/31011513/harry-potter-films.jpeg"
                  className="rounded-circle"
                  width="150"
                />
                <div className="mt-3">
                  <h4>{playerInfo.fullName}</h4>
                  <p className="text-secondary mb-1">@{playerInfo.userName}</p>
                  
                  <p className="text-secondary font-size-sm mb-1">
                    {playerInfo.location}
                  </p>
                  <p className="text-secondary font-size-sm mb-2"><a href={"mailto:"} className="text-secondary text-decoration-none">{playerInfo.email}</a></p>

                  <p className="text-secondary font-size-sm mb-2">{playerInfo.phone}</p>
                  {action.type==="myprofile" ? (
                    <Button href="/updateaccount">Settings</Button>
                  ) : (
                    (isSignedIn &&
                    <Button variant={invite === false ? "btn btn-outline-success" : "btn btn-outline-danger"} onClick={handleShow}>{invite === false ? "Invite" : "Uninvite"}</Button>
                  ))
                  }
                          
                

                </div>
              </div>
            </Card.Body>
          </Card>
          <Card className="mt-3">
            <Card.Body>
              <ul className="list-group list-group-flush">

                <h4 className="text-center pt-1 pb-3">Teams</h4>
                
                  
                    
                    {playerInfo.activeTeams.length===0 ? <h6 className="center-header">No active teams.</h6> : playerInfo.activeTeams.map((sports, index) => (
                      <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap" key={index}>
                      <h6 className="mb-0" >{sports.sportsName}</h6>
                      <a href={"/team/"+sports.teamName}>
                      <span className="text-secondary">{sports.teamName+"/"+sports.jerseyNumber}</span></a>
                      </li>
                    ))}

                  <h4 className="text-center pt-1 pb-3">Teams Created</h4>
                  {playerInfo.teamsCreated.length===0 ? <h6 className="center-header">No teams created.</h6> : playerInfo.teamsCreated.map((sports, index) => (
                      <li className="list-group-item text-center flex-wrap" key={index}>
                      <a href={"/team/"+sports.teamName} className="general-link-no-dec">
                      {index+1+ "." + sports.teamName}</a>
                      </li>
                    ))}

              </ul>
            </Card.Body>
          </Card>
          <Card className="mt-3 overflow-auto" style={{height:"30em"}}>
            <Card.Body>
              <h4 className="text-center">Past Matches</h4>
                   {/* Past Matches Here */}
                   <ListGroup>
                    {playerInfo.matches.length===0 ? <h6 className="center-header">No past matches.</h6> :playerInfo.matches.map(match=>(
                      <ListGroup.Item key={match.matchId} action variant={match.playerTeam.won ? "success" : "danger"} href={"/match/"+match.matchId}  className='mt-2'>
                      <Row className='text-center'>
                      <Col md={4}>
                      {new Date(match.dateOfMatch).toLocaleDateString('en-US')}
                      </Col>
                      <Col>
                     {match.team1.teamName+ " " + match.team1.finalScore +  " - " + match.team2.finalScore+ " " + match.team2.teamName}
                      </Col>
                      <Col>
                      {match.locationOfMatch}
                      </Col>
                      </Row>
                    </ListGroup.Item>
                    )

                    )}
          </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            
              
              {playerInfo.statistics.length===0 ?<div><h4 className="center-header" >Statistics</h4> <h6 className="center-header">No statistics yet.</h6></div> :playerInfo.statistics.map(stat=>(
                <div key={stat.sportsTypeId}>
                  <h4 className="center-header" >{stat.sportsName} Statistics</h4>
                
              <div className="denemerow12">
                {/* This part will repeat */}
             
              {stat.stats.map(indvStat=>(
                 <div className="d-block denemecolumn12" key={indvStat.statisticsId}>
                <h1 className=" text-center"  style={{fontSize:"9rem", fontFamily:"Saira Extra Condensed", color:"indigo"}}>{indvStat.totalValue}</h1>
                <div className="text-center w-50 mx-auto"><h6 className="border-top border-bottom">{indvStat.statShortDesc}</h6></div>
              
              
                </div>
              ))}
        
        
     
{/* Repeat end */}
      </div>

      
      </div>
      
    ))}
        </Card>

          <Card className="mt-5">
            <Card.Body className="justify-content-center align-items-center text-center">
            <h4 className="center-header">Active Leagues</h4>
              <Row ><Col>
              <div className="col d-flex flex-column flex-md-row justify-content-around align-items-center mx-5 mb-5">
                {playerInfo.activeLeagues.length===0 ? <h6 className="center-header">No active leagues.</h6> :playerInfo.activeLeagues.map(league=>(
                  <FlippableCard imageUrl={`${backend}/leaguelogos/${league.leagueId}.jpeg`} cardText={league.leagueName} teams={league.teams}  key={league.leagueId}/>

                ))}
              
             
          </div>
    </Col>
          <hr />      
</Row>

              <h4 className="center-header">Past Leagues</h4>
              <Row className="justify-content-center">
                
              
        <Col sm={12} >
          <ListGroup>
            {playerInfo.activeTeams.length===0 ? <h6 className="center-header">No past leagues.</h6> :(
          <Row className='text-center mb-3  '>
              <Col md={4}>
                Name
              </Col>
              <Col md={2}>
              Start Date
              </Col>
              <Col md={2}>
              End Date
              </Col>
              <Col md={3}>
              Location
              </Col>
              </Row>  )}
              {playerInfo.pastLeagues.map(pastLeague=>(
                <ListGroup.Item action href={"/league/"+pastLeague.leagueId} key={pastLeague.leagueId}>
              <Row className='text-center'>
              <Col md={4}>
                {pastLeague.leagueName}
              </Col>
              <Col md={2}>
              {new Date(pastLeague.startDate).toLocaleDateString('en-US')}
              </Col>
              <Col md={2}>
              {new Date(pastLeague.endDate).toLocaleDateString('en-US')}
              </Col>
              <Col md={3}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
              ))}
              
            </ListGroup>
            </Col>
            </Row>
            <h1>{playerInfo.displayInviteToTeamButton}</h1>

            <h4 className="center-header">Teams Created</h4>
              <Row className="justify-content-center">
              
        <Col sm={12} >
          <ListGroup>
            {playerInfo.teamsCreated.length===0 ? <h6 className="center-header">No teams created.</h6> :(
          <Row className='text-center mb-3  '>
              <Col md={4}>
                Name
              </Col>
              <Col md={2}>
              Start Date
              </Col>
              <Col md={2}>
              End Date
              </Col>
              <Col md={3}>
              Location
              </Col>
              </Row>  )}
              {playerInfo.teamsCreated.map(createdTeam=>(
                <ListGroup.Item action href={"/league/"+createdTeam.teamId} key={playerInfo.leagueId}>
              <Row className='text-center'>
              <Col md={4}>
                {playerInfo.leagueName}
              </Col>
              <Col md={2}>
              {new Date(playerInfo.startDate).toLocaleDateString('en-US')}
              </Col>
              <Col md={2}>
              {new Date(playerInfo.endDate).toLocaleDateString('en-US')}
              </Col>
              <Col md={3}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
              ))}
              
            </ListGroup>
            </Col>
            </Row>

                
            
                
              
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
      
            )}
            
    </Container>
)}


{/* Modal opening up after clicking Join */}
<Modal show={showInvite} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Explain shortly why you want to {invite===false ? "invite" : "uninvite"} this player to your team.</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant={invite===false ? "success" : "danger"} onClick={changeInviteShow}>
          {invite===false ? "Invite" : "Uninvite"}
          </Button>
        </Modal.Footer>
      </Modal>

        </>
    )
}

export default Player; 