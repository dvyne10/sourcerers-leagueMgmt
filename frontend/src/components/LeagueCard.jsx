import { useNavigate } from "react-router-dom";
import LiveCard from "./LiveCard";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import { format } from 'date-fns';

const backend = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://panicky-robe-mite.cyclic.app';


const LeagueCard = ({
  name,
  teams,
  status,
  totalTeams,
  teamsJoined,
  lookingForTeams,
  expanded,
  onClick,
  startDate,
  endDate,
  leagueAdmin,
  pastMatches
}) => {
  const active =
    lookingForTeams === false ? "disabled" : "";
  const backgroundColor =
    status === "ST"
      ? "#00ad43"
      : status === "EN"
      ? "#7a7a7a"
      : "ffffff";
  const statusIcon = () => (
    <>
      {
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            border: "1px solid rgba(0, 0, 0, 0.5)",
            backgroundColor: backgroundColor,
            margin: 12,
          }}
        ></div>
      }
    </>
  );

  const [open, setOpen] = useState(expanded);

  // Format the start and end dates
  const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd');
  const formattedEndDate = format(new Date(endDate), 'yyyy-MM-dd');

  const doesImageExist = (url) => {
    const img = new Image();
    img.src = url;
    return img.complete || (img.width + img.height) > 0;
  };

  const navigate = useNavigate();
  return (
    <div>
      <hr />
      <div className="d-flex justify-content-between px-5 py-2">
        <div
          className="d-flex align-items-center"
          onClick={onClick}
          style={{ cursor: "pointer" }}
        >
          {statusIcon()}
          {`${name} (${totalTeams} / ${teamsJoined})`}
        </div>
        <div>
          <button
            type="button"
            className={`${active} btn btn-secondary`}
            style={{
              borderRadius: 50,
              backgroundColor: lookingForTeams === true ? "#00ad43" : "grey",
            }}
            onClick={onClick}
          >
            Join
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => setOpen(!open)}
            aria-controls={`league-card`}
            aria-expanded={expanded}
          >
            {open ? (
              <i className="bi bi-caret-up-fill p-2"></i>
            ) : (
              <i className="bi bi-caret-down-fill p-2"></i>
            )}
          </button>
        </div>
      </div>
      <div>
      <Collapse in={open}>
        <div
          id={`league-card`}
          className="card m-3"
        >
          <div className="card-body d-flex flex-row overflow-auto">
          <div className="league-details px-5">
            <div className="fs-6 fw-light">
              <p className="p-0 m-0" style={{marginTop: '10%',width: '150px'}}>League Start Date</p>
              <p>{formattedStartDate}</p>
            </div>
            <div className="fs-6 fw-light">
              <p className="p-0 m-0">League End Date</p>
              <p>{formattedEndDate}</p>
            </div>
            <div className="fs-6 fw-light">
              <p className="p-0 m-0">League Admin</p>
              <p>{leagueAdmin}</p>
            </div>
          </div>
          <div className="d-flex" >
          {pastMatches.length === 0 ? (
            <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
                {teams.map((team) => (
                  <div key={team.teamId}>
                    <img  src={
                            doesImageExist(`${backend}/teamlogos/${team.teamId}.jpeg`)
                              ? `${backend}/teamlogos/${team.teamId}.jpeg`
                              : `${backend}/teamlogos/default-image.jpeg`
                          } 
                  alt={`Team ${team.teamName}`} 
                  style={{width: '100px', height:'100px'}}/>
                  </div>
                ))}
            </div>
          ) : (
            pastMatches.map((match, index) => (
              <LiveCard
                key={index} 
                match={match}
                onClickTeamIcon={() => {
                  navigate(`/team/${match.team1.teamId}`);
                }}
              />
            ))
          )}
          </div>
          </div>
          
        </div>
      </Collapse>
      </div>
     
    </div>
  );
};

LeagueCard.propTypes = {
  name: PropTypes.string,
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      approvedBy: PropTypes.string,
      joinedTimestamp: PropTypes.string,
      teamId: PropTypes.string.isRequired,
      teamName: PropTypes.string.isRequired,
    })
  ),
  status: PropTypes.string,
  teamsJoined: PropTypes.number,
  lookingForTeams: PropTypes.bool,
  totalTeams: PropTypes.number,
  expanded: PropTypes.bool,
  onClick: PropTypes.func,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  leagueAdmin: PropTypes.string,
  pastMatches: PropTypes.arrayOf(
    PropTypes.shape({
      dateOfMatch: PropTypes.string,
      locationOfMatch: PropTypes.string,
      matchId: PropTypes.string,
      team1: PropTypes.shape({
        createdAt: PropTypes.string,
        finalScore: PropTypes.number,
        finalScorePending: PropTypes.any, 
        leaguePoints: PropTypes.number,
        leaguePointsPending: PropTypes.any, 
        teamId: PropTypes.string,
        updatedAt: PropTypes.string,
        _id: PropTypes.string,
      }),
      team2: PropTypes.shape({
        createdAt: PropTypes.string, 
        finalScore: PropTypes.number,
        finalScorePending: PropTypes.any, 
        leaguePoints: PropTypes.number,
        leaguePointsPending: PropTypes.any, 
        teamId: PropTypes.string,
        updatedAt: PropTypes.string, 
        _id: PropTypes.string,
      })
    })
  )
};

export default LeagueCard;
