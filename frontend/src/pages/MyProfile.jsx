import { Container, Row, Col, Card, Button, Image, Stack } from "react-bootstrap";
import FlippableCard from '../components/card/FlippableCard'; 
const myProfile = () => {


    return (
        <>
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
                  
                  <Button variant="btn btn-outline-success">Invite</Button>{" "}
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
              </ul>
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

              <h4 className="center-header">Active Teams</h4>
              <Row className="justify-content-center">


                
              <Col md={2  }> <a className="general-link-no-dec" href={'/team/1'} > 
                <Image src="https://content.sportslogos.net/logos/31/661/full/drake_bulldogs_logo_secondary_20118658.png"  
                className='border border-info justify-self-center shadow object-fit-cover zoom-in-style' 
                roundedCircle style={{ width: "5em", height: "5em"}}/><h5 className="mt-2">Real Madrid</h5></a></Col>    
                
                <Col md={2  } className='justify-self-center'> <a className="general-link-no-dec" href={'/team/1'} > 
                <Image src="https://content.sportslogos.net/logos/31/661/full/drake_bulldogs_logo_secondary_20118658.png"  
                className='border border-info justify-self-center shadow object-fit-cover zoom-in-style' 
                roundedCircle fluid style={{ width: "5em", height: "5em"}}/><h5 className="mt-2">Real Madrid</h5></a></Col>   
                
              </Row>
             
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </Container>

        </>
    )
}

export default myProfile; 