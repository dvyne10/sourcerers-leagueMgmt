import PropTypes from "prop-types";
import {format} from 'date-fns'; 

const backend = import.meta.env.MODE === 'development' ? 'http://localhost:8000' : 'https://panicky-robe-mite.cyclic.app/';

const LiveCard = ({ match, onClickTeamIcon }) => {
  const formattedMatchDate = format(new Date(match.dateOfMatch), 'yyyy-MM-dd');
  const timeOfMatch = format(new Date(match.dateOfMatch), 'HH:mm'); 
  return (
    <div className="card card-body m-2">
      <div className="d-flex justify-content-between">
        <div
          style={{ width: 80, height: 80, borderRadius: 40, marginRight: 20 }}
          onClick={onClickTeamIcon}
        >
          <img
            src={`${backend}/teamlogos/${match.team1.teamId}.jpeg`}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            alt=""
          />
        </div>
        <div className="d-flex align-items-center">
          <p>vs</p>
        </div>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginLeft: 20,
          }}
          onClick={onClickTeamIcon}
        >
          <img
            src={`${backend}/teamlogos/${match.team2.teamId}.jpeg`}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: 40,
            }}
            alt=""
          />
        </div>
      </div>
      <div>
        <hr />
      </div>
      <div className="d-flex p-0 m-0 justify-content-center">
        <p className="p-0 m-0">{formattedMatchDate}</p>
        <div
          style={{
            width: 1,
            marginInline: 5,
            backgroundColor: "#666869",
          }}
        ></div>
        <p className="p-0 m-0">{timeOfMatch}</p>
      </div>
    </div>
  );
};

LiveCard.propTypes = {
  match: PropTypes.shape({
    dateOfMatch: PropTypes.string,
    locationOfMatch: PropTypes.string,
    team1: PropTypes.shape({
      teamId: PropTypes.string,
    }),
    team2: PropTypes.shape({
      teamId: PropTypes.string,
    }),
  }),
  onClickTeamIcon: PropTypes.func,
};

export default LiveCard;
