import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Accordion } from "react-bootstrap";

const Terms = () => {
  return (
    <>
      <div
        // className="App"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F9FA",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
       
        <h1 style={{ align: "center" }}>Terms And Conditions</h1>
      </div>
      <div className="App" style={{ paddingTop: "4rem" }}>
        <Container >
          <Accordion >
            <Accordion.Item eventKey="0">
              <Accordion.Header style={{color:'#D1E8E2',backgroundColor: '#D1E8E2'}}>CONDITIONS OF PARTICIPATIONS</Accordion.Header>
              <Accordion.Body>
              Your league, team, its members and participants agree to abide by the team and league rules on our website. PlayPal reserves the right and absolute discretion to change these rules without notice.
Team admins and league admins are responsible for sharing all league or team correspondence with its members. Any communication necessary are not handled by PlayPal website.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
            <Accordion.Header style={{color:'#D1E8E2',backgroundColor: '#D1E8E2'}}>WEATHER FORECAST AND MATCH CANCELLATION - SOCCER ONLY</Accordion.Header>
              <Accordion.Body>
              PlayPal soccer leagues must follow FIFA standard protocol for all weather related issues surrounding matches.
All weather conditions are acceptable for matches with the following exceptions:
<ul>
<li>Thunder and lightning</li>
<li>Field flooding</li>
<li>Earthquake</li>
<li>Extreme temperatures (to be determined by the league)</li>
</ul>
In the event of any of these weather conditions, the league must cancel matches and seek to reschedule matches later.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
            <Accordion.Header style={{color:'#D1E8E2',backgroundColor: '#D1E8E2'}}>LIABILITY</Accordion.Header>
              <Accordion.Body>
              All players accept that sports supported by our website are contact sports and that injuries can and may happen. In under no circumstance, will Playpal be held liable for any injury endured during the course of participation by any member.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </div>
    </>
  );
};

export default Terms;
