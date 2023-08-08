import {Container,Row,Col, Image, Button} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsGearFill } from "react-icons/bs";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './teamdetails.css'
import ListGroup from 'react-bootstrap/ListGroup';




function TeamDetails() {
    const navigate = useNavigate(); 
    const navigateUpdateTeam = () => { navigate('/updateteam/648e9013466c1c995745907c') }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showInvite, setShowInvite] = useState(false);
    const handleCloseInvite = () => setShowInvite(false);
    const handleShowInvite = () => setShowInvite(true);
    const [join, setJoin] = useState(false);
    const [invite, setInvite] = useState(false);

// Array of team members here
    const teamMembers = [
        { id: 1, imurl: 'https://images.squarespace-cdn.com/content/v1/590814dc1e5b6c7f60b5e133/1495591011988-I2E7W449RQFRP9M50CTT/teens_008.jpg?format=2500w', body: "Carla Dovermner", position: "Forward" },
        { id: 2, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Back"},
        { id: 3, body: "Carla Dovermnersd", position: "Back" },
        { id: 4, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Left Wing" },
        { id: 5, body: "Carla Dovermner" },
        { id: 6, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Right Wing"  },
        { id: 15, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Forward"  },
        { id: 17, body: "Carla Dovermner" },
        { id: 18, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Goalkeeper"  },
        { id: 7, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Left Wing" },
        { id: 8, body: "Carla Dovermner" },
        { id: 9, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Right Wing"  },
        { id: 10, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Forward"  },
        { id: 11, body: "Carla Dovermner" },
        { id: 12, imurl: 'https://c4.wallpaperflare.com/wallpaper/461/775/643/drake-beard-musician-face-portrait-wallpaper-preview.jpg', body: 'Walter White', position: "Goalkeeper"  }
    ];
    function changeJoinShow(){
    
      setJoin(!join);
      setShow(!show);
  }

  function changeInviteShow(){
    
    setInvite(!invite);
    setShowInvite(false);
}


const [data, setData] = useState([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:8000/teams');
      const data = await response.json();
      setData(data.details);
    } catch (error) {
      console.error('Error fetching teams data:', error);
    }
  };

    return (
      <>
      <div className='d-flex w-100 position-absolute justify-content-end p-4'><Button variant='transparent' onClick={navigateUpdateTeam} className="btn btn-outline-success"><BsGearFill className="m-auto" /></Button></div>
        <div className='bg-light container justify-content-center text-center'>
        {/* Here is the team header, with background and info */}
        <div className="bg-image mt-2 d-flex p-5 text-center shadow-1-strong rounded mb-3 text-white"
  style={{"backgroundImage": "url('https://mdbcdn.b-cdn.net/img/new/slides/003.webp')"}} >
        <Container style={{background:'https://i.p1inimg.com/600x315/0f/4c/91/0f4c91bfaa06b9e5907fca20e3e37d0d.jpg'}}>
      <Row>
        <Col lg="2" className='text-center'>
      
        <Image src="https://i.ytimg.com/vi/ghMKmANLr4E/maxresdefault.jpg"  className='border border-info shadow object-fit-cover ' roundedCircle fluid style={{ width: "10em", height: "10em"}}/>
     
        </Col>
        <Col><h1>Team name here</h1>
        <p className='mt-5'>Team description here.</p></Col>
      </Row>
      <Row>
        <Col lg="2" className="mt-2" ><Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleShow}>{join===false ? "Join" : "Unjoin"}</Button>
        <Button className='mt-2 ms-2 mb-2 btn-success rounded-pill' onClick={handleShowInvite}>{invite===false ? "Invite to League" : "Uninvite to League"}</Button></Col>

      </Row>
    </Container>
    
    </div>
    
{/* Here is the team players and listing */}

<h1 className='gap-divider'>Team Members</h1>

<div className='align-items-center border justify-content-center'>
<Row className='gap-3 justify-content-center mb-2 '> 
{teamMembers.map((teamMember)=>{
return(
  
 
    <Col sm={3} className='border mt-2 rounded passive-active-column' key={teamMember.id}>
      <Row className='align-items-center'>
      


      <Col sm={3} href="www.google.com" className='text-center rounded-start '  style={{backgroundColor:"#C7DDCC"}}>
      <a href={`/player/${teamMember.id}`} className='team-jersey-list-number' >
      <Image
                          src={teamMember.imurl ===undefined ? `https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg` : teamMember.imurl}
                          className="mt-2 mb-2 shadow object-fit-cover border"
                          rounded
                          fluid
                          style={{  width: "4em", height: "4em" }}
                        />
                      {console.log(teamMember.imurl)}
                      <h5 >No : 23</h5>
      </a>
      </Col>
      <Col md="auto" className='mx-auto mt-2'>
        <h6>{teamMember.body}</h6>
        <p>{teamMember.position == undefined ? "Not Assigned" : teamMember.position}</p>
        <h6>23</h6>
      </Col>
      </Row>
    </Col>
    
    
            
)})
}
</Row>
</div>
    


    <div className='mt-20 container justify-content-center text-center gap-divider'>
{/* This is for the past matches list for the team */}
      <Row className=''>
        <Col sm={9} className='border'>
        <div className='team-past-matches'>
          <h2 className='center-header gap-divider'>Past Matches</h2>
          <Row className='text-center mx-1'>
              <Col md={2}>
              <h6 className='border-bottom border-secondary'>Date</h6>
              </Col>
              <Col md={4}>
              <h6 className='border-bottom border-secondary'>Opponent</h6>
              </Col>
              <Col md={4}>
              <h6 className='border-bottom border-secondary'>Score</h6>
              </Col>
              <Col md={2}>
              <h6 className='border-bottom border-secondary'>Location</h6>
              </Col>
              </Row>
      <Row>
        <Col sm={12} >
          <ListGroup>
            <ListGroup.Item action variant="danger" href="/match/1"  className='mt-2'>
              <Row className='text-center'>
              <Col md={2}>
              20.06.23
              </Col>
              <Col md={4}>
              Real Madrid
              </Col>
              <Col md={4}>
              1-4
              </Col>
              <Col md={2}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item action variant="success" href="/match/1" className='mt-2'>
            <Row className='text-center'>
              <Col md={2}>
              20.06.23
              </Col>
              <Col md={4}>
              Real Madrid
              </Col>
              <Col md={4}>
              4-1
              </Col>
              <Col md={2}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item action variant="success" href="/match/1" className='mt-2'>
            <Row className='text-center'>
              <Col md={2}>
              20.06.23
              </Col>
              <Col md={4}>
              Real Madrid
              </Col>
              <Col md={4}>
              3-1
              </Col>
              <Col md={2}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item action variant="success" href="/match/1" className='mt-2'>
            <Row className='text-center'>
              <Col md={2}>
              20.06.23
              </Col>
              <Col md={4}>
              Real Madrid
              </Col>
              <Col md={4}>
              2-1
              </Col>
              <Col md={2}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col sm={8}>
          
        </Col>
      </Row>


          </div>
        </Col>
        <Col sm={3} className='container ' style={{"minWidth":"20rem"}}>

          {/* This is the timeline for upcoming matches on the right side of the page*/}
        <div className="team-upcoming-matches w-100">
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
  </div>

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
              <Form.Label>Explain shortly why you want to {join===false ? "join to" : "unjoin from"} this league.</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant={join===false ? "success" : "danger"} onClick={changeJoinShow}>
          {join===false ? "Send Request" : "Leave"}
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
        <Button variant={invite===false ? "success" : "danger"} onClick={changeInviteShow}>
        {invite===false ? "Invite Team" : "Uninvite Team"}
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
  </>
  );
  }
  
  export default TeamDetails  ;