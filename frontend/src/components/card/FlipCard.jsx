import './flipCard.css';
import './flipTransition.css';
import PropTypes from 'prop-types'; 
import { useNavigate } from 'react-router-dom';

const FlipCard = ({onClick, imageUrl, cardText}) => {
    const navigate = useNavigate(); 
    const navigateTeamLinks = (teamId) => {
        navigate(`/team/${teamId}`);
    }

    console.log("Flip card being rendered"); 
    return (
        <div className="card-wrapper" onClick={onClick}>
            <div className="card-back">
                Teams
                <div className="team-link">
                    <a onClick={() => navigateTeamLinks('Dragon Fire')}>Dragon Fire</a>
                </div>
                <div className="team-link">
                    <a onClick={() => navigateTeamLinks('Real Madrid')}>Real Madrid</a>
                </div>
                <div className="team-link">
                    <a onClick={() => navigateTeamLinks('Manchester United')}>Manchester United</a>
                </div>
                <div className="team-link">
                    <a onClick={() => navigateTeamLinks('We Go Together')}>We Go Together</a>
                </div>
            </div>
            <div className="card-front" style={{backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover'}}>
                {cardText}
            </div>
        </div>
    );
}

FlipCard.propTypes = {
    onClick: PropTypes.func,
    imageUrl: PropTypes.string,
    cardText: PropTypes.string
}; 

export default FlipCard; 
