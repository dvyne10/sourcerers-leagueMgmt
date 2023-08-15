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
    const [showInvite, setShowInvite] = useState(false);
    const handleCloseInvite = () => setShowInvite(false);
    const handleShowInvite = () => setShowInvite(true);
    const token = `Bearer ${getToken()}`
    const {isSignedIn} = useAuth();
    const [buttonRes, setButtonRes] = useState("BR");
    const [join, setJoin] = useState(true);
    const [errorMessage, setErrorMessage] = useState([]);
    const [teamInfo, setTeamInfo] = useState({teamName:"", players:[],
    matches:[],
    details:{},
    sportsName:"",
  lookingForPlayers:null,
  buttons:{}});
    const [invite, setInvite] = useState(false);

    

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
                setTeamInfo({teamName : data.teamName, details: data.details,players :data.details.players, buttons:data.buttons, matches: data.details.matches})
    }
})
.catch((error) => {
    console.log(error)
})
      
  },[])

 
 



    return (
      
      
        <div key={teamInfo.teamName}> 
      {teamInfo.buttons.displayUpdateButton && 
         <div className='d-flex w-100 position-absolute justify-content-end p-4'><Button variant='transparent'  onClick={navigateUpdateTeam} className="btn btn-outline-success"><BsGearFill className="m-auto" /></Button></div>
         }
        <div className='bg-light container justify-content-center text-center'>
        

        
        {/* Here is the team header, with background and info */}
        <div className="bg-image mt-2 d-flex p-5 text-center shadow-1-strong rounded mb-3 text-white" 
   style={{"backgroundImage": `url(${backend}/teambanners/${teamInfo.details._id}.jpeg)`}} >
        <Container style={{background:'https://i.p1inimg.com/600x315/0f/4c/91/0f4c91bfaa06b9e5907fca20e3e37d0d.jpg'}}>
      <Row>
        <Col lg="2" className='text-center'>
         
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
        <p className='mt-1'><strong>Started</strong> : {new Date(teamInfo.details.createdAt).toLocaleDateString('en-US')}</p>
        <h3 className='mt-5'>Contact</h3>
        <p><a href={`mailto:${teamInfo.details.teamContactEmail}`} className='general-link-no-dec text-white text-decoration-underline'>{teamInfo.details.teamContactEmail}</a></p>
        
        </Col>
      </Row>
      <Row>
        <Col lg="2" className="mt-2" ><Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleShow}>{join===false ? "Join" : "Unjoin"}</Button>
        {teamInfo.buttons.displayJoinButton &&<Button className='mt-2 ms-2 mb-2 btn-success rounded-pill' onClick={handleShowInvite}>{invite===false ? "Invite to League" : "Uninvite to League"}</Button>}
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
              <Col md={3}>
              <h6 className='border-bottom border-secondary'>Date</h6>
              </Col>
              <Col md={3}>
              <h6 className='border-bottom border-secondary'>Team 1</h6>
              </Col>
              <Col md={3}>
              <h6 className='border-bottom border-secondary'>Team 2</h6>
              </Col>
              <Col md={3}>
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
              <Col md={4}>
              {match.team1.teamName + " " + match.team1.finalScore}
              </Col>
              <Col md={4}>
              {match.team2.finalScore + " " + match.team2.teamName}
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

          {/* This is the timeline for upcoming matches on the right side of the page*/}
        {/* <div className="team-upcoming-matches w-100">
          <h4 className='center-header'>Upcoming Matches</h4><hr />
    <ul>
      <li className='active-game-hover'>
      <a href='/match/1' className='general-link-no-dec'>
        <span className='active-game'>21st June 2023</span>
        <div className="content">
        
          <h3>Arsenal</h3>
        </div>
        </a>
      </li>
      
      <li className='past-game-hover'>
      <a href='/match/3' className='general-link-no-dec'>
        <span className='past-game'>15th April 2023</span>
        <div className="content">
          <h3>Barcelona</h3>
        </div>
        </a>
      </li>
      
      <li className='past-game-hover'>
      <a href='/match/2' className='general-link-no-dec'>
        <span className='past-game'>22nd March 2023</span>
        <div className="content">
          <h3>Real Madrid</h3>
        </div>
        </a>
      </li>
    </ul>
  </div> */}

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
          <Form action='POST'>
            
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Explain shortly why you want to {teamInfo.displayJoinButton===false ? "join to" : "unjoin from"} this league.</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {teamInfo.displayJoinButton ? <Button type='submit' variant="danger" >Join</Button>
          :
          <Button variant="danger">Unjoin</Button>
          
}
<p>{buttonRes}</p>
        </Modal.Footer>
      </Modal>

    {/* Modal opening up after clicking Invite */}
    <Modal show={showInvite} onHide={handleCloseInvite}>
    <Modal.Header closeButton>
        <Modal.Title>Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Explain shortly why you want to {invite===false ? "invite" : "uninvite"} this league.</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseInvite}>
          Cancel
        </Button>
        
         
         
        <Button variant={invite===false ? "success" : "danger"} >
        {invite===false ? "Invite Team" : "Uninvite Team"}
        </Button>
      </Modal.Footer>
    </Modal>

  </div>

  </div>
  );
  }
  
  export default TeamDetails  ;