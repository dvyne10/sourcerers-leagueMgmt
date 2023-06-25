
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaFutbol, FaSearch, FaUserCircle } from 'react-icons/fa';
import './navigationcomponent.css';
import Dropdown from 'react-bootstrap/Dropdown';

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

<Dropdown title="Profile">
    <Dropdown.Toggle className="trialbtn" variant="success"><FaUserCircle className="m-auto"/></Dropdown.Toggle>
    <Dropdown.Menu className="dropdown-menu dropdown-menu-end">
      <Dropdown.Item href="/" className="nav-links " >My Profile</Dropdown.Item>
      <Dropdown.Item href="/updateaccount" className="nav-links" >Update Profile</Dropdown.Item>
      <Dropdown.Item href="/changepassword" className="nav-links" >Change Password</Dropdown.Item>
      <Dropdown.Item href="/" className="nav-links" >Signout</Dropdown.Item>
    </Dropdown.Menu>
</Dropdown>

</Nav.Item>
</Nav>


        </Navbar.Collapse>
        
      </Container>
    </Navbar>
  );
};
export default NavigationComponent;
