import 'bootstrap/dist/css/bootstrap.min.css';  
import {Container , Accordion} from 'react-bootstrap'  

const Terms = () => {
    return (
        <>
         
        <div className="App" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: '#F8F9FA', paddingTop: "2rem", paddingBottom: "2rem"}}>    <h1 style={{align: "center"}}>Terms And Conditions</h1></div>
        <div className="App" style={{paddingTop: "4rem"}}> 
   <Container style={{width:'60rem'}}>  
   <Accordion defaultActiveKey="0">  
  <Accordion.Item eventKey="0">  
    <Accordion.Header>CONDITIONS OF PARTICIPATIONS</Accordion.Header>  
    <Accordion.Body>  
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat  
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id  
      est laborum.  
    </Accordion.Body>  
  </Accordion.Item>  
  <Accordion.Item eventKey="1">  
    <Accordion.Header>WEATHER FORECAST AND MATCH CANCELLATIONS</Accordion.Header>  
    <Accordion.Body>  
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat  
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id  
      est laborum.  
    </Accordion.Body>  
  </Accordion.Item>  
  <Accordion.Item eventKey="2">  
    <Accordion.Header>MOBILE APPLICATIONS</Accordion.Header>  
    <Accordion.Body>  
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat  
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id  
      est laborum.  
    </Accordion.Body>  
  </Accordion.Item>  
  <Accordion.Item eventKey="3">  
    <Accordion.Header>LIABILITY</Accordion.Header>  
    <Accordion.Body>  
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat  
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id  
      est laborum.  
    </Accordion.Body>  
  </Accordion.Item>  
  <Accordion.Item eventKey="4"> 
  <Accordion.Header>DISCLAIMER</Accordion.Header>  
    <Accordion.Body>  
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate  
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat  
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id  
      est laborum.  
    </Accordion.Body>  
  </Accordion.Item>  
</Accordion>  


</Container>  
    </div>  
        </>
    )
}

export default Terms; 