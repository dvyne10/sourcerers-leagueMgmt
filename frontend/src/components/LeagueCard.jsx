import { useNavigate } from "react-router-dom";
import LiveCard from "./LiveCard";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Collapse from "react-bootstrap/Collapse";

const LeagueCard = ({
  name,
  status,
  totalTeams,
  teamsJoined,
  expanded,
  onClick,
}) => {
  const active =
    status === "ongoing" || status === "finished" ? "disabled" : "";
  const backgroundColor =
    status === "ongoing"
      ? "#00ad43"
      : status === "finished"
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
          {`${name}(${teamsJoined} / ${totalTeams})`}
        </div>
        <div>
          <button
            type="button"
            className={`${active} btn btn-secondary`}
            style={{
              borderRadius: 50,
              backgroundColor: status === "open" ? "#00ad43" : "",
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
            aria-expanded={open}
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
              <p className="p-0 m-0">League Start Date</p>
              <p>12/07/2023</p>
            </div>
            <div className="fs-6 fw-light">
              <p className="p-0 m-0">League End Date</p>
              <p>12/07/2023</p>
            </div>
            <div className="fs-6 fw-light">
              <p className="p-0 m-0">League Admin</p>
              <p>Divine</p>
            </div>
          </div>
          <div className="d-flex">
            <LiveCard
              onClickTeamIcon={() => {
                navigate("/team/1");
              }}
            />
            <LiveCard
              onClickTeamIcon={() => {
                navigate("/team/2");
              }}
            />
            <LiveCard
              onClickTeamIcon={() => {
                navigate("/team/3");
              }}
            />
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
  status: PropTypes.string,
  teamsJoined: PropTypes.number,
  totalTeams: PropTypes.number,
  expanded: PropTypes.bool,
  onClick: PropTypes.func,
};

export default LeagueCard;
