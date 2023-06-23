import Card from 'react-bootstrap/Card'; 
import Button from 'react-bootstrap/Button'; 
import '../App.css';
const Home = () => {
  return (
    <>
    <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "50px"}}>
      <h6>Top 4 ongoing</h6>
      <h1>LEAGUES</h1>
      <div className="fire-animation "style={{ border: "1px solid black", width: "1200px", height: "500px", display: "flex", flexWrap: "wrap"}}>
      <Card style={{ width: '18rem', objectFit: "contain", maxHeight: "100%"}}>
      <Card.Img variant="top" src="/soccer_pic1.jpg" style={{width: "100%", height: "70%"}}/>
        <Card.Body>
          <Card.Title>Toronto Soccer Club</Card.Title>
          <Card.Text>
            We have super passion
          </Card.Text>
          <Button variant="primary">Check details</Button>
        </Card.Body>
       </Card>
       <Card style={{ width: '18rem', objectFit: "contain", maxHeight: "100%"}}>
      <Card.Img variant="top" src="/basketball_pic1.jpg" style={{width: "100%", height: "70%"}}/>
        <Card.Body>
          <Card.Title>Toronto BasketBall Club</Card.Title>
          <Card.Text>
            We have super passion
          </Card.Text>
          <Button variant="primary">Check details</Button>
        </Card.Body>
       </Card>
       <Card style={{ width: '18rem', objectFit: "contain", maxHeight: "100%"}}>
      <Card.Img variant="top" src="/soccer_pic2.jpg" style={{width: "100%", height: "70%"}}/>
        <Card.Body>
          <Card.Title>Avengers</Card.Title>
          <Card.Text>
            We love to play soccer
          </Card.Text>
          <Button variant="primary">Check details</Button>
        </Card.Body>
       </Card>
       <Card style={{ width: '18rem', objectFit: "contain", maxHeight: "100%"}}>
      <Card.Img variant="top" src="/basketball_pic2.jpg" style={{width: "100%", height: "70%"}}/>
        <Card.Body>
          <Card.Title>Jordan spirit</Card.Title>
          <Card.Text>
            We love to play basketball
          </Card.Text>
          <Button variant="primary">Check details</Button>
        </Card.Body>
       </Card>
    
       

      </div>
      
      <br/><br/>
      <h1>ANNOUNCEMENTS</h1>
      <div style={{border: "1px solid black", width: "1200px", height: "500px"}}></div>
    </div>
    </>
  );
}

  
export default Home;