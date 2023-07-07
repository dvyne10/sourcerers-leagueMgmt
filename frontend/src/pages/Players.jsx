import { FaFilter } from "react-icons/fa";
import { Container, Row, Col, Image, Button } from "react-bootstrap";

export default function Players() {
  const playerListing = [
    {
      id: 1,
      wins: 5,
      footballTeamId: 1,
      basketballTeamId: 6,
      profilePicture:
        "https://1000logos.net/wp-content/uploads/2021/02/Tennessee-Titans-FC-Logo.png",
      nameOfFootballTeam: "Real Madrid",
      nameOfBasketballTeam: "Raptors",
      activeTeams: [{name:"Arsenal",id:82}],
      location: "Toronto",
      SportsOfInterest : "Basketball"
    },
    {
      id: 2,
      wins: 3,
      footballTeamId: 2,
      basketballTeamId: 7,
      profilePicture:
        "https://logodownload.org/wp-content/uploads/2021/10/canada-soccer-team-logo-0.png",
      nameOfFootballTeam: "Barcelona",
      nameOfBasketballTeam: "Chicago",
      activeTeams: [{name:"Real Madrid", id:55}],
      location: "Toronto",
      SportsOfInterest : "Basketball, Soccer"
    },
    {
      id: 3,
      wins: 6,
      footballTeamId: 3,
      basketballTeamId: 8,
      profilePicture:
        "https://images-platform.99static.com//1rfZxacWCr7-UWhvoY4p8MsPA4A=/363x355:1437x1429/fit-in/590x590/99designs-contests-attachments/108/108786/attachment_108786598",
      nameOfFootballTeam: "Arsenal",
      nameOfBasketballTeam: "Lakers",
      activeTeams: [{name:"Real Madrid",id:75}],
      location: "Toronto",
      SportsOfInterest : "Basketball"
    },
    {
      id: 4,
      wins: 15,
      basketballTeamId: 4,
      profilePicture:
        "https://content.sportslogos.net/logos/31/661/full/drake_bulldogs_logo_secondary_20118658.png",
      nameOfFootballTeam: "Arsenal",
      activeTeams: [{name:"Barcelona", id:2}],
      location: "Toronto",
      SportsOfInterest : "Basketball"
    },
    {
      id: 5,
      wins: 111,
      footballTeamId: 9,
      basketballTeamId : 11,
      profilePicture:
        "https://ftw.usatoday.com/wp-content/uploads/sites/90/2020/03/1920px-los_angeles_lakers_logo.svg_.png?w=1000",
      nameOfFootballTeam: "Arsenal",
      activeTeams: [{name:"Real Madrid ",id:15},{name:"Lakers",id:88}],
      location: "Vancouver",
      SportsOfInterest : "Football, Basketball"
    },
  ];

  return (
    <>
      <div
        className="container justify-content-center text-center rounded"
        style={{ width: "100%" }}
      >
        <Container>
          <Row className="align-items-end">
            <Col className="text-start">
              <Button size="sm" variant="outline-secondary">
                <FaFilter></FaFilter>Filter
              </Button>
            </Col>
            <Col>
              <h1 className="center-header">PLAYERS</h1>
            </Col>
            <Col></Col>
          </Row>
        </Container>

        <Container className="rounded align-items-end mt-4">
          <Row className="text-center align-items-end border-bottom">
            <Col lg="1" className="text-center">
              {" "}
              <h6>Profile</h6>
            </Col>
            <Col lg="2" className="text-center">
              {" "}
              <h6>Name</h6>
            </Col>
            <Col lg="3" className="text-center">
              <h6>Active Teams</h6>
            </Col>
            <Col lg="3" className="text-center">
              <h6>Location</h6>
            </Col>
            <Col lg="2">
              <h6>Wins</h6>
            </Col>
            <Col lg="1" className="text-center">
             
              <h6>Sports  </h6>
            </Col>
          </Row>
        </Container>

        {playerListing.map((player) => {
          return (
            <div className="team-individual border-bottom p-2" key={player.id}>
              <a href={"/player/" + player.id} className="general-link-no-dec">
                <div className="mt-2 text-center shadow-1-strong rounded text-white">
                  <Row className="text-center align-items-center mx-auto rounded player-list-container">
                    <Col
                      lg="1"
                      className="text-center rounded-start p-2"
                      style={{ backgroundColor: "#1c1b22" }}
                    >
                      <a
                        href={"/player/" + `${player.id}`}
                        className="link-general-style"
                      >
                        {" "}
                        <Image
                          src={player.profilePicture}
                          className="border border-white object-fit-cover ml-auto zoom-in-style"
                          roundedCircle
                          fluid
                          style={{ width: "4em", height: "4em" }}
                        />
                      </a>
                    </Col>
                    <Col
                      lg="2"
                      className="text-center justify-content-center align-items-center mx-auto p-2"
                    >
                      {" "}
                      Baris Berber
                    </Col>
                    <Col lg="3" className="text-center">
                      <h1></h1>
                      <h6>{player.activeTeams.map((teams) => {
          return (<a className="general-link-no-dec text-white" href={`/team/`+teams.id} key={teams.id}>{teams.name}</a>)})}</h6>
                    </Col>
                    <Col lg="3" className="text-center">
                      <h1></h1>
                      <h6>{player.location}</h6>
                    </Col>
                    <Col lg="2">
                      <h6>{player.wins}</h6>
                    </Col>
                    <Col lg="1">
                      <h6>{player.SportsOfInterest}</h6>
                    </Col>
                  </Row>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
