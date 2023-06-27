
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaFutbol, FaSearch } from 'react-icons/fa';
import './navigationcomponent.css';

// import NavDropdown from "react-bootstrap/NavDropdown";

const NavigationComponent = () => {
  return (
    <Navbar className="shadow-sm deneme"  expand="md" bg="dark" data-bs-theme="dark">
      
      <Container fluid>

        <Navbar.Brand href="/" >
        <FaFutbol className="m-auto"/>
          PlayPal
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" className="navbar-toggle" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="justify-content-center flex-grow-1 pe-1 middle-bar"
            navbarScroll
          >
          {/* <Nav.Link href="/leagues" style={{paddingRight: "140px"}}>Leagues</Nav.Link> */}
          <Nav.Item className="d-flex justify-content-center">
          <Nav.Link href="/leagues" className="navbar-underline-animation" >Leagues</Nav.Link>
          
            <Nav.Link href="/teams" className="navbar-underline-animation">Teams</Nav.Link>
            <Nav.Link href="/players" className="navbar-underline-animation">Players</Nav.Link>
            </Nav.Item>
            
</Nav>
<Nav>
         <Nav.Item className="d-flex justify-content-center">
         <Nav.Link href="/search" className="nav-links">
<span className="trialbtn"><FaSearch className="m-auto"/></span></Nav.Link>

<Nav.Link href="/signin" className="nav-links">
<span className="trialbtn"> Sign in</span></Nav.Link>
</Nav.Item>
</Nav>


        </Navbar.Collapse>
        
      </Container>
    </Navbar>
  );
};
export default NavigationComponent;
