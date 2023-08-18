import { FaFilter } from "react-icons/fa";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import useAuth, {checkIfSignedIn, getToken} from "../hooks/auth";

export default function Players() {

  const {isSignedIn} = useAuth()
  const routeParams = useParams();
  const token = `Bearer ${getToken()}`
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState([]);
  const [playerListing, setPlayerListing] = useState([]);

  const [action, handleAction] = useState({type: "usprofile", title: "Profile"});
  const navigate = useNavigate();



const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";


useEffect(() => {

  fetch(`${backend}/players`, {
    headers: {
        "Content-Type": "Application/JSON",
        "Authorization": token
    }
})
    .then(response => response.json())
    .then(data=>{
        
        if (data.requestStatus === 'RJCT') {
            setErrorMessage([data.errMsg])
            if (data.errField !== "") {
                document.getElementById(data.errField).focus()
            }
        } else {
          
                setPlayerListing(data.details);
                setLoading(false);
    }
})
.catch((error) => {
    console.log(error)
})

},[]);

 

  return (
    <>
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
            
              ) : (<h1>No players found</h1>)
           ) 
            : (
      <div
        className="container justify-content-center text-center rounded"
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
{playerListing.map(player=>(
 <div className="team-individual border-bottom p-2" key={player.playerId}>
             <a href={"/player/" + player.playerId} className="general-link-no-dec text-decoration-none">
               <div className="mt-2 text-center shadow-1-strong rounded text-white">
                  <Row className="text-center align-items-center mx-auto rounded player-list-container">
                     <Col
                       lg="1"
                       className="text-center rounded-start p-2"
                       style={{ backgroundColor: "#1c1b22" }}
                     >
                       <a
                         href={`/player/${player.playerId}`}
                         className="link-general-style"
                       >
                         {" "}
                         <Image
                           src={`${backend}/profilepictures/${player.playerId}.jpeg`}
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
                      
                       {player.fullName}
                     </Col>
                     <Col lg="3" className="text-center">
                       <h1></h1>
                       <h6>{player.activeTeams.map((teams) => {
           return (<a className="general-link-no-dec text-white" href={`/team/${teams.teamId}`} key={teams.teamId}>{teams.teamName}</a>)})}</h6>
                     </Col>
                     <Col lg="3" className="text-center">
                       <h1></h1>
                       <h6>{player.location}</h6>
                     </Col>
                     <Col lg="2">
                       <h6>{player.wins}</h6>
                     </Col>
                     <Col lg="1">
                       {player.sports.map(sport=>(
                        <h6 key={sport.sportsTypeId}>{sport.sportsName}</h6>
                       ))}
                     </Col>
                   </Row>
                 </div>
               </a>
             </div>
))}
      </div>
      )}
    </>
  );
}
