import 'bootstrap/dist/css/bootstrap.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const Contact = () =>{
    return (
        <>
        <div className="App" style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: '#F8F9FA', paddingTop: "1rem", paddingBottom: "3rem"}}>    <h1 style={{align: "center"}}>Reach Our Team</h1></div>

    <div style={{height: '20rem'}}></div>
    <div style={{backgroundColor: '#F8F9FA', paddingTop: "1rem", paddingBottom: "3rem"}}>
<Form.Group as={Col} md="4" >
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" >
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Email"
            defaultValue="test@gmail.com"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" >
          <Form.Label>Message</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            defaultValue="Otto"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        </div>



        </>
    )
}

export default Contact;