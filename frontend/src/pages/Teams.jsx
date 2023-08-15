import { FaFilter, FaPlus } from "react-icons/fa";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/auth";
import { useEffect, useState } from "react";

export default function Teams() {
  const {isSignedIn} = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamsList, setTeamsList] = useState([]);

  const navigateCreateTeam = () => {
    navigate("/createTeam");
  };
  const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";
  
  useEffect(()=>{
  fetch(`${backend}/teams`)
  .then(response=>response.json())
  .then(data=>{
    setErrorMessage([1,2,3])
    if (data.requestStatus === 'RJCT') {
      setErrorMessage([data.errMsg])
      setLoading(false);
      if (data.errField !== "") {
          document.getElementById(data.errField).focus()
          setLoading(false);
      }
  } else {
          setTeamsList(data.details)
          
          setLoading(false);
  }})
},[]);
  
  

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

      {loading ? (
            errorMessage.length===0 ? ( <div>
              <div className="center-wave">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div></div>
            
              ) : (<h1>No teams found</h1>)
           ) 
            : (
              <div>

      {teamsList.map((team) => (
        
          <div className="team-individual border-bottom p-2" key={team.teamId}>
            <div
              className="mt-2 text-center shadow-1-strong rounded text-white border border-danger"
              style={{
                
                backgroundImage: `url(${backend}/teambanners/${team.teamId}.jpeg`,
                backgroundColor: "rgba(0,0,0,0.25)",
                backgroundPosition: "center",
              }}
            >
              <Container className="rounded team-list-container">
                <Row className="text-center align-items-center mx-auto">
                  <Col
                    lg="2"
                    className="text-center justify-content-center align-items-center mx-auto"
                  >
                    <p className="mt-3">{team.description}</p>
                    <p className="mt-1">Division : {team.division[0].toUpperCase() + team.division.slice(1)}</p>

                    <div className="mt-2 mb-2 w-50 h-100 justify-self-center text-center mx-auto rounded-pill" style={{"backgroundColor":"#116466"}}>
                    <p className="user-select-none">{
                      !team.lookingForPlayers ? <a className="text-white text-decoration-none" href={"mailto:"+team.teamContactEmail}>Open</a> : ""
                    }
                      {team.sportsName == "Basketball" ? (
                        <img
                          src="https://i.imgur.com/w14EKbv.png"
                          style={{ width: "2em", }}
                          className="text-center opacity-75 mt-1 mb-1 position-relative"
                        />
                      ) : (
                        <img
                          src="https://i.imgur.com/7Qa798a.png"
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
                      href={"/team/" + `${team.teamId}`}
                      data-replace={team.teamName}
                    >
                      <span>
                        <h1>{team.teamName}</h1>
                      </span>
                    </a>
                    <h6>Wins : {team.numberOfwins}</h6>
                    <h6>{team.location}</h6>
                  </Col>

                  <Col className="text-center align-items-center mx-auto ">
                    {" "}
                    <a href={"/team/" + `${team.teamId}`}>
                      {" "}
                      <Image
                        src={`${backend}/teamlogos/${team.teamId}.jpeg`}
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
        ))
      }
      </div>
            )}
    </div>

  
      
    </>
  );
}
