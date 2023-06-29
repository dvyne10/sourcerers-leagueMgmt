import 'bootstrap/dist/css/bootstrap.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";


const Contact = () =>{
    return (
        <>
                <div className="App" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: '#F8F9FA', paddingTop: "1rem", paddingBottom: "3rem"}}>    <h1 style={{align: "center"}}>Reach Our Team</h1></div>
                <div style={{height: '30rem',paddingTop: "2rem", paddingBottom: "1rem", textAlign: "center"}}>  
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.9065880064295!2d-79.35086585076594!3d43.795551329859535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d3d4f601a36b%3A0x5761022224071df1!2sSeneca%20College%20(Newnham%20Campus)!5e0!3m2!1sen!2sca!4v1579279623387!5m2!1sen!2sca" width="50%" height="400px" scrolling="no" marginwidth="0" marginheight="0" frameborder="0" title="Newnham Campus Google Map"></iframe>

</div>
    <div className="d-flex justify-content-center" style={{backgroundColor: '#F8F9FA', paddingTop: "1rem", paddingBottom: "3rem"}} >
      <Card style={{ width: "60rem", padding: 20, backgroundColor: '#F8F9FA' }}>
        <h2 className="mb-4 center-text">Send Us a Message</h2>
        <h8 className="mb-4 center-text"> Send us a message and we will respond within 24 hours.</h8>
<Form>
        <Row className="mb-3">    
<Form.Group as={Col} >
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} >
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Email"
            defaultValue="test@gmail.com"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        </Row>
        <Form.Group as={Col} xl="12" >
          <Form.Label>Message</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={3}
            
            placeholder="Can I join ?"
            
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} xl="12" >
          <Form.Label> </Form.Label>
          </Form.Group>
        </Form>
        <Form.Group as={Row} className="mb-3 text-center" >
        <Col >
          <Button type="submit">Submit</Button>
        </Col>
      </Form.Group>
     
</Card>
</div> 




        </>
    )
}

export default Contact;