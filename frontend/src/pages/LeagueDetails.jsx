import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Container,Row,Col, Button, Stack, Card, Image} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './teamdetails.css'

const LeagueDetails = () => {

  const navigate = useNavigate(); 
  const navigateUpdateLeague = () => { navigate('/updateleague/648e9013466c1c995745907c') }   // temp id only

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "50px"}}>
      
      <h1>LEAGUE DETAILS PAGE</h1>
      <Button onClick={navigateUpdateLeague} variant="primary">Update League</Button>
      
      
      




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
        <Col className="mt-2" ><Button className='mt-2 mb-2 btn-success rounded-pill' onClick={handleShow}>Join</Button></Col>

      </Row>
    </Container>
    </div>

{/* Here is the team players and listing */}
<Row className=''>
        <Col className='border'>
        <div className='team-past-matches'>
          <h2 className='center-header gap-divider'>Teams</h2>
         <Row className='mb-5'>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          
         </Row>

         <Row className='mb-5'>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
          </Col>
          <Col className='mx-5'>
          <a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a>
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
          <Card className='mx-auto text-center border border-danger' style={{ width: '20rem'}}>

    
        
<Row className='pt-3'>
<Col md={5}><a href='/team/1'><Image src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/1200px-Manchester_United_FC_crest.svg.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a></Col>
<Col md={2} className='align-self-center'>vs</Col>
<Col md={5} ><a href='/team/1'><Image src="https://clipart.info/images/ccovers/1526524314real-madrid-icon-clipart-logo-png.png"  className='object-fit-cover ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></a></Col>
</Row>

<Row>
<Col md={12}><hr /></Col>
</Row>
<Row >
<Col md={5} className='text-start ms-2 mb-3'>11 July</Col>
<Col md={1} className='text-start ms-2 mb-3'>|</Col>
<Col md={5} className='text-end me-2'>10:00 PM</Col>

</Row>
  </Card>

          </div>
        </Col>
        <Col sm={3} className='container ' style={{"minWidth":"20rem"}}>

          {/* This is the timeline for upcoming matches on the right side of the page*/}
        <div className="team-upcoming-matches w-100">
          <h4 className='center-header'>Upcoming Matches</h4><hr />
    <ul>
      <li className='active-game-hover'>
      <a href='/matchdetails' className='general-link-no-dec'>
        <span className='active-game'>21st June 2023</span>
        <div className="content">
        
          <h3>Arsenal</h3>
        </div>
        </a>
      </li>
      
      <li className='past-game-hover'>
      <a href='/matchdetails' className='general-link-no-dec'>
        <span className='past-game'>15th April 2023</span>
        <div className="content">
          <h3>Barcelona</h3>
        </div>
        </a>
      </li>
      
      <li className='past-game-hover'>
      <a href='/matchdetails' className='general-link-no-dec'>
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
              <Form.Label>Explain shortly why you want to join to this league.</Form.Label>
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
  );
}

export default LeagueDetails;