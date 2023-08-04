import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {Container,Row,Col, Button, Card, Image, ListGroup} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './teamdetails.css'
import { BsGearFill } from "react-icons/bs";
import useAuth from "../hooks/auth";

const LeagueDetails = () => {

  const navigate = useNavigate(); 
  const {isSignedIn} = useAuth();
  const routeParams = useParams();
  const navigateUpdateLeague = () => { navigate(`/updateleague/${routeParams.leagueid}`) }   // temp id only

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [join, setJoin] = useState(false);
function changeJoinShow(){
    
    setJoin(!join);
    setShow(!show);
}
 
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const response = await fetch('http://localhost:8000/leagues');
      const data = await response.json();
      console.log(data); // Log the data received from the backend
      setData(data.details);
    } catch (error) {
      console.error('Error fetching top leagues data:', error);
    }
  };
  return (
    <>
    {isSignedIn && (

     <div className='d-flex w-100 position-absolute w-75 justify-content-end p-5' style={{zIndex:"20"}}><Button onClick={navigateUpdateLeague} variant='transparent' className="btn btn-outline-success"><BsGearFill className="m-auto" /></Button></div>
    )}  
        <h1>{data.map(league=>(
      league.status
    ))}</h1>  
    <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
      
  
      
      
      




      <div className='bg-light container justify-content-center text-center'>
        {/* Here is the team header, with background and info */}
        
        <div className="bg-image mt-2 d-flex p-5 text-center shadow-1-strong rounded mb-3 text-white"
  style={{"backgroundImage": "url('https://www.pixel4k.com/wp-content/uploads/2018/10/nike-black-play-football_1538786713.jpg.webp')", backgroundPosition:"center", backgroundSize:"cover"}} >
        <Container style={{background:'https://i.p1inimg.com/600x315/0f/4c/91/0f4c91bfaa06b9e5907fca20e3e37d0d.jpg'}}>
      <Row >
        <Col><h1>League Name</h1>
        <p className='mt-5'>League description here.</p></Col>
        
      </Row>
      <Row>
      {isSignedIn && (
        <Col className="mt-2" ><Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleShow}>{join===false ? "Join" : "Unjoin"}</Button></Col>
      )}
      </Row>
    </Container>
    </div>

{/* Here is the team players and listing */}
<Row className=''>
        <Col className='border'>
        <div className='team-past-matches'>
          <h2 className='center-header gap-divider'>Teams</h2>
         <Row className='mb-5 mx-5'>
          <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
         
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
         <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
            <Col className='league-details-team-listing text-break ms-5' md={1} >
            
            <a href='/team/1' className='general-link-no-dec'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em", minHeight:"3em", minWidth:"3em"}}/>
            Real Madrid</a>
            
            </Col>
         
         </Row>

          </div>
        </Col>
        </Row>


    <div className='mt-20 container justify-content-center text-center gap-divider'>
{/* This is for the past matches list for the team */}
      <Row className=''>
        <Col sm={9} className='border'>
        <div className='team-past-matches'>
          <h2 className='center-header gap-divider'>Team Matchups</h2>
          <Row className='text-center mx-1'>
              <Col md={2}>
              <h6 className='border-bottom border-secondary'>Date</h6>
              </Col>
              <Col md={4}>
              <h6 className='border-bottom border-secondary'>Teams</h6>
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
            <ListGroup.Item action variant="secondary" href="/match/1"  className='mt-2'>
              <Row className='text-center'>
              <Col md={2}>
              20.06.23
              </Col>
              <Col md={4}>
              <Image
                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
                          className="shadow object-fit-cover border"
                          rounded
                          style={{  width: "2em", height: "2em" }}
                        />
                        -
                        <Image
                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
                          className="shadow object-fit-cover border"
                          rounded
                          style={{  width: "2em", height: "2em" }}
                        />
                             
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
              20.09.23
              </Col>
              <Col md={4}>
              <Image
                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
                          className="shadow object-fit-cover border"
                          rounded
                          style={{  width: "2em", height: "2em" }}
                        />
                        -
                        <Image
                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
                          className="shadow object-fit-cover border"
                          rounded
                          style={{  width: "2em", height: "2em" }}
                        />
              </Col>
              <Col md={4}>
              TBD
              </Col>
              <Col md={2}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item action variant="success" href="/match/1" className='mt-2'>
            <Row className='text-center'>
              <Col md={2}>
              20.09.23
              </Col>
              <Col md={4}>
              <Image
                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
                          className="shadow object-fit-cover border"
                          rounded
                          style={{  width: "2em", height: "2em" }}
                        />
                        -
                        <Image
                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
                          className="shadow object-fit-cover border"
                          rounded
                          style={{  width: "2em", height: "2em" }}
                        />
              </Col>
              <Col md={4}>
              TBD
              </Col>
              <Col md={2}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item action variant="success" href="/match/1" className='mt-2'>
            <Row className='text-center'>
              <Col md={2}>
              20.09.23
              </Col>
              <Col md={4}>
              <Image
                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
                          className="shadow object-fit-cover border"
                          rounded
                          style={{  width: "2em", height: "2em" }}
                        />
                        -
                        <Image
                          src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
                          className="shadow object-fit-cover border"
                          rounded
                          style={{  width: "2em", height: "2em" }}
                        />
              </Col>
              <Col md={4}>
              TBD
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
          <h4 className='center-header'>Recent Matches</h4><hr />
    <ul>
      <li className='active-game-hover'>
      <a href='/matchdetailsoccer/1' className='general-link-no-dec'>
        <span className='active-game'>21st June 2023</span>
        <div className="content">
        
          <h3>Arsenal</h3>
        </div>
        </a>
      </li>
      
      <li className='past-game-hover'>
      <a href='/matchdetailsoccer/2' className='general-link-no-dec'>
        <span className='past-game'>15th April 2023</span>
        <div className="content">
          <h3>Barcelona</h3>
        </div>
        </a>
      </li>
      
      <li className='past-game-hover'>
      <a href='/matchdetailsoccer/3' className='general-link-no-dec'>
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
              <Form.Label>Explain shortly why you want to join to this team.</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleClose}>
            Send Request
          </Button>
        </Modal.Footer>
      </Modal>
    </div>


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
    </div>
    </>
  );
}

export default LeagueDetails;