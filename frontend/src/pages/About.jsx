import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const About = () => {

  return (
    <>
  <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "7rem", paddingBottom: "50px"}}>
    <h1 style={{align: "center"}}>ABOUT US</h1>
    </div>  
    <div className="d-flex justify-content-center" 
    style={{ alignItems: "center", backgroundColor: '#F8F9FA',paddingTop: "5rem", paddingLeft: "5rem", paddingRight: "5rem"}}>
 <Card style={{ width: '20rem'}}>
        <Card.Img variant="top" src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </Card.Text>
          <Button variant="primary">URL</Button>
        </Card.Body>
      </Card>
      <Card style={{ width: '20rem' }}>
        <Card.Img variant="top" src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </Card.Text>
          <Button variant="primary">URL</Button>
        </Card.Body>
      </Card>
      <Card style={{ width: '20rem' }}>
        <Card.Img variant="top" src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </Card.Text>
          <Button variant="primary">URL</Button>
        </Card.Body>
      </Card>
      <Card style={{ width: '20rem' }}>
        <Card.Img variant="top" src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </Card.Text>
          <Button variant="primary">URL</Button>
        </Card.Body>
      </Card>
      <Card style={{ width: '20rem' }}>
        <Card.Img variant="top" src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </Card.Text>
          <Button variant="primary">URL</Button>
        </Card.Body>
      </Card>
      </div>
      </>
  )
}

export default About; 