import { FaFilter, FaPlus } from "react-icons/fa";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth";

export default function Teams() {
  const {isSignedIn} = useAuth();
  const navigate = useNavigate();
  const navigateCreateTeam = () => {
    navigate("/createTeam");
  };
  const teamListing = [
    {
      id: 1,
      logoimgurl:
        "https://content.sportslogos.net/logos/31/661/full/drake_bulldogs_logo_secondary_20118658.png",
      bgimgurl:
        "https://png.pngtree.com/background/20220716/original/pngtree-colorful-sports-theme-background-material-picture-image_1636814.jpg",
      nameOfTeam: "Real Madrid",
      numberOfMembers: "24",
      sportsType: "Football",
    },
    {
      id: 2,
      logoimgurl:
        "https://static.vecteezy.com/system/resources/previews/004/599/108/original/gamer-mascot-logo-design-gamer-illustration-for-sport-team-modern-illustrator-concept-style-for-badge-free-vector.jpg",
      bgimgurl:
        "https://media.istockphoto.com/id/540383298/tr/vekt%C3%B6r/football-championship-background.jpg?s=612x612&w=0&k=20&c=LCGaxDgwTjwW_zjdCPso6ZsNEB-GgjDMNDW_j8M11oU=",
      nameOfTeam: "Barcelona",
      numberOfMembers: "23",
      sportsType: "Basketball",
    },
    {
      id: 3,
      logoimgurl:
        "https://logos-world.net/wp-content/uploads/2021/10/Omaha-Mammoths-Logo.png",
      bgimgurl:
        "https://t4.ftcdn.net/jpg/02/86/76/77/360_F_286767786_boXM75PDLYIsYWzabZ3fKcM3esv50TNS.jpg",
      body: "Arsenal",
      nameOfTeam: "Real Madrid",
      numberOfMembers: "12",
      sportsType: "Basketball",
    },
    {
      id: 4,
      logoimgurl:
        "https://media.istockphoto.com/id/517747677/vector/college-league-sport-team-logo-apparel-concept.jpg?s=612x612&w=0&k=20&c=tveFmguLfXICRt6Nc8oijlkqWpzaQPk6nKY2Vy_pGug=",
      bgimgurl:
        "https://st3.depositphotos.com/4327059/13950/v/1600/depositphotos_139502720-stock-illustration-people-engaging-in-different-sports.jpg",
      nameOfTeam: "Chelsea",
      numberOfMembers: "8",
      sportsType: "Football",
    },
  ];

  return (
    <>
      <div
        className="container justify-content-center text-center"
        style={{ width: "100%" }}
      >
        <Container>
          <Row className="align-items-end">
            <Col className="text-start">
              {/* <Button size="sm" variant="outline-secondary">
                <FaFilter></FaFilter>Filter
              </Button> */}
            </Col>
            <Col>
              <h1 className="center-header">TEAMS</h1>
            </Col>
            <Col className="text-end">
              {isSignedIn ?<Button
                size="sm"
                variant="outline-secondary"
                onClick={navigateCreateTeam}
              >
                <FaPlus></FaPlus> Create Team
              </Button> : ""}
              
            </Col>
          </Row>
        </Container>

        {teamListing.map((team) => {
          return (
            <div className="team-individual border-bottom p-2" key={team.id}>
              <div
                className="mt-2 text-center shadow-1-strong rounded text-white border border-danger"
                style={{
                  backgroundColor: "rgba(0,0,0,0.25)",
                  backgroundImage: `url(${team.bgimgurl}`,
                  backgroundPosition: "center",
                }}
              >
                <Container className="rounded team-list-container">
                  <Row className="text-center align-items-center mx-auto">
                    <Col
                      lg="2"
                      className="text-center justify-content-center align-items-center mx-auto"
                    >
                      <p className="mt-3">Team description here.</p>

                      <div className="mt-2 mb-2 w-50 h-100 justify-self-center text-center mx-auto rounded-pill" style={{"backgroundColor":"#116466"}}>
                      <p className="user-select-none">Open
                        {team.sportsType == "Basketball" ? (
                          <img
                            src="https://i.imgur.com/7Qa798a.png"
                            style={{ width: "2em", }}
                            className="text-center opacity-75 mt-1 mb-1 position-relative"
                          />
                        ) : (
                          <img
                            src="https://i.imgur.com/w14EKbv.png"
                            style={{ width: "2em" }}
                            className="text-center opacity-75 mt-1 mb-1 position-relative"
                          />
                        )}
                        </p> 
                      </div>
                    </Col>
                    <Col lg="8">
                      <a
                        className="link-over-to-left"
                        href={"/team/" + `${team.id}`}
                        data-replace={team.nameOfTeam}
                      >
                        <span>
                          <h1>{team.nameOfTeam}</h1>
                        </span>
                      </a>
                      <h6>Wins : 5</h6>
                    </Col>

                    <Col className="text-center align-items-center mx-auto ">
                      {" "}
                      <a href={"/team/" + `${team.id}`}>
                        {" "}
                        <Image
                          src={team.logoimgurl}
                          className="border border-info shadow object-fit-cover align-self-end ml-auto zoom-in-style"
                          roundedCircle
                          fluid
                          style={{ width: "5em", height: "5em" }}
                        />
                      </a>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="2"></Col>
                  </Row>
                </Container>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
