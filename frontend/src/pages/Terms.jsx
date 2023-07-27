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
              Your team, its members and participants agree to abide by the league rules as published on our website and sent to you at the start of each season. The PlayPal reserves the right and absolute discretion to change these rules from time to time without notice.
The league communicates by e-mail and by newsletter. Team admins are responsible for sharing all league correspondence with its members and participants. The league will not accept any excuse for ignoring communication messages. In the event of communication failure, messages must be communicated to the league and have a working email address for all correspondence.
Each participant, players, admin of your team agrees to electronically sign a league release form before participating in a game, practice or event organized by the PlayPal.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
            <Accordion.Header style={{color:'#D1E8E2',backgroundColor: '#D1E8E2'}}>
            LEAGUE UNIFORMS AND PATCHES
              </Accordion.Header>
              <Accordion.Body>
              Each team is required to wear uniforms, which are the same tops, and the same shorts and socks.
All uniforms must have a unique number on the back, including the goalkeeper.
All uniforms, without exception, must have the league patch on the uniform.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
            <Accordion.Header style={{color:'#D1E8E2',backgroundColor: '#D1E8E2'}}>WEATHER FORECAST AND MATCH CANCELLATION - SOCCER ONLY</Accordion.Header>
              <Accordion.Body>
              The PlayPal soccer league follows FIFA standard protocol for all weather related issues surrounding matches.
All weather conditions are acceptable for matches with the following exceptions
<ul>
<li>Thunder and lightning</li>
<li>Field flooding</li>
<li>Earthquake</li>
<li> Extreme temperatures (to be determined by the league)</li>
</ul>
In the event of any of these weather conditions, the league will cancel matches and seek to reschedule matches later.
In case of cancellation of the match, the league reserves the right to issue either a compensation in the form of a credit or a match postponement.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
            <Accordion.Header style={{color:'#D1E8E2',backgroundColor: '#D1E8E2'}}>PLAYPAL MOBILE APPLICATION</Accordion.Header>
              <Accordion.Body>
              The PlayPal league will use a mobile application which will act as a “track & trace” to insure that all players remain safe and in safety in case a confirmed positive case of virus infection is detected at the league.
All participants, without exception, must download the application onto their mobile phone in order to qualify to play in the league.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
            <Accordion.Header style={{color:'#D1E8E2',backgroundColor: '#D1E8E2'}}>LIABILITY</Accordion.Header>
              <Accordion.Body>
              All players accept that our sports is a contact sport and that injuries can and may happen from time to time. In under no circumstance, will the league be held liable for any and all injuries endured during the course of participation by any members of teams, whether it is a player or a coach or a volunteer.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Container>
      </div>
    </>
  );
};

export default Terms;
