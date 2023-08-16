import {Container,Row,Col, Image, Button} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BsGearFill } from "react-icons/bs";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './teamdetails.css'
import ListGroup from 'react-bootstrap/ListGroup';
import useAuth, {checkIfSignedIn, getToken} from "../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app/";



function TeamDetails() {
    const routeParams = useParams();
    const navigate = useNavigate(); 
    const navigateUpdateTeam = () => { navigate(`/updateteam/${routeParams.teamid}`) }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [leagueInvitedTo, handleInviteLeague] = useState("");
    const [teamJoinedTo, handleJoinTeam] = useState("");
    const [inviteMsg, handleInviteMsg] = useState("");
    const [joinMsg, handleJoinMsg] = useState("");
    const [showInvite, setShowInvite] = useState(false);
    const handleCloseInvite = () => setShowInvite(false);
    const token = `Bearer ${getToken()}`
    const {isSignedIn} = useAuth();
    const [join, setJoin] = useState(true);
    const [errorMessage, setErrorMessage] = useState([]);
    const [responseMessage, setResponseMessage] = useState("");
    const [teamInfo, setTeamInfo] = useState({teamName:"", players:[],
    matches:[],
    details:{},
    sportsName:"",
  lookingForPlayers:null,
   displayUpdateButton: null,
  displayTurnOnLookingForPlayers: null,
  displayTurnOffLookingForPlayers: null,
  displayUnjoinButton: null,
  displayInviteToLeagueButton: null,
  nsLeaguesUserIsAdmin: [],
  displayUninviteToLeagueButton: null,
  pendingInviteRequestId: "",
  displayJoinButton: null,
  playerCurrentTeamName: "",
  playerCurrentTeamId: "",
  displayCancelReqButton: null,
  pendingJoinRequestId: ""});

    

// Array of team members here
    useEffect(()=>{
      
      fetch(`${backend}/team/${routeParams.teamid}`, {
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
                setTeamInfo({teamName : data.teamName, details: data.details,players :data.details.players, matches: data.details.matches,
                  displayUpdateButton: data.buttons.displayUpdateButton,
                  displayTurnOnLookingForPlayers: data.buttons.displayTurnOnLookingForPlayers,
                  displayTurnOffLookingForPlayers: data.buttons.displayTurnOffLookingForPlayers,
                  displayUnjoinButton: data.buttons.displayUnjoinButton,
                  displayInviteToLeagueButton: data.buttons.displayInviteToLeagueButton,
                  nsLeaguesUserIsAdmin: data.buttons.nsLeaguesUserIsAdmin,
                  displayUninviteToLeagueButton: data.buttons.displayUninviteToLeagueButton,
                  pendingInviteRequestId: data.buttons.pendingInviteRequestId,
                  displayJoinButton: data.buttons.displayJoinButton,
                  playerCurrentTeamName: data.buttons.playerCurrentTeamName,
                  playerCurrentTeamId: data.buttons.playerCurrentTeamId,
                  displayCancelReqButton: data.buttons.displayCancelReqButton,
                  pendingJoinRequestId: data.buttons.pendingJoinRequestId})
    }
})
.catch((error) => {
    console.log(error)
})
      
  },[])

  const handleInvite = () => {
    if (teamInfo.nsLeaguesUserIsAdmin.length > 0) {
      handleInviteLeague(teamInfo.nsLeaguesUserIsAdmin[0].leagueId)
      setShowInvite(true)
    }
  }
  
  const handleUninvite = () => {
    if (teamInfo.pendingInviteRequestId !== "") {
      if (confirm("Please confirm if you want to proceed with invite cancellation.")) {
        fetch(`${backend}/cancelrequest/${teamInfo.pendingInviteRequestId}`, {
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
            } else {
              setTeamInfo({...teamInfo, displayInviteToLeagueButton : true, displayUninviteToLeagueButton: false, pendingInviteRequestId: ""})
            }
        }).catch((error) => {
            console.log(error)
        })
      }
    }
  }
  
  const handleLeagueInviteChange = (e) => {
    handleInviteLeague(e.target.value)
  }
  const handleLeagueInviteMsg = (e) => {
    handleInviteMsg(e.target.value)
  }
  
  const sendInvite = () => {
    let data = {leagueId: leagueInvitedTo, msg: inviteMsg}
    fetch(`${backend}/invitetoleague/${routeParams.teamid}`, {
      method: "POST",
      credentials: 'include',
      body: JSON.stringify(data),
      headers: {
          "Content-Type": "Application/JSON",
          "Authorization": token
      }
    })
    .then(response => response.json())
    .then(data=>{
      if (data.requestStatus === 'RJCT') {
          setErrorMessage([data.errMsg])
      } else {
        setTeamInfo({...teamInfo, displayInviteToLeagueButton : false, displayUninviteToLeagueButton: true, pendingInviteRequestId: data.pendingInviteRequestId})
      }
    })
    setShowInvite(false)
  }


  const handleJoin = () => {
      handleJoinTeam(teamInfo.teamId)
      setShow(true)
  }
  

  const handleUnjoin = () =>{
    if (confirm(`Please confirm if you want to leave the team ${teamInfo.details.teamName}.`)) {
    let data = {teamId: teamInfo.teamId, msg: joinMsg}
    fetch(`${backend}/unjointeam/${routeParams.teamid}`, {
      method: "POST",
      credentials: 'include',
      body: JSON.stringify(data),
      headers: {
          "Content-Type": "Application/JSON",
          "Authorization": token
      }
    })
    .then(response => response.json())
    .then(data=>{
      if (data.requestStatus === 'RJCT') {
          setErrorMessage([data.errMsg])
      } else {
        if(teamInfo.buttons.displayTurnOnLookingForPlayers){
          setTeamInfo({...teamInfo, displayJoinButton : true, displayUnjoinButton: false, displayCancelReqButton: false, pendingJoinRequestId: data.pendingJoinRequestId})
        }
        else{
          setTeamInfo({...teamInfo, displayJoinButton : false, displayUnjoinButton: false, displayCancelReqButton: false, pendingJoinRequestId: data.pendingJoinRequestId})
      }}
    })
  }

  }
  
  const handleCancelRequest = () => {
    
      if (confirm(`Please confirm if you want to proceed with cancelling your request`)) {
        fetch(`${backend}/cancelrequest/${teamInfo.pendingJoinRequestId}`, {
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
            } else {
              setTeamInfo({...teamInfo, displayJoinButton : true, displayUnjoinButton: false, displayCancelReqButton: false, pendingJoinRequestId: ""})
            }
        }).catch((error) => {
            console.log(error)
        })
      }
    
  }
  

  const handleJoinTeamMsg = (e) => {
    handleJoinMsg(e.target.value)
  }
  
  const sendJoin = () => {
    let data = {teamId: teamJoinedTo, msg: inviteMsg}
    fetch(`${backend}/jointeam/${routeParams.teamid}`, {
      method: "POST",
      credentials: 'include',
      body: JSON.stringify(data),
      headers: {
          "Content-Type": "Application/JSON",
          "Authorization": token
      }
    })
    .then(response => response.json())
    .then(data=>{
      if (data.requestStatus === 'RJCT') {
          setErrorMessage([data.errMsg])
      } else {
        setTeamInfo({...teamInfo, displayJoinButton : false, displayUnjoinButton: false, displayCancelReqButton:true, pendingJoinRequestId: data.pendingJoinRequestId})
      }
    })
    setShow(false)
  }

 
 



    return (

        <div key={teamInfo.teamName}> 
      {teamInfo.displayUpdateButton && 
         <div className='d-flex w-100 position-absolute justify-content-end p-4'><Button variant='transparent'  onClick={navigateUpdateTeam} className="btn btn-outline-success"><BsGearFill className="m-auto" /></Button></div>
         }
        <div className='bg-light container justify-content-center text-center'>
        

        
        {/* Here is the team header, with background and info */}
        <div className="bg-image mt-2 d-flex p-5 text-center shadow-1-strong rounded mb-3 text-white" 
   style={{"backgroundImage": `url(${backend}/teambanners/${teamInfo.details._id}.jpeg)`}} >
        <Container style={{background:'https://i.p1inimg.com/600x315/0f/4c/91/0f4c91bfaa06b9e5907fca20e3e37d0d.jpg'}}>
      <Row>
        <Col lg="2" className='text-center'>
        <p><strong>{teamInfo.details.location}</strong></p> 
        <Image src={`${backend}/teamlogos/${teamInfo.details._id}.jpeg`}  className='border border-info shadow object-fit-cover ' roundedCircle fluid style={{ width: "10em", height: "10em"}}/>
        {teamInfo.details.sportsName == "Basketball" ? (
                        <img
                          src="https://i.imgur.com/w14EKbv.png"
                          style={{ width: "2em", backgroundColor:"white", borderRadius:"50%"}}
                          className="text-center opacity-75 mt-2 position-relative"
                        />
                      ) : (
                        <img
                          src="https://i.imgur.com/7Qa798a.png"
                          style={{ width: "2em", backgroundColor:"white", borderRadius:"50%"}}
                          className="text-center opacity-75 mt-2 position-relative"
                        />
                      )}
                     
        </Col>
        <Col><h1>{teamInfo.details.teamName}</h1>
        <p className='mt-2'><strong>Description</strong> : {teamInfo.details.description}</p>
        <h3 className='mt-5'>Contact</h3>
        <p><a href={`mailto:${teamInfo.details.teamContactEmail}`} className='general-link-no-dec text-white text-decoration-underline'>{teamInfo.details.teamContactEmail}</a></p>
        
        </Col>
      </Row>
      <Row>
      <Col lg="2" className="mt-2" >

        <>
                      {isSignedIn && teamInfo.displayInviteToLeagueButton && 
                    (<Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleInvite}>Invite</Button>)
                      }
          
                    {isSignedIn && teamInfo.displayUninviteToLeagueButton && 
                      (<Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleUninvite}>Cancel Invitation</Button>)
                    }
                    {isSignedIn && teamInfo.displayJoinButton && 
                    (<Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleJoin}>Join</Button>)
                      }
                    {isSignedIn && teamInfo.displayUnjoinButton && 
                      (<Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleUnjoin} >Unjoin</Button>)
                    }
                    {isSignedIn && teamInfo.displayCancelReqButton && 
                      (<Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleCancelRequest}>Cancel Request</Button>)
                    }
                    </>
        </Col>
        
        
      </Row>
    </Container>
    
    </div>
    
