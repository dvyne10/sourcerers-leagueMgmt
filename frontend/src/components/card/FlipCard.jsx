import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './flipCard.css';
import './flipTransition.css';

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app/";

const FlipCard = ({ onClick, imageUrl, cardText, teams }) => {
  return (
    <div className="card-wrapper" onClick={onClick}>
      <div className="card-back">
        <h3>Teams</h3>
        <div className="scrollable-container">
          <table>
            <tbody>
              {teams.map((team) => (
                <tr className="team-row" key={team.teamId}>
                  <td className="logo-container">
                    <img
                      className="team-logo"
                      src={`${backend}/teamlogos/${team.teamId}.jpeg`}
                      alt={team.teamName}
                    />
                  </td>
                  <td className="team-link">
                    <Link className="team-link" to={`/team/${team.teamId}`}>
                      {team.teamName}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="card-front"
        style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}
      >
        <Link className="card-text" to={`/league/123`}>
          {cardText}
        </Link>
        <div className="overlay">Click to flip!</div>
      </div>
    </div>
  );
};

FlipCard.propTypes = {
  onClick: PropTypes.func,
  imageUrl: PropTypes.string,
  cardText: PropTypes.string,
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      teamId: PropTypes.string.isRequired,
      teamName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FlipCard;
