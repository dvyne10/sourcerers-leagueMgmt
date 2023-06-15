import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaFutbol } from 'react-icons/fa';

// import NavDropdown from "react-bootstrap/NavDropdown";

const NavigationComponent = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/#" style={{ paddingRight: "250px" }}>
        <FaFutbol style={{ marginRight: '5px' }} />
          PlayPal
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
          <Nav.Link href="/leagues" style={{paddingRight: "140px"}}>Leagues</Nav.Link>
            <Nav.Link href="/teams" style={{paddingRight: "140px"}}>Teams</Nav.Link>
            <Nav.Link href="/players" style={{paddingRight: "140px"}}>Players</Nav.Link>
            {/* <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link> */}
          </Nav>
          <Form className="d-flex me-2">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          
          <Button href="/signin "variant="light">Sign in</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationComponent;
