
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
<<<<<<< HEAD
import {FaSearch } from 'react-icons/fa';
=======
import { FaFutbol, FaSearch, FaUserCircle } from 'react-icons/fa';
>>>>>>> 736edeec189f769b0de02713b42789c76bb660a2
import './navigationcomponent.css';
import Dropdown from 'react-bootstrap/Dropdown';
import useAuth from "../hooks/auth";



const NavigationComponent = () => {

  const {isSignedIn, signOut} = useAuth()

  return (
    <Navbar className="shadow-sm deneme"  expand="md" bg="dark" data-bs-theme="dark">
      
      <Container fluid>

<<<<<<< HEAD
        <Navbar.Brand href="/" className="logo-container">
          {/* <Image src="https://ibb.co/3yZNZfS" rounded className="center-block img-fluid object-fit-cover App-logo" style={{height:"10vh", "margin-top":"10px", width:"auto"}}/> */}
        
          <img src="https://i.ibb.co/hDdSXY7/Playpal-lg.png" alt="Playpal-lg" border="0" style={{height:"9vh", width:"auto"}} className="original-image"/>
          <img src="https://i.ibb.co/6RCPCvD/Playpal-dk.png" alt="Playpal-dk" border="0" style={{height:"9vh", width:"auto"}} className="dark-image"/>
=======
        <Navbar.Brand href="/" >
          <FaFutbol className="m-auto"/>
          PlayPal
>>>>>>> 736edeec189f769b0de02713b42789c76bb660a2
        </Navbar.Brand>


        <Navbar.Toggle aria-controls="navbarScroll" className="navbar-toggle" />
        <Navbar.Collapse id="navbarScroll">

          <Nav
            className="justify-content-center flex-grow-1 pe-1 middle-bar"
            navbarScroll
          >
          
            <Nav.Item className="d-flex justify-content-center">
              <Nav.Link href="/leagues" className="navbar-underline-animation" >Leagues</Nav.Link>
              <Nav.Link href="/teams" className="navbar-underline-animation">Teams</Nav.Link>
              <Nav.Link href="/players" className="navbar-underline-animation">Players</Nav.Link>
            </Nav.Item>
            
          </Nav>

          <Nav>
            <Nav.Item className="d-flex justify-content-center">
              <Nav.Link href="/search" className="nav-links">
                <span className="trialbtn"><FaSearch className="m-auto"/></span>
              </Nav.Link>

              { isSignedIn === false && (
                <Nav.Link href="/signin" className="nav-links">
                  <span className="trialbtn"> Sign in</span>
                </Nav.Link>
              )}
              
              { isSignedIn === true && (
                <Dropdown title="Profile">
                  <Dropdown.Toggle className="trialbtn" variant="success"><FaUserCircle className="m-auto"/></Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu dropdown-menu-end">
                      <Dropdown.Item href="/" className="nav-links " >My Profile</Dropdown.Item>
                      <Dropdown.Item href="/updateaccount" className="nav-links" >Update Profile</Dropdown.Item>
                      <Dropdown.Item href="/changepassword" className="nav-links" >Change Password</Dropdown.Item>
                      <Dropdown.Item href="/" className="nav-links" onClick={() => signOut()}>Signout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
              )}
              
            </Nav.Item>
          </Nav>

        </Navbar.Collapse>
        
      </Container>
    </Navbar>
  );
};
export default NavigationComponent;
