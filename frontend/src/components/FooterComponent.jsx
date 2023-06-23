
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const FooterComponent = () => {
  return (
    <Navbar bg="light" expand="lg" style={{ position: 'absolute', bottom: 0, width: '100%', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>

      <Nav className="mx-auto">
        <Nav.Link href="/about">About&nbsp;&nbsp;&nbsp;&nbsp;|</Nav.Link>
        <Nav.Link href="/privacy">Privacy&nbsp;&nbsp;&nbsp;&nbsp;|</Nav.Link>
        <Nav.Link href="/terms">Terms&nbsp;&nbsp;&nbsp;&nbsp;|</Nav.Link>
        <Nav.Link href="/contact">Contact Us</Nav.Link>
      </Nav>
      <div style={{ color: "lightgrey", fontSize: "14px", marginTop: "5px" }}>
        Address | © 2023 Company. All rights reserved
      </div>
    </Navbar>
  );
};

export default FooterComponent;
