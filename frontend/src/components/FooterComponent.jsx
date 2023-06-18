
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

const FooterComponent = () => {
  return (
    <Navbar bg="light" expand="lg" style={{ height: "100px", marginTop: "50px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
    <div style={{ display: 'flex', gap: '40px' }}>
      <a href="https://www.facebook.com"><FaFacebook size={24} /></a>
      <a href="https://www.instagram.com"><FaInstagram size={24} /></a>
      <a href="https://www.twitter.com"><FaTwitter size={24} /></a>
      <a href="https://www.github.com"><FaGithub size={24} /></a>
    </div>
      <Nav className="mx-auto">
        <Nav.Link href="/about">About&nbsp;&nbsp;&nbsp;&nbsp;|</Nav.Link>
        <Nav.Link href="#">Privacy&nbsp;&nbsp;&nbsp;&nbsp;|</Nav.Link>
        <Nav.Link href="#">Terms&nbsp;&nbsp;&nbsp;&nbsp;|</Nav.Link>
        <Nav.Link href="/contact">Contact Us</Nav.Link>
      </Nav>
      <div style={{ color: "lightgrey", fontSize: "14px", marginTop: "5px" }}>
        Address | © 2023 Company. All rights reserved
      </div>
    </Navbar>
  );
};

export default FooterComponent;