{/* Here is the team players and listing */}

<h1 className='gap-divider'>Team Members</h1>

<div className='align-items-center border justify-content-center'>

<Row className='gap-3 justify-content-center mb-2 '  > 



{teamInfo.players.map(player=>(
  
    <Col sm={3} className='border mt-2 rounded passive-active-column' key={player.playerId}>
      <Row className='align-items-center'>
      
      
      

      
      <Col sm={3} href="www.google.com" className='text-center rounded-start '    style={{backgroundColor:"#C7DDCC"}}>
      <a href={`/player/${player.playerId}`} className='team-jersey-list-number' >
      <Image
                          src={`${backend}/profilepictures/${player.playerId}.jpeg`}
                          className="mt-2 mb-2 shadow object-fit-cover border"
                          rounded
                          fluid
                          style={{  width: "4em", height: "4em" }}
                        />
                      <h5 >{player.jerseyNumber}</h5>
      </a>
      </Col>
      <Col md="auto" className='mx-auto mt-2'>
        <h6>{player.playerName}</h6>
        <p>{player.positionDesc}</p>
        <h6>{new Date(player.joinedTimestamp).toLocaleDateString('en-US')}</h6>
      </Col>
     
       

      </Row>
      
    </Col>
     ))}
    

</Row>

</div>
    


    <div className='mt-20 container justify-content-center text-center gap-divider ' >
{/* This is for the past matches list for the team */}
      <Row className=''>
        <Col sm={12} className='border'>
        <div className='team-past-matches'>
          <h2 className='center-header gap-divider'>Past Matches</h2>
          <Row className='text-center mx-1'>
              <Col md={2}>
              <h6 className='border-bottom border-secondary'>Date</h6>
              </Col>
              <Col md={3}>
              <h6 className='border-bottom border-secondary'>Team 1</h6>
              </Col>
              <Col md={2}>
              <h6 className='border-bottom border-secondary'>Score</h6>
              </Col>
              <Col md={3}>
              <h6 className='border-bottom border-secondary'>Team 2</h6>
              </Col>
              <Col md={2}>
              <h6 className='border-bottom border-secondary'>Location</h6>
              </Col>
              </Row>
      <Row>
        <Col sm={12} >
          <ListGroup className='overflow-auto' style={{height:"30em"}}>
            {teamInfo.matches.map(match=>(
              <ListGroup.Item action variant={match.won ? "success" : "danger"} href={`/match/${match.matchId}`}  className='mt-2' key={match.matchId}>
              <Row className='text-center'>
              <Col md={2}>
              {new Date(match.dateOfMatch).toLocaleDateString('en-US')}
              </Col>
              <Col md={3}>
              {match.team1.teamName}
              </Col>
              <Col md={2}>
              {match.team1.finalScore + " - " + match.team2.finalScore}
              </Col>
              <Col md={3}>
              {match.team2.teamName}
              </Col>
              <Col md={2}>
              {match.locationOfMatch}
              </Col>
              </Row>
            </ListGroup.Item>
            ))}
            
            
            
          </ListGroup>
        </Col>
        <Col sm={8}>
          
        </Col>
      </Row>


          </div>
        </Col>
        <Col sm={3} className='container ' style={{"minWidth":"20rem"}}>

        </Col>
        
      </Row>
      </div>
    
        {/* This is past matches div on the left bottom side of the page */}
        
        



