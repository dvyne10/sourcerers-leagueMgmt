import { Container, Row, Col, Card,Stack } from "react-bootstrap";
import FlippableCard from '../components/card/FlippableCard'; 
import ListGroup from 'react-bootstrap/ListGroup';
import { BsGearFill } from "react-icons/bs";
import useAuth, {checkIfSignedIn} from "../hooks/auth";
import { useNavigate } from 'react-router-dom';


const Player = () => {

  const navigate = useNavigate(); 
  const {isSignedIn} = useAuth();

  const checkIfUserIsSignedIn = () => {
    let user = checkIfSignedIn()
    if (!user.isSignedIn) {
      navigate("/signin");
    }
  }

    return (
      
        <>
        { !isSignedIn && (
            <div>
                {checkIfUserIsSignedIn()}
            </div>
        )}
        <Container className="mt-5" >
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
                  <h4>Harry Potter</h4>
                  <p className="text-secondary mb-1">@hpotter</p>
                  <p className="text-muted font-size-sm">
                    United Kingdom, London
                  </p>
                  
                  <a href="/updateaccount" className="btn btn-outline-success"><BsGearFill className="m-auto" /></a>{" "}{" "}
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card className="mt-3">
            <Card.Body>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                   
                    Sports of Interest
                  </h6>
                  <span className="text-secondary">
                    Basketball
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    
                    Phone Number
                  </h6>
                  <span className="text-secondary">444444444</span>
                </li>
                
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    
                    Soccer Team
                  </h6>
                  <a href="/team/1">
                  <span className="text-secondary">Chelsea</span></a>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    
                    Jersey Number
                  </h6>
                  <span className="text-secondary">47</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    
                    Status
                  </h6>
                  <span className="text-secondary">Active</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                  <h6 className="mb-0">
                    
                    Location
                  </h6>
                  <span className="text-secondary">Toronto</span>
                </li>
              </ul>
            </Card.Body>
          </Card>
          <Card className="mt-3">
            <Card.Body>
              <h2 className="text-center">Past Matches</h2>
                   {/* Past Matches Here */}
                   <ListGroup>
            <ListGroup.Item action variant="danger" href="/matchdetailsoccer/1"  className='mt-2'>
              <Row className='text-center'>
              <Col>
              20.06.23
              </Col>
              <Col>
              Real Madrid
              </Col>
              <Col md>
              1-4
              </Col>
              <Col>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item action variant="success" href="/matchdetailsoccer/1" className='mt-2'>      
            <Row className='text-center'>
              <Col>
              20.06.23
              </Col>
              <Col>
              Real Madrid
              </Col>
              <Col md>
              4-1
              </Col>
              <Col>
              Toronto
              </Col>
              </Row>          
          </ListGroup.Item>
          </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            
              <h4 className="center-header">Statistics</h4>
              <div className="mx-auto">
              <Stack direction="horizontal" gap={2}>
      <div className="p-2"><h1 style={{fontSize:"10rem", fontFamily:"Saira Extra Condensed", color:"indigo"}}>72</h1></div>
      <div className="p-2"><h5 className="border-top border-bottom">Goals</h5></div>
      <div className="p-2 ms-5"><h1 style={{fontSize:"10rem", fontFamily:"Saira Extra Condensed", color:"indigo"}}>11</h1></div>
      <div className="p-2"><h5 className="border-top border-bottom">Wins</h5></div>
      <div className="p-2 ms-5"><h1 style={{fontSize:"10rem", fontFamily:"Saira Extra Condensed", color:"indigo"}}>5</h1></div>
      <div className="p-2"><h5 className="border-top border-bottom">Championships</h5></div>
      
    </Stack>
    <Stack direction="horizontal" gap={2}>
      <div className="p-2"><h1 style={{fontSize:"10rem", fontFamily:"Saira Extra Condensed", color:"indigo"}}>1.7</h1></div>
      <div className="p-2"><h5 className="border-top border-bottom">Averge goals per game</h5></div>
      <div className="p-2 ms-5"><h1 style={{fontSize:"10rem", fontFamily:"Saira Extra Condensed", color:"indigo"}}>182</h1></div>
      <div className="p-2"><h5 className="border-top border-bottom">Games played</h5></div>
      
    </Stack>
    </div>
        </Card>

          <Card className="mt-5">
            <Card.Body className="justify-content-center align-items-center text-center">
            <h4 className="center-header">Active Leagues</h4>
              <Row ><Col>
              <div className="col d-flex flex-column flex-md-row justify-content-around align-items-center mx-5 mb-5">
            <FlippableCard imageUrl="/basketball_pic2.jpg" cardText="Jordan Warriors"/>
            <FlippableCard imageUrl="/basketball_pic2.jpg" cardText="Jordan Warriors"/>
          </div>
    </Col>
          <hr />      
</Row>

              <h4 className="center-header">Past Leagues</h4>
              <Row className="justify-content-center">
              <Row>
        <Col sm={12} >
          <ListGroup>
            <ListGroup.Item action href="/leaguedetails/1"  className='mt-2'>
              <Row className='text-center'>
              <Col md={2}>
                Do or Do not
              </Col>
              <Col md={2}>
              20.06.23
              </Col>
              <Col md={3}>
              2nd Place
              </Col>
              <Col md={3}>
              6 Wins
              </Col>
              <Col md={2}>
              Toronto
              </Col>
              </Row>
            </ListGroup.Item>
            </ListGroup>
            </Col>
            </Row>
            

                
            
                
              </Row>
             
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </Container>
        </>
    )
}

export default Player; 