{/* Modal opening up after clicking Join */}
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Explain shortly why you want to join this team.</Form.Label>
              <Form.Control as="textarea" rows={3} name="joinMsg" value={joinMsg} onChange={handleJoinTeamMsg}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
         
          <Button variant="success" onClick={sendJoin}>
            Send Request
          </Button>
          
          
          

        </Modal.Footer>
      </Modal>

    {/* Modal opening up after clicking Invite */}
    <Modal show={showInvite} onHide={handleCloseInvite}>
      <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Choose league to invite player to</Form.Label>
            <select id="teamInvitedTo" name="teamInvitedTo" className="form-control" value={leagueInvitedTo} onChange={handleLeagueInviteChange}>
                {teamInfo.nsLeaguesUserIsAdmin.map((option) => (
                    <option value={option.leagueId} key={option.leagueId}>{option.leagueName}</option>
                ))}
            </select>
            <br/><br/>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Explain shortly why you want to invite this team to your league.</Form.Label>
              <Form.Control as="textarea" rows={3} name="inviteMsg" value={inviteMsg} onChange={handleLeagueInviteMsg}/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseInvite}>
            Cancel
          </Button>
          <Button variant="success" onClick={sendInvite}>
            Confirm Invite
          </Button>
        </Modal.Footer>
      </Modal>

  </div>

  </div>
  );
  }
  
  export default TeamDetails  ;